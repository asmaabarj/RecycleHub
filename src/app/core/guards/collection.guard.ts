import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionGuard implements CanActivate {
  constructor(
    private store: Store<{ auth: { user: User | null } }>,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(state => state.auth.user).pipe(
      take(1),
      map(user => {
        // Vérifie si l'utilisateur est connecté et est un particulier
        if (user && user.userType === 'particular') {
          return true;
        }
        
        // Redirige vers la page de connexion si non connecté
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }
        
        // Redirige vers le profil si l'utilisateur n'est pas un particulier
        return this.router.createUrlTree(['/profile']);
      })
    );
  }
}