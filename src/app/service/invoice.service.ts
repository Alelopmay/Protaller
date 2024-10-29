import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../model/Invoice'; // Asegúrate de importar correctamente el modelo

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8080/invoices'; // Cambia esto por la URL real de tu backend

  constructor(private http: HttpClient) { }

  // Método para crear una nueva factura
  createInvoice(invoice: Invoice): Observable<Invoice> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Invoice>(this.apiUrl, invoice, { headers });
  }

  // Obtener todas las facturas
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  // Obtener una factura por ID
  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  // Actualizar una factura existente
  updateInvoice(id: number, invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  // Eliminar una factura
  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
