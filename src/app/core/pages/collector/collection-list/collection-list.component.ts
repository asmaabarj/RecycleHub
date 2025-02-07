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
          collection.status === 'en_attente' && 
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

  openPhotoModal(photoUrl: string) {
    this.selectedPhotoUrl = photoUrl;
  }

  closePhotoModal() {
    this.selectedPhotoUrl = null;
  }
}
