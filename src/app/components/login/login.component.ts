import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.error = '';
    this.loading = true;

    if (!this.username || !this.password) {
      this.error = 'Por favor, complete todos los campos';
      this.loading = false;
      return;
    }

    this.authService.login(this.username, this.password).subscribe(
      (success) => {
        this.loading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Usuario o contraseña incorrectos';
        }
      },
      () => {
        this.loading = false;
        this.error = 'Error al conectar con el servidor';
      }
    );
  }
}

