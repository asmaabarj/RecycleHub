import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take, withLatestFrom } from 'rxjs';
import { User } from '../models/user.model';
import { CollectionRequest } from '../models/collection-request.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionGuard implements CanActivate {
  constructor(
    private store: Store<{ 
      auth: { user: User | null },
      collection: { requests: CollectionRequest[] }
    }>,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.store.select(state => state.auth.user).pipe(
      withLatestFrom(this.store.select(state => state.collection.requests)),
      take(1),
      map(([user, collections]) => {
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }

        if (user.userType !== 'particular') {
          return this.router.createUrlTree(['/profile']);
        }

        // Si on est sur une page de détail/édition, vérifier que l'utilisateur est propriétaire
        const collectionId = route.params['id'];
        if (collectionId) {
          const collection = collections.find(c => c.id === collectionId);
          if (!collection || collection.userId !== user.id) {
            return this.router.createUrlTree(['/collections']);
          }
        }

        return true;
      })
    );
  }
}