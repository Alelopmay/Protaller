import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../model/employee';
import { AuthService } from '../../service/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-ajust',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ajust.component.html',
  styleUrls: ['./ajust.component.css'],
})
export class AjustComponent implements OnInit {
  employee: Employee | null = null; // Datos del empleado
  editMode: boolean = false; // Modo de edición
  selectedPhoto: File | null = null; // Archivo de foto seleccionado

  @Output() toggleAjust = new EventEmitter<void>(); // Para alternar la visibilidad del ajuste
  @Output() closeNav = new EventEmitter<void>(); // Para cerrar el panel y manejar la sesión

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const employeeId = this.authService.getEmployeeIdFromToken(); // Obtiene el ID del token
    if (employeeId) {
      this.loadEmployeeData(employeeId); // Carga los datos del empleado
    }
  }

  loadEmployeeData(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe(
      (data: Employee) => {
        this.employee = data;
      },
      (error) => {
        console.error('Error al obtener los datos del empleado:', error);
      }
    );
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode; // Activa o desactiva el modo edición
  }

  // Abre el selector de archivos para cambiar la foto de perfil
  openPhotoSelector(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  // Procesa el archivo de imagen seleccionado
  onPhotoSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.employee!.photo = e.target.result; // Asigna la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.employee) {
      this.employeeService.updateEmployee(this.employee.id, this.employee).subscribe(
        (updatedEmployee: Employee) => {
          console.log('Datos del empleado actualizados:', updatedEmployee);
          this.employee = updatedEmployee;
          this.editMode = false; // Desactivar el modo edición después de guardar
        },
        (error) => {
          console.error('Error al actualizar el empleado:', error);
        }
      );
    }
  }

  // Cierra el panel de ajustes y emite el evento
  onToggleAjust(): void {
    this.toggleAjust.emit();
    
  }

  // Cierra sesión y emite el evento
  logout(): void {
    this.closeNav.emit(); // Emite el evento para cerrar la sesión
    this.router.navigate(['/login']); // Navega a la página de login
  }
}
