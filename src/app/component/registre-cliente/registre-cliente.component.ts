import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { client } from '../../model/client';
import { ClientService } from '../../service/client.service';
import { AuthService } from '../../service/auth.service'; // Asegúrate de importar el AuthService

@Component({
  selector: 'app-registre-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registre-cliente.component.html',
  styleUrls: ['./registre-cliente.component.css']
})
export class RegistreClienteComponent {
  client: client = {
    name: '',
    phoneNumber: '',
    email: ''
  };

  confirmationMessage: string | null = null;
  showModal = false;

  @Output() register = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private clientService: ClientService, private authService: AuthService) { } // Inyectar AuthService

  onSubmit() {
    const employeeId = this.authService.getEmployeeIdFromToken(); // Obtener el ID del empleado desde el token

    if (employeeId !== null) {
      // Pasamos el employeeId desde el servicio de autenticación
      this.clientService.createClient(this.client, employeeId).subscribe({
        next: (response: client) => {
          // Si la respuesta es exitosa (código 201 o 200), mostrar éxito
          this.confirmationMessage = `Cliente ${response.name} registrado correctamente y asociado a la empresa.`;
          this.showModal = true;
          this.register.emit();
        },
        error: (err: any) => {
          if (err.status === 409) {
            // Si recibimos un 409 Conflict, el cliente ya está registrado y asociado a la empresa
            this.confirmationMessage = `Error: El cliente ya está registrado y tiene una relación con la empresa.`;
          } else if (err.status === 200) {
            // Si recibimos un 200 OK, el cliente ya existía pero se creó una nueva relación con la empresa
            this.confirmationMessage = `El cliente ya existe, pero se ha creado una nueva relación con la empresa.`;
          } else {
            // Otros errores
            this.confirmationMessage = `Error al registrar el cliente.`;
          }
          this.showModal = true;
        }
      });
    } else {
      console.error('Error: No se pudo obtener el ID del empleado del token.');
      this.confirmationMessage = `Error: No se pudo obtener el ID del empleado.`;
      this.showModal = true;
    }
  }

  accept() {
    this.resetForm();
    this.showModal = false;
  }

  cancelForm() {
    this.resetForm();
    this.cancel.emit();
  }

  private resetForm() {
    this.client = {
      name: '',
      phoneNumber: '',
      email: ''
    };
    this.confirmationMessage = null;
  }
}