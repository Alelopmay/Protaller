import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { photo } from '../model/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = 'http://localhost:8080/photos'; // URL de la API backend

  constructor(private http: HttpClient) { }

  // Obtener todas las fotos
  getPhotos(): Observable<photo[]> {
    return this.http.get<photo[]>(this.apiUrl);
  }

  // Obtener una foto por ID
  getPhotoById(id: number): Observable<photo> {
    return this.http.get<photo>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva foto
  createPhoto(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + '/upload', formData);
  }


  // Actualizar una foto existente
  updatePhoto(id: number, photo: photo): Observable<photo> {
    return this.http.put<photo>(`${this.apiUrl}/${id}`, photo);
  }

  // Eliminar una foto por ID
  deletePhoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // Obtener fotos por formId
  getPhotosByFormId(formId: number): Observable<photo[]> {
    return this.http.get<photo[]>(`${this.apiUrl}/form/${formId}`);
  }

}
