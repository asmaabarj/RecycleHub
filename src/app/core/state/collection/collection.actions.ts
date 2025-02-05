import { createAction, props } from '@ngrx/store';
import { CollectionRequest } from '../../models/collection-request.model';

export const loadCollections = createAction('[Collection] Load Collections');
export const loadCollectionsSuccess = createAction(
  '[Collection] Load Collections Success',
  props<{ collections: CollectionRequest[] }>()
);

export const addCollection = createAction(
  '[Collection] Add Collection',
  props<{ collection: CollectionRequest }>()
);

export const addCollectionSuccess = createAction(
  '[Collection] Add Collection Success',
  props<{ collection: CollectionRequest }>()
);

export const addCollectionFailure = createAction(
  '[Collection] Add Collection Failure',
  props<{ error: string }>()
);

export const updateCollection = createAction(
  '[Collection] Update Collection',
  props<{ id: string; collection: Partial<CollectionRequest> }>()
);
export const updateCollectionSuccess = createAction(
  '[Collection] Update Collection Success',
  props<{ collection: CollectionRequest }>()
);

export const deleteCollection = createAction(
  '[Collection] Delete Collection',
  props<{ id: string }>()
);
export const deleteCollectionSuccess = createAction(
  '[Collection] Delete Collection Success',
  props<{ id: string }>()
);

export const collectionError = createAction(
  '[Collection] Error',
  props<{ error: string }>()
);