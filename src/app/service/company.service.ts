import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../model/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8080/companies'; // API para la creación de empresas

  constructor(private http: HttpClient) { }

  // Crear una nueva compañía
  createCompany(company: Company): Observable<boolean> {
    // Descomponer 'location' en 'latitude' y 'longitude'
    const requestBody = {
      ...company,
      latitude: company.location?.lat, // Extrae la latitud del objeto location
      longitude: company.location?.lng // Extrae la longitud del objeto location
    };

    return this.http.post<boolean>(this.apiUrl, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}`);
  }

  // Obtener compañías cercanas
  getCompaniesNearby(latitude: number, longitude: number, radius: number): Observable<Company[]> {
    const params = { latitude: latitude.toString(), longitude: longitude.toString(), radiusInMeters: radius.toString() };
    return this.http.get<Company[]>(`${this.apiUrl}/nearby`, { params });
  }

  // Obtener una empresa por ID
  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva compañía


  // Actualizar una empresa existente
  updateCompany(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Eliminar una empresa por ID
  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener empresa por nombre y contraseña (autenticación)
  getCompanyByNameAndPassword(name: string, password: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getId`, {
      params: { name, password },
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Obtener compañías cercanas a una ubicación

}

