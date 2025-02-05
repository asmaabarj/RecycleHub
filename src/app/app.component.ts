import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SidebarComponent } from './core/shared/components/sidebar/sidebar.component';
import * as AuthActions from './core/state/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AsyncPipe, CommonModule],
  template: `
    <div class="flex">
      <app-sidebar *ngIf="isAuthenticated$ | async" />
      <div [class]="(isAuthenticated$ | async) ? 'flex-1 ml-64' : 'w-full'">
        <router-outlet />
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store<{ auth: { isAuthenticated: boolean } }>) {
    this.isAuthenticated$ = this.store.select(state => state.auth.isAuthenticated);
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.store.dispatch(AuthActions.loginSuccess({ user: JSON.parse(storedUser) }));
    }
  }
}
