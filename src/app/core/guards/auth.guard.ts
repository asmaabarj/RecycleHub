import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const currentUser = localStorage.getItem('currentUser');
  
  if (currentUser) {
    return of(true);
  } else {
    router.navigate(['/login']);
    return of(false);
  }
};