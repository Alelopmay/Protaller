import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../service/employee.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  employee: Employee | null = null;
  isAjustVisible: boolean = false; // Controla la visibilidad de los ajustes

  @Output() adjustToggle = new EventEmitter<void>(); // Emitimos el evento al hacer clic en el perfil

  constructor(private employeeService: EmployeeService, private authService: AuthService) { }

  ngOnInit(): void {
    const employeeId = this.authService.getEmployeeIdFromToken();
    if (employeeId) {
      this.loadEmployeeData(employeeId);
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

  toggleAjust(): void {
    this.isAjustVisible = !this.isAjustVisible; // Cambiamos la visibilidad al hacer clic
    this.adjustToggle.emit(); // Emitimos el evento al hacer clic (puede que lo uses en otro lugar)
  }

  closeAjust(): void {
    this.isAjustVisible = false; // Cerramos ajustes
  }
}
