import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly USERS_KEY = 'users';
  private readonly USER_KEY = 'user';
  private readonly COLLECTORS_KEY = 'collectors';

  constructor() {
    // Initialiser le tableau des utilisateurs s'il n'existe pas
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
  }

  getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getAllUsers();
    return users.find(user => user.email === email);
  }

  saveUser(user: User): boolean {
    const users = this.getAllUsers();
    // Vérifier si l'email existe déjà
    if (users.some(u => u.email === user.email)) {
      return false;
    }
    // Ajouter le nouvel utilisateur
    users.push({
      ...user,
      id: this.generateUserId(),
      userType: 'particular'
    });
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return true;
  }

  private generateUserId(): string {
    return Date.now().toString();
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  saveCollectors(collectors: any[]): void {
    localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(collectors));
  }

  getCollectors(): any[] {
    const collectors = localStorage.getItem(this.COLLECTORS_KEY);
    return collectors ? JSON.parse(collectors) : [];
  }

  clear(): void {
    localStorage.removeItem(this.USER_KEY);
  }
} 