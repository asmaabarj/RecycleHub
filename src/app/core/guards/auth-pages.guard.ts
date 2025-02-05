import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  error: string | null;
}

export const authPagesGuard = () => {
  const router = inject(Router);
  const store = inject(Store<{ auth: AuthState }>);

  return store.select(state => state.auth.isAuthenticated).pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/profile']);
        return false;
      }
      return true;
    })
  );
};