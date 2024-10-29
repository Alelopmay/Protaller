import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileService } from '../../service/file.service';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../model/employee';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-form-file',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-file.component.html',
  styleUrls: ['./form-file.component.css']
})
export class FormFileComponent implements OnInit {
  @Output() cancelTask: EventEmitter<void> = new EventEmitter<void>();

  fileForm: FormGroup;
  todayDate: string;
  employees: Employee[] = [];
  selectedEmployeeIds: number[] = []; // Array para almacenar los IDs seleccionados

  // Mensajes para mostrar al usuario
  successMessage: string = ''; // Para el mensaje de éxito
  errorMessage: string = ''; // Para el mensaje de error
  showSuccess: boolean = false; // Controla la visibilidad del mensaje de éxito
  showError: boolean = false; // Controla la visibilidad del mensaje de error

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private employeeService: EmployeeService,
    private authService: AuthService // Inyectar AuthService para obtener el token
  ) {
    this.todayDate = new Date().toISOString().split('T')[0]; // Obtener la fecha actual
    this.fileForm = this.fb.group({
      date: [{ value: this.todayDate, disabled: true }, Validators.required], // La fecha está fijada como hoy
      clientName: ['', Validators.required],
      carLicensePlate: ['', Validators.required],
      report: ['', Validators.required], // Agregamos el campo report
      details: ['', Validators.required], // Cambiamos info a details
    });
  }

  ngOnInit(): void {
    this.loadEmployees(); // Llamamos a la función para cargar empleados
  }

  // Cargar los empleados usando el employeeId extraído del token
  loadEmployees(): void {
    const employeeId = this.authService.getEmployeeIdFromToken();

    if (employeeId !== null) {
      this.employeeService.getEmployeesByCompanyOfEmployee(employeeId).subscribe(
        (data: Employee[]) => {
          this.employees = data;
        },
        (error) => {
          console.error('Error al obtener empleados:', error);
        }
      );
    } else {
      console.error('El employeeId es null');
      // Maneja el caso donde employeeId es null (quizá redirigir o mostrar un mensaje de error)
    }
  }


  toggleEmployeeSelection(employeeId: number): void {
    const index = this.selectedEmployeeIds.indexOf(employeeId);
    if (index === -1) {
      this.selectedEmployeeIds.push(employeeId); // Añadir si no está seleccionado
    } else {
      this.selectedEmployeeIds.splice(index, 1); // Remover si ya está seleccionado
    }
    console.log('IDs seleccionados:', this.selectedEmployeeIds); // Mostrar en consola los IDs seleccionados
  }

  onSubmit(): void {
    if (this.fileForm.valid) {
      // Crear un nuevo objeto de archivo
      const newFile: File & { employeeIds: number[] } = {
        ...this.fileForm.value, // Propiedades del formulario
        date: new Date(), // Usar la fecha actual
        archived: false, // Establecer archived a false
        employeeIds: this.selectedEmployeeIds.length > 0 ? this.selectedEmployeeIds : [], // Agregar IDs de empleados
      };

      // Enviar el nuevo archivo al servicio
      this.fileService.createFile(newFile).subscribe(
        (response: File) => {
          console.log('Archivo creado:', response);
          this.successMessage = 'Archivo creado exitosamente.'; // Mensaje de éxito
          this.showSuccess = true; // Mostrar mensaje de éxito
          this.showError = false; // Ocultar mensaje de error
          // Limpiar el formulario y la selección después de enviar
          this.fileForm.reset();
          this.selectedEmployeeIds = [];
        },
        (error: any) => {
          console.error('Error al crear el archivo:', error);
          this.errorMessage = 'Error al crear el archivo. Verifica los datos.'; // Mensaje de error
          this.showError = true; // Mostrar mensaje de error
          this.showSuccess = false; // Ocultar mensaje de éxito
        }
      );
    } else {
      console.error('El formulario no es válido. Verifica los campos.');
      this.errorMessage = 'Por favor, completa todos los campos requeridos.'; // Mensaje de error
      this.showError = true; // Mostrar mensaje de error
      this.showSuccess = false; // Ocultar mensaje de éxito
    }
  }

  onCancel(): void {
    this.cancelTask.emit();
  }
}
