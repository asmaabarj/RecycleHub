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
    if (!localStorage.getItem(this.COLLECTORS_KEY)) {
      this.initializeCollectors();
    }
  }

  login(email: string, password: string): Observable<User> {
    const collectors = this.getCollectors();
    const collector = collectors.find(c => c.email === email && c.password === password);
    if (collector) {
      localStorage.setItem('currentUser', JSON.stringify(collector));
      return of(collector).pipe(delay(1000));
    }

    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

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
    const collectors = this.getCollectors();
    if (collectors.some(c => c.email === userData.email)) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const users = this.getUsers();
    if (users.some(u => u.email === userData.email)) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      userType: 'particular' 
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

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
        userType: 'collector'
      }
    ];
    localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(collectors));
  }

  updateUserProfile(userId: string, updatedData: Partial<User>): Observable<User> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return throwError(() => new Error('Utilisateur non trouvé'));
    }

    const updatedUser = { ...users[userIndex], ...updatedData };
    users[userIndex] = updatedUser;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

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
