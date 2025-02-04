import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/authentification/login/login.component';
import { RegisterComponent } from './core/pages/authentification/register/register.component';
import { ProfileComponent } from './core/pages/user/profile/profile.component';
import { EditProfileComponent } from './core/pages/user/edit-profile/edit-profile.component';
import { authGuard } from './core/guards/auth.guard';
import { userResolver } from './core/resolvers/user.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [authGuard],
    resolve: { user: userResolver }
  },
  { 
    path: 'edit-profile', 
    component: EditProfileComponent,
    canActivate: [authGuard],
    resolve: { user: userResolver }
  },
  { path: '**', redirectTo: '/login' }
];
