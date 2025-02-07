import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { CollectionRequest, WasteType } from '../models/collection-request.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private readonly COLLECTIONS_KEY = 'collections';
  
  constructor(private storageService: StorageService) {}

  getUserCollections(userId: string): Observable<CollectionRequest[]> {
    const collections = this.storageService.getData<CollectionRequest[]>(this.COLLECTIONS_KEY) || [];
    return of(collections.filter(c => c.userId === userId));
  }

  addCollection(collection: Omit<CollectionRequest, 'id' | 'createdAt' | 'updatedAt'>): Observable<CollectionRequest> {
    const collections = this.storageService.getData<CollectionRequest[]>(this.COLLECTIONS_KEY) || [];
    
    const pendingRequests = collections.filter(
      c => c.userId === collection.userId && 
      (c.status === 'en_attente' || c.status === 'validee')
    );

    const totalWeight = collection.wasteTypes.reduce((sum, waste) => sum + waste.weight, 0);
    if (totalWeight > 10000) { 
      return throwError(() => 'Le poids total ne peut pas dépasser 10kg');
    }

    if (totalWeight < 1000) { 
      return throwError(() => 'Le poids minimum est de 1kg');
    }

    const newCollection: CollectionRequest = {
      ...collection,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'en_attente'
    };

    collections.push(newCollection);
    this.storageService.saveData(this.COLLECTIONS_KEY, collections);
    
    return of(newCollection);
  }

  updateCollection(id: string, updates: Partial<CollectionRequest>): Observable<CollectionRequest> {
    const collections = this.storageService.getData<CollectionRequest[]>(this.COLLECTIONS_KEY) || [];
    const index = collections.findIndex(c => c.id === id);
    
    if (index === -1) {
      return throwError(() => 'Collection non trouvée');
    }

    const collection = collections[index];
    if (collection.status !== 'en_attente') {
      return throwError(() => 'Seules les demandes en attente peuvent être modifiées');
    }

    const updatedCollection = {
      ...collection,
      ...updates,
      updatedAt: new Date()
    };

    collections[index] = updatedCollection;
    this.storageService.saveData(this.COLLECTIONS_KEY, collections);
    
    return of(updatedCollection);
  }

  deleteCollection(id: string): Observable<void> {
    const collections = this.storageService.getData<CollectionRequest[]>(this.COLLECTIONS_KEY) || [];
    const collection = collections.find(c => c.id === id);
    
    if (!collection) {
      return throwError(() => 'Collection non trouvée');
    }

    if (collection.status !== 'en_attente') {
      return throwError(() => 'Seules les demandes en attente peuvent être supprimées');
    }

    const updatedCollections = collections.filter(c => c.id !== id);
    this.storageService.saveData(this.COLLECTIONS_KEY, updatedCollections);
    
    return of(void 0);
  }

  private async processPhotos(files: File[]): Promise<string[]> {
    const photos: string[] = [];
    for (const file of files) {
      const base64 = await this.convertToBase64(file);
      photos.push(base64);
    }
    return photos;
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}