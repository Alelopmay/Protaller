import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../model/employee';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = ''; // Mensaje a mostrar
  isMessageVisible: boolean = false;

  employee: Employee = {
    id: 0, // Placeholder ID; backend should handle
    firstName: '',
    lastName: '',
    username: '',
    password: '', // La contraseña se puede enviar si es necesario
    role: 'superAdmin', // Default role
    photo: '', // Se asignará más tarde
    companyId: 0 // Este valor puede ser asignado al empleado
  };

  selectedFile: File | null = null;

  companyName: string = ''; // Nombre de la empresa
  companyPassword: string = ''; // Contraseña de la empresa

  showEmployeeForm: boolean = false; // Mostrar formulario de empleado si no hay admin
  adminMissing: boolean = true; // Asumir que falta el admin inicialmente

  constructor(private router: Router, private employeeService: EmployeeService) { }

  navigateToRegistration(): void {
    this.router.navigate(['/company']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  login(): void {
    if (this.username && this.password) {
      console.log('Iniciando sesión con', { username: this.username, password: this.password });

      // Llama al servicio de autenticación
      this.employeeService.login(this.username, this.password).subscribe({
        next: (response) => {
          if (response.success) {
            // Guarda el token en el almacenamiento local o en algún servicio de estado
            localStorage.setItem('token', response.token || '');
            console.log('Inicio de sesión exitoso, redirigiendo a /home');
            console.log('Token:', response.token);
            this.router.navigate(['/car']);
          } else {
            alert('Inicio de sesión fallido. Por favor, verifica tus credenciales.');
          }
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          alert('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
        }
      });
    } else {
      alert('Por favor, ingresa tu usuario y contraseña.');
    }
  }

  // Método para convertir la imagen a Base64
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // Retornar solo la parte Base64
      };
      reader.onerror = error => reject(error);
    });
  }

  // Método para enviar los datos del empleado y el archivo
  async createEmployee(): Promise<void> {
    console.log('createEmployee called');

    if (!this.selectedFile) {
      this.message = 'Por favor, selecciona una foto del empleado.';
      this.isMessageVisible = true;
      return;
    }

    try {
      // Convertir la imagen a Base64
      const base64Image = await this.convertFileToBase64(this.selectedFile);
      this.employee.photo = base64Image; // Asignar la imagen convertida a la propiedad photo

      // Asegúrate de que el companyId se asigne correctamente si es necesario
      this.employee.companyId = 1; // O asignar el ID de la compañía de alguna manera

      console.log('Datos del empleado que se enviarán:', this.employee);

      // Aquí puedes llamar al servicio para enviar los datos al backend
      const response = await this.employeeService.createEmployeeAdmin(this.employee, this.companyName, this.companyPassword).toPromise();

      // Si el servicio se ejecuta correctamente
      if (response) {
        this.message = 'Empleado creado exitosamente. Puedes iniciar sesión ahora.';
        this.isMessageVisible = true;

        // Ocultar el formulario de creación de empleado
        this.showEmployeeForm = false;

        // Opcional: Redirigir automáticamente a la página de inicio de sesión
        this.router.navigate(['/login']); // Puedes cambiar la ruta según tu lógica

        // O puedes mantener el usuario en la misma página y mostrar un mensaje de éxito
      } else {
        this.message = 'Error al crear el empleado. Por favor, inténtalo de nuevo.';
        this.isMessageVisible = true;
      }
    } catch (error) {
      console.error('Error al crear el empleado:', error);
      this.message = 'Error al crear el empleado. Por favor, inténtalo de nuevo.';
      this.isMessageVisible = true;
    }
  }

  // Método para manejar la selección de archivo
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement; // Aseguramos el tipo del evento
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]; // Guardar el archivo seleccionado
      console.log('Archivo seleccionado:', this.selectedFile);
    }
  }
}
