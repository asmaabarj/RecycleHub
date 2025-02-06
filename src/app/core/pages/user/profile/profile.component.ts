import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { User } from '../../../models/user.model';
import * as AuthActions from '../../../state/auth/auth.actions';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(
    private store: Store<{ auth: { user: User | null } }>,
    private authService: AuthService,
    private router: Router
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.user$ = currentUser ? of(currentUser) : this.store.select(state => state.auth.user);
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  onDeleteAccount() {
    const dialogRef = document.createElement('div');
    dialogRef.innerHTML = `
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Supprimer le compte</h3>
            <p class="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.
            </p>
            <div class="flex justify-center space-x-3">
              <button id="cancel-delete" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Annuler
              </button>
              <button id="confirm-delete" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(dialogRef);

    const handleDelete = () => {
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
      document.body.removeChild(dialogRef);
    };

    const handleCancel = () => {
      document.body.removeChild(dialogRef);
    };

    dialogRef.querySelector('#confirm-delete')?.addEventListener('click', handleDelete);
    dialogRef.querySelector('#cancel-delete')?.addEventListener('click', handleCancel);
  }
}
