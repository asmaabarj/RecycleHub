import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/authentification/login/login.component';
import { RegisterComponent } from './core/pages/authentification/register/register.component';
import { ProfileComponent } from './core/pages/user/profile/profile.component';
import { EditProfileComponent } from './core/pages/user/edit-profile/edit-profile.component';
import { authGuard } from './core/guards/auth.guard';
import { userResolver } from './core/resolvers/user.resolver';
import { CollectionGuard } from './core/guards/collection.guard';
import { authPagesGuard } from './core/guards/auth-pages.guard';
import { CollectorGuard } from './core/guards/collector.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [authPagesGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [authPagesGuard]
  },
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
  {
    path: 'collections',
    canActivate: [authGuard, CollectionGuard],
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./core/pages/collection/collection-list/collection-list.component')
          .then(m => m.CollectionListComponent)
      },
      {
        path: 'create',
        loadComponent: () => 
          import('./core/pages/collection/create-collection/create-collection.component')
          .then(m => m.CreateCollectionComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => 
          import('./core/pages/collection/edit-collection/edit-collection.component')
          .then(m => m.EditCollectionComponent)
      }
    ]
  },
  {
    path: 'collector',
    canActivate: [authGuard, CollectorGuard],
    children: [
      {
        path: 'collections',
        loadComponent: () => 
          import('./core/pages/collector/collection-list/collection-list.component')
          .then(m => m.CollectorCollectionListComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
