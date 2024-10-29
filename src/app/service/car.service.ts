import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { car } from '../model/car';
import { client } from '../model/client';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private baseUrl = 'http://localhost:8080/cars';  // URL base de tu backend

  constructor(private http: HttpClient) { }

  // Método para obtener los coches de una empresa por su ID
  getCarsByEmployeeId(employeeId: number): Observable<any> {
    const url = `${this.baseUrl}/employee/${employeeId}/cars`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  // Método para guardar un coche
  saveCar(car: car): Observable<car> {
    console.log('Datos que se envían a la base de datos:', car);
    return this.http.post<car>(this.baseUrl, car).pipe(
      catchError((error) => {
        // Manejar el error aquí
        console.error('Error en el servicio al guardar el coche:', error);
        return throwError(error); // Propagar el error
      })
    );
  }

  // Método para obtener los coches de un cliente por su ID
  getCarsByClientId(clientId: number): Observable<any[]> {
    const url = `${this.baseUrl}/client/${clientId}`;
    return this.http.get<any[]>(url).pipe(catchError(this.handleError));
  }

  // Método para obtener todos los formularios de un coche por su matrícula
  getFormsByCarLicensePlate(licensePlate: string): Observable<any[]> {
    const url = `${this.baseUrl}/${licensePlate}/forms`;
    return this.http.get<any[]>(url).pipe(catchError(this.handleError));
  }

  // Método para obtener el nombre del cliente de un coche por su matrícula
  // Método para obtener los detalles del cliente de un coche por su matrícula
  getClientByCarLicensePlate(licensePlate: string): Observable<any[]> {
    const url = `${this.baseUrl}/${licensePlate}/client`;
    return this.http.get<any[]>(url).pipe(catchError(this.handleError));
  }

  
  // Método para obtener todas las facturas de un coche por su matrícula
  getInvoicesByCarLicensePlate(licensePlate: string): Observable<any[]> {
    const url = `${this.baseUrl}/${licensePlate}/invoices`;
    return this.http.get<any[]>(url).pipe(catchError(this.handleError));
  }

  // Método de manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    if (error.error instanceof Object) {
      errorMessage = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
    } else {
      errorMessage = `Error del lado del cliente: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError('Algo salió mal; por favor, inténtelo de nuevo más tarde.');
  }

  getCarByLicensePlate(licensePlate: string): Observable<car> {
    const url = `${this.baseUrl}/${licensePlate}`;
    return this.http.get<car>(url).pipe(catchError(this.handleError));
  }
  // Método para obtener todos los formularios de un coche por su matrícula y el ID del empleado
  getFormsByCarLicensePlateAndEmployeeId(licensePlate: string, employeeId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${licensePlate}/forms/employee/${employeeId}`;
    return this.http.get<any[]>(url).pipe(catchError(this.handleError));
  }

  // Método para obtener todas las facturas de un coche por su matrícula y el ID del empleado
  getInvoicesByCarLicensePlateAndEmployeeId(licensePlate: string, employeeId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${licensePlate}/invoices/employee/${employeeId}`;
    return this.http.get<any[]>(url).pipe(catchError(this.handleError));
  }

}
