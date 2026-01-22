import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  newUser: Partial<User> = {
    username: '',
    password: '',
    role: 'user',
    name: ''
  };
  editingUser: User | null = null;
  error: string = '';
  success: string = '';
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.loading = false;
      },
      (err) => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
        console.error(err);
      }
    );
  }

  createUser(): void {
    this.error = '';
    this.success = '';

    if (!this.newUser.username || !this.newUser.password || !this.newUser.name) {
      this.error = 'Por favor, complete todos los campos';
      return;
    }

    this.loading = true;
    this.userService.createUser(this.newUser as User).subscribe(
      (success) => {
        this.loading = false;
        if (success) {
          this.success = 'Usuario creado correctamente';
          this.newUser = { username: '', password: '', role: 'user', name: '' };
          this.loadUsers();
        } else {
          this.error = 'El usuario ya existe';
        }
      },
      (err) => {
        this.loading = false;
        this.error = 'Error al crear usuario';
        console.error(err);
      }
    );
  }

  editUser(user: User): void {
    this.editingUser = { ...user };
    this.error = '';
    this.success = '';
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  updateUser(): void {
    if (!this.editingUser) return;

    this.error = '';
    this.success = '';

    if (!this.editingUser.username || !this.editingUser.password || !this.editingUser.name) {
      this.error = 'Por favor, complete todos los campos';
      return;
    }

    this.loading = true;
    this.userService.updateUser(this.editingUser.username, this.editingUser).subscribe(
      (success) => {
        this.loading = false;
        if (success) {
          this.success = 'Usuario actualizado correctamente';
          this.editingUser = null;
          this.loadUsers();
        } else {
          this.error = 'Error al actualizar usuario';
        }
      },
      (err) => {
        this.loading = false;
        this.error = 'Error al actualizar usuario';
        console.error(err);
      }
    );
  }

  deleteUser(username: string): void {
    if (!confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }

    this.error = '';
    this.success = '';
    this.loading = true;

    this.userService.deleteUser(username).subscribe(
      (success) => {
        this.loading = false;
        if (success) {
          this.success = 'Usuario eliminado correctamente';
          this.loadUsers();
        } else {
          this.error = 'No se puede eliminar este usuario';
        }
      },
      (err) => {
        this.loading = false;
        this.error = 'Error al eliminar usuario';
        console.error(err);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

