import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { logout } from '../../../state/auth/auth.actions';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(private store: Store<{ auth: { user: User | null } }>) {
    this.user$ = this.store.select(state => state.auth.user);
  }

  ngOnInit(): void {
    // Implementation de l'interface OnInit
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}
