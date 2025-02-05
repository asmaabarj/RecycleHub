import { createReducer, on } from '@ngrx/store';
import { CollectionState } from '../../models/collection-request.model';
import * as CollectionActions from './collection.actions';

export const initialState: CollectionState = {
  requests: [],
  loading: false,
  error: null
};

export const collectionReducer = createReducer(
  initialState,
  on(CollectionActions.loadCollections, (state) => ({
    ...state,
    loading: true
  })),
  on(CollectionActions.loadCollectionsSuccess, (state, { collections }) => ({
    ...state,
    requests: collections,
    loading: false
  })),
  on(CollectionActions.addCollectionSuccess, (state, { collection }) => ({
    ...state,
    requests: [...state.requests, collection]
  })),
  on(CollectionActions.updateCollectionSuccess, (state, { collection }) => ({
    ...state,
    requests: state.requests.map(req => 
      req.id === collection.id ? collection : req
    )
  })),
  on(CollectionActions.deleteCollectionSuccess, (state, { id }) => ({
    ...state,
    requests: state.requests.filter(req => req.id !== id)
  })),
  on(CollectionActions.collectionError, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);