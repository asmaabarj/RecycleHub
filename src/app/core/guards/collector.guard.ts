import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CollectorGuard implements CanActivate {
  constructor(
    private store: Store<{ auth: { user: User | null } }>,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(state => state.auth.user).pipe(
      take(1),
      map(user => {
        if (user && user.userType === 'collector') {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}