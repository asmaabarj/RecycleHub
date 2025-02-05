import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { CollectionService } from '../../services/collection.service';
import * as CollectionActions from './collection.actions';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../app.state';

@Injectable()
export class CollectionEffects {
  loadCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.loadCollections),
      withLatestFrom(this.store.select((state: AppState) => state.auth.user)),
      mergeMap(([_, user]) => 
        this.collectionService.getUserCollections(user!.id).pipe(
          map(collections => CollectionActions.loadCollectionsSuccess({ collections })),
          catchError(error => of(CollectionActions.collectionError({ error: error.message })))
        )
      )
    )
  );

  addCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.addCollection),
      mergeMap(({ collection }) =>
        this.collectionService.addCollection(collection).pipe(
          map(newCollection => CollectionActions.addCollectionSuccess({ collection: newCollection })),
          catchError(error => of(CollectionActions.collectionError({ error: error.message })))
        )
      )
    )
  );

  updateCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.updateCollection),
      mergeMap(({ id, collection }) =>
        this.collectionService.updateCollection(id, collection).pipe(
          map(updatedCollection => CollectionActions.updateCollectionSuccess({ collection: updatedCollection })),
          catchError(error => of(CollectionActions.collectionError({ error: error.message })))
        )
      )
    )
  );

  deleteCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.deleteCollection),
      mergeMap(({ id }) =>
        this.collectionService.deleteCollection(id).pipe(
          map(() => CollectionActions.deleteCollectionSuccess({ id })),
          catchError(error => of(CollectionActions.collectionError({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private collectionService: CollectionService,
    private authService: AuthService
  ) {}
}