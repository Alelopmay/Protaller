import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/messages'; // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) { }

  // Obtener todos los mensajes
  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  // Obtener mensajes por senderId y recipientId
  getMessagesBySenderAndRecipient(senderId: number, recipientId: number): Observable<Message[]> {
    const url = `${this.apiUrl}/sender/${senderId}/recipient/${recipientId}`;
    return this.http.get<Message[]>(url);
  }

  // Obtener un mensaje por ID
  getMessageById(messageId: number): Observable<Message> {
    const url = `${this.apiUrl}/${messageId}`;
    return this.http.get<Message>(url);
  }

  // Enviar un nuevo mensaje
  sendMessage(message: Message): Observable<Message> {
    console.log('Enviando mensaje:', message);
    return this.http.post<Message>(this.apiUrl, message, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Marcar un mensaje como leído
  markAsRead(messageId: number): Observable<Message> {
    const url = `${this.apiUrl}/${messageId}/read`;
    return this.http.patch<Message>(url, { isRead: true });
  }

  // Borrar un mensaje por ID
  deleteMessage(messageId: number): Observable<void> {
    const url = `${this.apiUrl}/${messageId}`;
    return this.http.delete<void>(url);
  }
}
