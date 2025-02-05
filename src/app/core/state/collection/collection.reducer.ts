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
  on(CollectionActions.addCollection, (state, { collection }) => {
    const pendingRequests = state.requests.filter(req => req.status === 'en_attente');
    if (pendingRequests.length >= 3) {
      return {
        ...state,
        error: 'Maximum 3 demandes en attente autorisées'
      };
    }
    return {
      ...state,
      requests: [...state.requests, collection]
    };
  }),
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