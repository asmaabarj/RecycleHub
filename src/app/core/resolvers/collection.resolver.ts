import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter, map, take } from 'rxjs';
import { CollectionRequest } from '../models/collection-request.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionResolver implements Resolve<CollectionRequest | undefined> {
  constructor(private store: Store<{ collection: { requests: CollectionRequest[] } }>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CollectionRequest | undefined> {
    const id = route.paramMap.get('id');

    return this.store.select(state => state.collection.requests).pipe(
      filter(requests => requests.length > 0),
      map(requests => requests.find(r => r.id === id)),
      take(1)
    );
  }
} 