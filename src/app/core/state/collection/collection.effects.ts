import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { CollectionService } from '../../services/collection.service';
import * as CollectionActions from './collection.actions';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../app.state';

interface CollectionRequest {
  status: string;
}

@Injectable()
export class CollectionEffects {
  saveCollections$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CollectionActions.addCollection),
      tap(() => {
        const currentState = this.store.select(state => state.collection.requests);
        currentState.pipe(take(1)).subscribe(requests => {
          localStorage.setItem('collections', JSON.stringify(requests));
        });
      })
    ),
    { dispatch: false }
  );

  loadCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.loadCollections),
      map(() => {
        const savedCollections = localStorage.getItem('collections');
        const collections = savedCollections ? JSON.parse(savedCollections) : [];
        return CollectionActions.loadCollectionsSuccess({ collections });
      })
    )
  );

  addCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.addCollection),
      map(action => CollectionActions.addCollectionSuccess({ collection: action.collection }))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private collectionService: CollectionService,
    private authService: AuthService
  ) {}
}