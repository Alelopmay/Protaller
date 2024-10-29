import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = 'http://localhost:8080/forms'; // Actualiza con el endpoint correcto de tu API

  constructor(private http: HttpClient) { }

  // Crear un nuevo formulario
  createForm(formPayload: any): Observable<any> {
    return this.http.post(this.apiUrl, formPayload);
  }

  // Obtener todos los formularios
  getForms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un formulario por ID
  getFormById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  // Actualizar un formulario existente
  updateForm(id: number, formPayload: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, formPayload);
  }

  // Eliminar un formulario por ID
  deleteForm(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}
