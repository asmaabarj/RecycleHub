import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '../models/user.model';
import { first } from 'rxjs';

export const userResolver: ResolveFn<User | null> = () => {
  const store = inject(Store<{ auth: { user: User | null } }>);
  return store.select(state => state.auth.user).pipe(first());
};