import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegistreWorkerComponent } from '../../component/registre-worker/registre-worker.component';
import { ListEmployeeComponent } from '../../component/list-employee/list-employee.component';
import { FormFileComponent } from '../../component/form-file/form-file.component';
import { Employee } from '../../model/employee';
import { ChatComponent } from '../../component/chat/chat.component';
import { EmployeeService } from '../../service/employee.service'; // Importar servicio

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RegistreWorkerComponent,
    ListEmployeeComponent,
    FormFileComponent,
    ChatComponent
  ],
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent {
  isRegisterWorkerVisible = false;
  isFileFormVisible = false;
  isChatVisible = false; // Controla la visibilidad del chat
  confirmationMessage: string | null = null;
  selectedEmployee: Employee | null = null; // Empleado seleccionado para tareas o chat
  chatWithEmployee: Employee | null = null; // Empleado con el que se está chateando
  employees: Employee[] = []; // Lista original de empleados cargados
  filteredEmployees: Employee[] = []; // Lista filtrada de empleados

  constructor(private employeeService: EmployeeService) {
    this.fetchEmployees();
  }

  // Obtener empleados desde el servicio
  fetchEmployees(): void {
    this.employeeService.getEmployeesByCompanyOfEmployee(1).subscribe(
      (data: Employee[]) => {
        this.employees = data; // Cargar todos los empleados
        this.filteredEmployees = [...this.employees]; // Inicialmente, la lista filtrada es la misma
      },
      (error: any) => {
        console.error('Error al cargar empleados:', error);
      }
    );
  }

  // Método que se ejecuta cuando se ingresa texto en el campo de búsqueda
  filterEmployees(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase().trim(); // Normaliza el término de búsqueda

    // Si el término de búsqueda está vacío, mostramos todos los empleados
    if (searchTerm === '') {
      this.filteredEmployees = [...this.employees]; // Si no hay búsqueda, muestra todos
    } else {
      // Filtrar empleados por nombre completo o nombre de usuario
      this.filteredEmployees = this.employees.filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return fullName.includes(searchTerm); // Buscamos si el término está en el nombre completo
      });
    }
  }

  showRegisterWorker(): void {
    this.isRegisterWorkerVisible = true;
    this.isFileFormVisible = false;
    this.isChatVisible = false;
  }

  // Mostrar el formulario de tareas para el empleado seleccionado
  onAddTask(): void {
    this.isFileFormVisible = true;
    this.isChatVisible = false; // Oculta el chat si se abre el formulario de archivo
  }

  hideFileForm(): void {
    this.isFileFormVisible = false;
    this.selectedEmployee = null;
  }

  onWorkerSaved(): void {
    this.confirmationMessage = 'Trabajador guardado con éxito!';
    this.isRegisterWorkerVisible = false;
  }

  onWorkerCancelled(): void {
    this.isRegisterWorkerVisible = false;
  }

  // Manejar el evento de cancelación desde el formulario
  onCancelFileForm(): void {
    this.isFileFormVisible = false;
    this.selectedEmployee = null;
  }

  // Manejar el evento de inicio de chat desde ListEmployeeComponent
  onStartChat(employee: Employee): void {
    this.chatWithEmployee = employee; // Selecciona el empleado para chatear
    this.isChatVisible = true; // Muestra el chat
  }

  // Cerrar el chat
  closeChat(): void {
    this.isChatVisible = false;
    this.chatWithEmployee = null;
  }
}
