import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated(); // Verifica si el token es válido
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirige al login si el token ha expirado
      return false;
    }
    return true; // Permite el acceso si el token es válido
  }
}
