import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { repair } from '../model/repair';

@Injectable({
  providedIn: 'root'
})
export class RepairService {
  private apiUrl = 'http://localhost:8080/repairs';  // URL base de la API de Repairs

  // Configuración de los headers (si es necesario)
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  // Obtener todas las reparaciones
  getRepairs(): Observable<repair[]> {
    return this.http.get<repair[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener una reparación por ID
  getRepairById(id: number): Observable<repair> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<repair>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear una nueva reparación
  // Crear una nueva reparación
  createRepair(repair: repair): Observable<repair> {
    console.log("datos de la reparación:", repair);
    return this.http.post<repair>(this.apiUrl, repair, this.httpOptions)
      
      .pipe(
        catchError(this.handleError)
      );
  }


  // Actualizar una reparación existente
  updateRepair(id: number, repair: repair): Observable<repair> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<repair>(url, repair, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar una reparación
  deleteRepair(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores HTTP
  private handleError(error: any): Observable<never> {
    console.error('Error en la API:', error);
    return throwError('Ocurrió un error con la solicitud, intenta de nuevo.');
  }

}
