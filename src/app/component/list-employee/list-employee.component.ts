import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Employee } from '../../model/employee';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../service/employee.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-list-employee',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {
  @Input() employees: Employee[] = []; // Lista de empleados filtrados
  noEmployeesMessage: string = 'No hay empleados disponibles.'; // Mensaje cuando no hay empleados

  @Output() startChat: EventEmitter<Employee> = new EventEmitter<Employee>();

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Obtener el employeeId desde el token
    const employeeId = this.authService.getEmployeeIdFromToken();
    if (employeeId) {
      this.getEmployeesByCompany(employeeId);
    }
  }

  // Método que obtiene los empleados de la misma empresa
  getEmployeesByCompany(employeeId: number): void {
    this.employeeService.getEmployeesByCompanyOfEmployee(employeeId).subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
        this.handleEmployeePhotos(); // Manejar las fotos después de obtener los empleados
      },
      error: (err: any) => {
        console.error('Error fetching employees:', err);
        this.employees = []; // Si hay un error, mostrar lista vacía
      }
    });
  }

  // Verifica si las fotos son válidas o están en el formato correcto
  handleEmployeePhotos(): void {
    this.employees.forEach(employee => {
      if (employee.photo && employee.photo.trim()) {
        // Solo asignamos base64 si la foto es válida
        employee.photo = `data:image/jpeg;base64,${employee.photo}`;
      } else {
        // Asegúrate de que photo sea undefined si no hay foto
        employee.photo = undefined;
      }
    });
  }

  // Método que se ejecuta al hacer clic en "Chatear"
  onChat(employee: Employee): void {
    this.startChat.emit(employee); // Emitimos el empleado completo
  }

  // Método que se ejecuta al hacer clic en "Eliminar"
  onDelete(employeeId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar a este empleado?')) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.id !== employeeId);
        },
        error: (err: any) => {
          console.error('Error eliminando el empleado:', err);
        }
      });
    }
  }
}
