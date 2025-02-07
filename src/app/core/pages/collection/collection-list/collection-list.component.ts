import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { CollectionRequest } from '../../../models/collection-request.model';
import { User } from '../../../models/user.model';
import * as CollectionActions from '../../../state/collection/collection.actions';
import { PhotoModalComponent } from '../../../shared/components/photo-modal/photo-modal.component';
import { CollectionPhotosComponent } from '../../../shared/components/collection-photos/collection-photos.component';
import { DeleteAlertComponent } from '../../../shared/components/delete-alert/delete-alert.component';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    PhotoModalComponent,
    CollectionPhotosComponent,
    DeleteAlertComponent
  ],
  templateUrl: './collection-list.component.html'
})
export class CollectionListComponent implements OnInit {
  collections$: Observable<CollectionRequest[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedPhotoUrl: string | null = null;
  showDeleteAlert = false;
  collectionToDelete: string | null = null;

  constructor(
    private store: Store<{ 
      collection: { requests: CollectionRequest[], loading: boolean, error: string | null },
      auth: { user: User | null }
    }>
  ) {
    this.collections$ = combineLatest([
      this.store.select(state => state.collection.requests),
      this.store.select(state => state.auth.user)
    ]).pipe(
      map(([collections, user]) => {
        if (!user) return [];
        return collections.filter(collection => collection.userId === user.id);
      })
    );

    this.loading$ = this.store.select(state => state.collection.loading);
    this.error$ = this.store.select(state => state.collection.error);
  }

  ngOnInit() {
    this.store.dispatch(CollectionActions.loadCollections());
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'validee':
        return 'bg-green-500/20 text-green-500';
      case 'rejetee':
        return 'bg-red-500/20 text-red-500';
      case 'en_cours':
        return 'bg-blue-500/20 text-blue-500';
      case 'occupee':
        return 'bg-purple-500/20 text-purple-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'validee':
        return 'Validé';
      case 'rejetee':
        return 'Rejeté';
      case 'en_cours':
        return 'En cours';
      case 'occupee':
        return 'Occupée';
      default:
        return status;
    }
  }

  calculateTotalWeight(wasteTypes: any[]): number {
    return wasteTypes.reduce((sum, waste) => sum + waste.weight, 0);
  }

  openPhotoModal(photoUrl: string) {
    this.selectedPhotoUrl = photoUrl;
  }

  closePhotoModal() {
    this.selectedPhotoUrl = null;
  }

  deleteCollection(id: string) {
    this.collectionToDelete = id;
    this.showDeleteAlert = true;
  }

  confirmDelete() {
    if (this.collectionToDelete) {
      this.store.dispatch(CollectionActions.deleteCollection({ id: this.collectionToDelete }));
      this.showDeleteAlert = false;
      this.collectionToDelete = null;
    }
  }

  cancelDelete() {
    this.showDeleteAlert = false;
    this.collectionToDelete = null;
  }

  canDelete(status: string): boolean {
    return status === 'en_attente';
  }

  canEdit(status: string): boolean {
    return status === 'en_attente';
  }

  getActiveCollectionsCount(collections: CollectionRequest[]): number {
    return collections.filter(c => 
      c.status === 'en_attente' || 
      c.status === 'occupee' || 
      c.status === 'en_cours'
    ).length;
  }
} 