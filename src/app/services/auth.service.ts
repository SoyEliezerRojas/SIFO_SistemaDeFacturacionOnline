import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  username: string;
  password: string;
  role: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'currentUser';

  constructor(private http: HttpClient) {
    // Cargar usuario desde localStorage si existe
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>('data/users.json').pipe(
      map((users: User[]) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          this.currentUser = { ...user };
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}

