import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { CollectionService } from '../../services/collection.service';
import * as CollectionActions from './collection.actions';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../app.state';



@Injectable()
export class CollectionEffects {
  saveCollections$ = createEffect(() => 
    this.actions$.pipe(
      ofType(
        CollectionActions.addCollectionSuccess,
        CollectionActions.deleteCollectionSuccess
      ),
      withLatestFrom(this.store.select(state => state.collection.requests)),
      tap(([_, requests]) => {
        const collectionsToSave = requests.map(collection => ({
          ...collection,
          id: collection.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        localStorage.setItem('collections', JSON.stringify(collectionsToSave));
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

  deleteCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.deleteCollection),
      mergeMap(({ id }) =>
        this.collectionService.deleteCollection(id).pipe(
          map(() => CollectionActions.deleteCollectionSuccess({ id })),
          catchError(error => of(CollectionActions.deleteCollectionFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private collectionService: CollectionService,
  ) {}
}