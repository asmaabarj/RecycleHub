import { createReducer, on } from '@ngrx/store';
import * as CollectionActions from './collection.actions';

export interface CollectionState {
  requests: any[];
  loading: boolean;
  error: string | null;
}

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
  on(CollectionActions.addCollection, (state, { collection }) => ({
    ...state,
    requests: [...state.requests, collection]
  })),
  on(CollectionActions.collectionError, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(CollectionActions.deleteCollection, (state) => ({
    ...state,
    loading: true
  })),
  on(CollectionActions.deleteCollectionSuccess, (state, { id }) => ({
    ...state,
    requests: state.requests.filter(request => request.id !== id),
    loading: false
  })),
  on(CollectionActions.deleteCollectionFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);