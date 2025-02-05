import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { CollectionRequest } from '../../../models/collection-request.model';
import { User } from '../../../models/user.model';
import * as CollectionActions from '../../../state/collection/collection.actions';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './collection-list.component.html'
})
export class CollectionListComponent implements OnInit {
  collections$: Observable<CollectionRequest[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store<{ 
      collection: { requests: CollectionRequest[], loading: boolean, error: string | null },
      auth: { user: User | null }
    }>
  ) {
    // Combiner les collections et l'utilisateur pour filtrer
    this.collections$ = combineLatest([
      this.store.select(state => state.collection.requests),
      this.store.select(state => state.auth.user)
    ]).pipe(
      map(([collections, user]) => {
        if (!user) return [];
        return collections.filter(collection => collection.userId === user.id);
      })
    );

    this.loading$ = this.store.select(state => state.collection.loading);
    this.error$ = this.store.select(state => state.collection.error);
  }

  ngOnInit() {
    this.store.dispatch(CollectionActions.loadCollections());
  }

  onDelete(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.store.dispatch(CollectionActions.deleteCollection({ id }));
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'validé':
        return 'bg-green-500/20 text-green-500';
      case 'rejeté':
        return 'bg-red-500/20 text-red-500';
      case 'terminé':
        return 'bg-blue-500/20 text-blue-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'validé':
        return 'Validé';
      case 'rejeté':
        return 'Rejeté';
      case 'terminé':
        return 'Terminé';
      default:
        return status;
    }
  }

  calculateTotalWeight(wasteTypes: any[]): number {
    return wasteTypes.reduce((sum, waste) => sum + waste.weight, 0);
  }
} 