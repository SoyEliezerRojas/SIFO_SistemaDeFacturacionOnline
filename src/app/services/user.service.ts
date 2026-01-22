import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<User[]>('data/users.json').subscribe(
      (users) => {
        this.users = users || [];
      },
      () => {
        this.users = [];
      }
    );
  }

  private saveUsers(): void {
    // En un entorno real, esto haría una petición HTTP al backend
    // Por ahora, guardamos en localStorage como respaldo
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('data/users.json').pipe(
      map((users) => {
        this.users = users || [];
        return [...this.users];
      }),
      catchError(() => {
        const stored = localStorage.getItem('users');
        if (stored) {
          this.users = JSON.parse(stored);
          return of([...this.users]);
        }
        return of([]);
      })
    );
  }

  updateUser(username: string, userData: Partial<User>): Observable<boolean> {
    const index = this.users.findIndex(u => u.username === username);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      this.saveUsers();
      return of(true);
    }
    return of(false);
  }

  createUser(user: User): Observable<boolean> {
    if (this.users.find(u => u.username === user.username)) {
      return of(false); // Usuario ya existe
    }
    this.users.push(user);
    this.saveUsers();
    return of(true);
  }

  deleteUser(username: string): Observable<boolean> {
    const index = this.users.findIndex(u => u.username === username);
    if (index !== -1 && this.users[index].role !== 'admin') {
      this.users.splice(index, 1);
      this.saveUsers();
      return of(true);
    }
    return of(false);
  }
}

