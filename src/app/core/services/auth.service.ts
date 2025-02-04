import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly COLLECTORS_KEY = 'collectors';

  constructor() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
    
    this.initializeCollectors();
  }

  private initializeCollectors(): void {
    const collectors: User[] = [
      {
        id: 'collector1',
        email: 'collector1@recycleHub.com',
        password: 'collector123',
        firstName: 'Jean',
        lastName: 'Dupont',
        address: '123 rue du Recyclage',
        phone: '0123456789',
        birthDate: new Date('1980-01-01'),
        userType: 'collector',
        profileImage: ''
      },
      {
        id: 'collector2',
        email: 'collector2@recycleHub.com',
        password: 'collector123',
        firstName: 'Marie',
        lastName: 'Martin',
        address: '456 avenue du Tri',
        phone: '0234567890',
        birthDate: new Date('1985-05-15'),
        userType: 'collector',
        profileImage: ''
      },
      {
        id: 'collector3',
        email: 'collector3@recycleHub.com',
        password: 'collector123',
        firstName: 'Pierre',
        lastName: 'Durand',
        address: '789 boulevard du Compost',
        phone: '0345678901',
        birthDate: new Date('1975-12-25'),
        userType: 'collector',
        profileImage: ''
      }
    ];

    localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(collectors));
    console.log('Collecteurs initialisés:', collectors);
  }

  login(email: string, password: string): Observable<User> {
    const collectors = JSON.parse(localStorage.getItem(this.COLLECTORS_KEY) || '[]');
    const collector = collectors.find((c: User) => c.email === email && c.password === password);
    
    if (collector) {
      localStorage.setItem('currentUser', JSON.stringify(collector));
      return of(collector).pipe(delay(1000));
    }

    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);

    if (!user) {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    return of(user).pipe(delay(1000));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  register(userData: Omit<User, 'id'>): Observable<User> {
    const collectors = JSON.parse(localStorage.getItem(this.COLLECTORS_KEY) || '[]');
    if (collectors.some((c: User) => c.email === userData.email)) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    if (users.some((u: User) => u.email === userData.email)) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      userType: 'particular'
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    console.log('Nouvel utilisateur enregistré:', newUser);

    return of(newUser).pipe(delay(1000));
  }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private getCollectors(): User[] {
    const collectorsJson = localStorage.getItem(this.COLLECTORS_KEY);
    return collectorsJson ? JSON.parse(collectorsJson) : [];
  }

  updateUserProfile(userId: string, updatedData: Partial<User>): Observable<User> {
    // Vérifier d'abord dans les collecteurs
    const collectors = JSON.parse(localStorage.getItem(this.COLLECTORS_KEY) || '[]');
    const collectorIndex = collectors.findIndex((c: User) => c.id === userId);
    
    if (collectorIndex !== -1) {
      // Mettre à jour le collecteur
      const updatedCollector = { ...collectors[collectorIndex], ...updatedData };
      collectors[collectorIndex] = updatedCollector;
      localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(collectors));
      
      // Mettre à jour aussi currentUser si c'est l'utilisateur connecté
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem('currentUser', JSON.stringify(updatedCollector));
      }
      
      return of(updatedCollector).pipe(delay(1000));
    }

    // Si ce n'est pas un collecteur, chercher dans les utilisateurs
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const userIndex = users.findIndex((u: User) => u.id === userId);
    
    if (userIndex === -1) {
      return throwError(() => new Error('Utilisateur non trouvé'));
    }

    // Mettre à jour l'utilisateur
    const updatedUser = { ...users[userIndex], ...updatedData };
    users[userIndex] = updatedUser;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    // Mettre à jour aussi currentUser si c'est l'utilisateur connecté
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    return of(updatedUser).pipe(delay(1000));
  }

  deleteAccount(userId: string): Observable<void> {
    let users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return of(void 0).pipe(delay(1000));
    }

    let collectors = this.getCollectors();
    const collectorIndex = collectors.findIndex(c => c.id === userId);
    
    if (collectorIndex !== -1) {
      collectors.splice(collectorIndex, 1);
      localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(collectors));
      return of(void 0).pipe(delay(1000));
    }

    return throwError(() => new Error('Utilisateur non trouvé'));
  }
}
