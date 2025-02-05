import { AuthState } from './auth/auth.reducer';
import { CollectionState } from './collection/collection.reducer';

export interface AppState {
  auth: AuthState;
  collection: CollectionState;
}