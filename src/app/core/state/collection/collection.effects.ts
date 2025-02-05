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
  // ... autres propriétés
}

@Injectable()
export class CollectionEffects {
  saveCollections$ = createEffect(() => 
    this.actions$.pipe(
      ofType(
        CollectionActions.addCollection,
        CollectionActions.updateCollection,
        CollectionActions.deleteCollection
      ),
      tap(() => {
        // Sauvegarder l'état actuel après chaque modification
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
      withLatestFrom(this.store.select(state => state.collection.requests)),
      map(([action, requests]) => {
        const pendingRequests = requests.filter((req: CollectionRequest) => req.status === 'en_attente');
        if (pendingRequests.length >= 3) {
          return CollectionActions.addCollectionFailure({
            error: 'Vous avez déjà atteint la limite de 3 demandes en attente'
          });
        }
        return CollectionActions.addCollectionSuccess({ collection: action.collection });
      })
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