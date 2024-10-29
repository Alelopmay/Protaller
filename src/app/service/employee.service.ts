import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 
  private baseUrl = 'http://localhost:8080/employees'; // Cambia esta URL según tu backend

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo empleado
  createEmployee(employee: Employee): Observable<Employee> {
    const employeeData = {
      ...employee,
      company: { id: employee.companyId }  // Solo envía el ID de la empresa
    };

    console.log('Datos del nuevo empleado:', employeeData);

    return this.http.post<Employee>(`${this.baseUrl}`, employeeData); // Asegúrate de que baseUrl sea correcto
  }


  



  // Método para obtener todos los empleados
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  // Método para obtener un empleado por su ID
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  // Método para obtener todos los empleados de la misma empresa que un empleado específico
  getEmployeesByCompanyOfEmployee(employeeId: number): Observable<Employee[]> {
    
    return this.http.get<Employee[]>(`${this.baseUrl}/company/${employeeId}`);
  }

  // Método para actualizar un empleado
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee);
  }

  // Método para eliminar un empleado
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  archiveFileByTaskId(fileId: number): Observable<{ success: boolean, message: string }> {
    return this.http.put<{ success: boolean, message: string }>(`${this.baseUrl}/archive-file/${fileId}`, null);
  }
  createEmployeeAdmin(employee: Employee, companyName: string, companyPassword: string): Observable<any> {
    const data = {
      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        username: employee.username,
        password: employee.password,
        role: employee.role,
        photo: employee.photo // Enviar la foto si es necesaria
      },
      companyName,
      companyPassword
    };

    return this.http.post(`${this.baseUrl}/admin`, data); // Cambia la URL según tu endpoint para crear administradores
  }
  login(username: string, password: string): Observable<{ success: boolean; token?: string }> {
    return this.http.post<{ success: boolean; token?: string }>(`${this.baseUrl}/login`, { username, password });
  }
}
