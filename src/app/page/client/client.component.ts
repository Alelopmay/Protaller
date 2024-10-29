import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegistreCarComponent } from '../../component/registre-car/registre-car.component';
import { RegistreClienteComponent } from '../../component/registre-cliente/registre-cliente.component';
import { ListClientComponent } from '../../component/list-client/list-client.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, RegistreCarComponent, RegistreClienteComponent, ListClientComponent],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  isRegisterClientVisible = false;  // Variable para controlar la visibilidad del formulario
  showSuccessMessage = false;       // Variable para mostrar un mensaje emergente
  searchTerm: string = '';          // Variable para el término de búsqueda

  // Método que se ejecuta cuando el término de búsqueda cambia
  onSearchTermChange(): void {
    // No es necesario hacer nada aquí ya que el ngModel ya maneja la sincronización
    // El cambio se propaga automáticamente a través de los Input bindings
  }

  // Método para mostrar el formulario de registro
  showRegisterClientForm() {
    this.isRegisterClientVisible = true;
  }

  // Método para ocultar el formulario de registro
  hideRegisterClientForm() {
    this.isRegisterClientVisible = false;
  }

  // Método que se ejecuta al registrar un cliente
  onRegisterClient() {
    this.showSuccessMessage = true;
    this.isRegisterClientVisible = false;  // Oculta el formulario al registrar

    // Ocultar el mensaje emergente después de 3 segundos
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }
  openGmail(): void {
    window.open('https://mail.google.com', '_blank');
  }
  
}
