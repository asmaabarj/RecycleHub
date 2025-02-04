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
    // Initialiser les collecteurs par défaut si pas déjà fait
    if (!localStorage.getItem(this.COLLECTORS_KEY)) {
      this.initializeCollectors();
    }
  }

  login(email: string, password: string): Observable<User> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }

    return of(user).pipe(delay(1000));
  }

  register(userData: Omit<User, 'id'>): Observable<User> {
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
      // Ajoutez d'autres collecteurs si nécessaire
    ];
    localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(collectors));
  }
}
