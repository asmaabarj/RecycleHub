import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './core/state/auth/auth.reducer';
import { CollectionEffects } from './core/state/collection/collection.effects';
import { collectionReducer } from './core/state/collection/collection.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      collection: collectionReducer
    }),
    provideEffects(CollectionEffects)
  ]
};
