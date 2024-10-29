import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:8080/files'; // Cambia esto por la URL de tu API

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo archivo junto con los IDs de empleados
  createFile(file: File & { employeeIds: number[] }): Observable<File> {
    console.log('Datos del archivo:', file);
    console.log('IDs de empleados:', file.employeeIds);
    return this.http.post<File>(this.apiUrl, file);
  }

  // Método para obtener los archivos asociados a un empleado por su ID
  getFilesByEmployeeId(employeeId: number): Observable<File[]> {
    return this.http.get<File[]>(`${this.apiUrl}/employee/${employeeId}`);
  }
  getFileWithCarAndClientByFileId(id: string): Observable<File[]> {
    return this.http.get<File[]>(`${this.apiUrl}/details/${id}`);
    
  }
  // Método para obtener las horas y los días de trabajo de un archivo por su ID
  getWorkDataByFileId(fileId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${fileId}/work-data`);
   
  }
  getActiveFilesByEmployeeId(employeeId: number): Observable<File[]> {
    return this.http.get<File[]>(`${this.apiUrl}/employee/${employeeId}/active`);
  }
}
