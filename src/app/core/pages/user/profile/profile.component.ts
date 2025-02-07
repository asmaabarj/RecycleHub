import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../models/user.model';
import { CollectionRequest } from '../../../models/collection-request.model';
import * as AuthActions from '../../../state/auth/auth.actions';
import { AuthService } from '../../../services/auth.service';
import { DeleteAlertComponent } from '../../../shared/components/delete-alert/delete-alert.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, DeleteAlertComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user$: Observable<User | null>;
  showDeleteAlert = false;
  userPoints$: Observable<number>;
  canConvert$: Observable<boolean>;

  constructor(
    private store: Store<{ 
      auth: { user: User | null },
      collection: { requests: CollectionRequest[] }
    }>,
    private authService: AuthService,
    private router: Router
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.user$ = currentUser ? of(currentUser) : this.store.select(state => state.auth.user);
    
    // Calcul des points
    this.userPoints$ = combineLatest([
      this.user$,
      this.store.select(state => state.collection.requests)
    ]).pipe(
      map(([user, collections]) => {
        if (!user) return 0;
        
        return collections
          .filter(c => c.userId === user.id && c.status === 'validee')
          .reduce((totalPoints, collection) => {
            return totalPoints + this.calculateCollectionPoints(collection.wasteTypes);
          }, 0);
      })
    );

    // Vérification si les points sont > 100
    this.canConvert$ = this.userPoints$.pipe(
      map(points => points >= 100)
    );
  }

  private calculateCollectionPoints(wasteTypes: any[]): number {
    const pointsPerKg: { [key: string]: number } = {
      'plastique': 2,
      'verre': 1,
      'papier': 1,
      'metal': 5
    };

    return wasteTypes.reduce((points, waste) => {
      const weightInKg = waste.weight / 1000;
      return points + (pointsPerKg[waste.type] * weightInKg);
    }, 0);
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  onDeleteAccount() {
    this.showDeleteAlert = true;
  }

  handleDeleteConfirm() {
    this.user$.subscribe(user => {
      if (user) {
        this.authService.deleteAccount(user.id).subscribe({
          next: () => {
            this.store.dispatch(AuthActions.logout());
            localStorage.removeItem('currentUser');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du compte:', error);
          }
        });
      }
    });
    this.showDeleteAlert = false;
  }

  handleDeleteCancel() {
    this.showDeleteAlert = false;
  }

  onConvertPoints() {
    // TODO: Implémenter la logique de conversion
    console.log('Points convertis !');
  }
}
