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
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.user$.subscribe(user => {
        if (user) {
          this.authService.deleteAccount(user.id).subscribe({
            next: () => {
              this.router.navigate(['/login']);
            },
            error: (error) => {
              console.error('Erreur lors de la suppression du compte:', error);
            }
          });
        }
      });
    }
  }
}
