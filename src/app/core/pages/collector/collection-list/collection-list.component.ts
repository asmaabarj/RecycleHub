import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionRequest } from '../../../models/collection-request.model';
import * as CollectionActions from '../../../state/collection/collection.actions';
import { PhotoModalComponent } from '../../../shared/components/photo-modal/photo-modal.component';
import { CollectionPhotosComponent } from '../../../shared/components/collection-photos/collection-photos.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-collector-collection-list',
  standalone: true,
  imports: [
    CommonModule, 
    PhotoModalComponent,
    CollectionPhotosComponent
  ],
  templateUrl: './collection-list.component.html'
})
export class CollectorCollectionListComponent implements OnInit {
  collections$: Observable<CollectionRequest[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedPhotoUrl: string | null = null;

  constructor(
    private store: Store<{
      collection: {
        requests: CollectionRequest[],
        loading: boolean,
        error: string | null
      },
      auth: { user: User | null }
    }>
  ) {
    this.collections$ = combineLatest([
      this.store.select(state => state.collection.requests),
      this.store.select(state => state.auth.user)
    ]).pipe(
      map(([collections, user]) => 
        collections.filter(collection => 
          collection.status !== 'validee' && collection.status !== 'rejetee' && 
          collection.city === user?.city
        )
      )
    );

    this.loading$ = this.store.select(state => state.collection.loading);
    this.error$ = this.store.select(state => state.collection.error);
  }

  ngOnInit() {
    this.store.dispatch(CollectionActions.loadCollections());
  }

  selectCollection(collectionId: string) {
    const collectionsStr = localStorage.getItem('collections');
    if (collectionsStr) {
      const collections = JSON.parse(collectionsStr);
      
      const updatedCollections = collections.map((collection: CollectionRequest) => {
        if (collection.id === collectionId) {
          return { ...collection, status: 'occupee' };
        }
        return collection;
      });

      localStorage.setItem('collections', JSON.stringify(updatedCollections));
      
      this.store.dispatch(CollectionActions.updateCollectionStatus({ 
        collectionId, 
        status: 'occupee' 
      }));

      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  }

  startCollection(collectionId: string) {
    const collectionsStr = localStorage.getItem('collections');
    if (collectionsStr) {
      const collections = JSON.parse(collectionsStr);
      
      const updatedCollections = collections.map((collection: CollectionRequest) => {
        if (collection.id === collectionId) {
          return { ...collection, status: 'en_cours' };
        }
        return collection;
      });

      localStorage.setItem('collections', JSON.stringify(updatedCollections));
      
      this.store.dispatch(CollectionActions.updateCollectionStatus({ 
        collectionId, 
        status: 'en_cours' 
      }));

      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  }

  rejectCollection(collectionId: string) {
    const collectionsStr = localStorage.getItem('collections');
    if (collectionsStr) {
      const collections = JSON.parse(collectionsStr);
      
      const updatedCollections = collections.map((collection: CollectionRequest) => {
        if (collection.id === collectionId) {
          return { ...collection, status: 'rejetee' };
        }
        return collection;
      });

      localStorage.setItem('collections', JSON.stringify(updatedCollections));
      
      this.store.dispatch(CollectionActions.updateCollectionStatus({ 
        collectionId, 
        status: 'rejetee' 
      }));

      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  }

  validateCollection(collectionId: string) {
    const collectionsStr = localStorage.getItem('collections');
    if (collectionsStr) {
      const collections = JSON.parse(collectionsStr);
      
      const updatedCollections = collections.map((collection: CollectionRequest) => {
        if (collection.id === collectionId) {
          return { ...collection, status: 'validee' };
        }
        return collection;
      });

      localStorage.setItem('collections', JSON.stringify(updatedCollections));
      
      this.store.dispatch(CollectionActions.updateCollectionStatus({ 
        collectionId, 
        status: 'validee' 
      }));

      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  }

  openPhotoModal(photoUrl: string) {
    this.selectedPhotoUrl = photoUrl;
  }

  closePhotoModal() {
    this.selectedPhotoUrl = null;
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'en_attente': 'En attente',
      'occupee': 'Occupée',
      'validee': 'Validée',
      'rejetee': 'Rejetée',
      'en_cours': 'En cours'
    };
    return statusMap[status] || status;
  }
}
