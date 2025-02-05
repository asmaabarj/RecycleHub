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
    if (users.some(u => u.email === user.email)) {
      return false;
    }
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

  saveData<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  getData<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }

  removeData(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  clearAll(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
} 