// src/app/service/unsplash.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  private apiUrl: string = 'https://api.unsplash.com/search/photos?query=';

  constructor(private http: HttpClient) { }

  getCarImages(model: string): Observable<any> {
    const url = `${this.apiUrl}${model}&client_id=YOUR_UNSPLASH_ACCESS_KEY`; // Reemplaza con tu clave de acceso de Unsplash
    return this.http.get(url);
  }
}
