import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule, ProfileComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  private _isLoggedIn: boolean = false;
  isAjustVisible = false; 

  constructor(private router: Router) {}

  /**
   * Getter para verificar si el usuario está autenticado
   */
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  @Input()
  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  @Output() toggleAjust = new EventEmitter<void>(); // Emitimos el evento hacia el AppComponent
  @Output() closeNav = new EventEmitter<void>();

  /**
   * Verifica si la barra de navegación debe mostrarse en la ruta actual.
   * No mostramos la barra de navegación en '/home' y '/login'.
   */
  shouldDisplayNav(): boolean {
    const currentRoute = this.router.url;
    return currentRoute !== '/home' && currentRoute !== '/login' && currentRoute !== '/infoforclient';
  }

  /**
   * Funcion para cerrar sesion 
   */
  cerrarSesion() {
    this._isLoggedIn = false;
    this.router.navigate(['/login']);
    this.closeNav.emit();
  }

  /**
   * Emite un evento al hacer clic en el perfil para ajustar configuraciones
   */
  onToggleAjust(): void {
    this.toggleAjust.emit(); // Emitimos el evento al hacer clic en el perfil
  }
}
