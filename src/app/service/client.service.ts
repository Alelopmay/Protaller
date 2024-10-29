import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { client } from '../model/client';
import { car } from '../model/car';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/clients'; // Cambia esto a tu API

  constructor(private http: HttpClient) { }

  // Recibir el employeeId como argumento desde el componente
  createClient(newClient: client, employeeId: number): Observable<client> {
    const params = new HttpParams().set('employeeId', employeeId.toString());
    return this.http.post<client>(this.apiUrl, newClient, { params });
  }


  // Método para obtener clientes por el ID de empleado
  getClientsByEmployeeId(employeeId: number): Observable<client[]> {
    return this.http.get<client[]>(`${this.apiUrl}/by-employee/${employeeId}`);
  }
  deleteClient(clientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clientId}`);
  }
  requestClientCarInfo(phoneNumber: string, email: string): Observable<string> {
    const params = new HttpParams()
      .set('phoneNumber', phoneNumber)
      .set('email', email);

    return this.http.get<string>(`${this.apiUrl}/cars`, { params });
  }
  // Método para obtener coches por correo electrónico (no es necesario, pero aquí está por si lo necesitas)
  getCarsByClientPhoneNumberAndEmail(phoneNumber: string, email: string): Observable<car[]> {
    const params = new HttpParams()
      .set('phoneNumber', phoneNumber)
      .set('email', email);

    return this.http.get<car[]>(`${this.apiUrl}/cars`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching cars:', error);
          return throwError(error);
        })
      );
  }

  // Método para cargar coches (puedes eliminarlo si no es necesario)
  loadCars(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.get(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error loading cars:', error);
        return throwError(error);
      })
    );
  }
}
