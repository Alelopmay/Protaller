import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Message } from '../../model/message';
import { Employee } from '../../model/employee';
import { MessageService } from '../../service/message.service';
import { AuthService } from '../../service/auth.service';
import { EmployeeService } from '../../service/employee.service';  // Importar EmployeeService

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnChanges {
  @Input() employee: Employee | null = null;  // Recibir el empleado seleccionado
  @Output() closeChat = new EventEmitter<void>();  // Evento para cerrar el chat
  messages: Message[] = [];  // Almacena los mensajes del chat
  newMessage: string = '';   // Almacena el nuevo mensaje que se va a enviar

  currentUser: Employee | null = null;  // Inicialmente null

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private employeeService: EmployeeService // Inyectar el servicio de empleados
  ) {
    this.loadCurrentUser();  // Cargar el usuario logueado al crear el componente
  }

  // Método para cargar el empleado logueado a partir del token
  loadCurrentUser(): void {
    const employeeId = this.authService.getEmployeeIdFromToken();  // Obtener el ID del empleado logueado
    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe({
        next: (employee: Employee) => {
          this.currentUser = employee;  // Asigna el empleado logueado
          console.log('Empleado logueado cargado:', employee);
          this.loadMessages(); // Cargar los mensajes después de obtener el usuario logueado
        },
        error: (err: any) => {
          console.error('Error al obtener detalles del empleado logueado:', err);
        }
      });
    } else {
      console.error('No se pudo obtener el ID del empleado desde el token.');
    }
  }

  // Detectar cambios en el input del empleado seleccionado
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee && this.currentUser) {
      this.loadMessages();  // Cargar los mensajes cuando cambie el empleado
    }
  }

  // Método para cargar los mensajes del chat entre el emisor (usuario actual) y el receptor (empleado seleccionado)
  loadMessages(): void {
    if (this.employee && this.currentUser) {
      this.messageService.getMessagesBySenderAndRecipient(this.currentUser.id, this.employee.id).subscribe({
        next: (messages: Message[]) => {
          this.messages = messages;  // Asignar los mensajes obtenidos
          this.scrollToBottom();  // Desplazar hacia el final
        },
        error: (err: any) => {
          console.error('Error al cargar los mensajes:', err);
        }
      });
    }
  }

  // Método para enviar un mensaje
  // Método para enviar un mensaje
  sendMessage(): void {
    if (this.newMessage.trim() && this.employee && this.currentUser) {
      const messageToSend: Message = {
        id: 0,  // Será asignado por el backend
        content: this.newMessage.trim(),
        sentAt: new Date(),  // Asegúrate de que el backend acepte este formato
        isRead: false,
        sender: {
          id: this.currentUser.id,
          firstName: this.currentUser.firstName,
          lastName: this.currentUser.lastName,
          username: this.currentUser.username,
          password: this.currentUser.password // Si es necesario o se permite
          ,
          companyId: 0
        },
        recipient: {
          id: this.employee.id,
          firstName: this.employee.firstName,
          lastName: this.employee.lastName,
          username: this.employee.username,
          password: this.employee.password // Si es necesario o se permite
          ,
          companyId: 0
        }
      };

      this.messageService.sendMessage(messageToSend).subscribe({
        next: (savedMessage: Message) => {
          this.messages.push(savedMessage);  // Agregar el mensaje a la lista
          this.newMessage = '';  // Limpiar el campo de entrada
          this.scrollToBottom();  // Desplazarse hacia abajo para ver el nuevo mensaje
        },
        error: (err: any) => {
          console.error('Error al enviar el mensaje:', err);
        }
      });
    }
  }


  // Método para hacer scroll hasta el fondo del contenedor de mensajes
  scrollToBottom(): void {
    try {
      const messagesContainer = document.querySelector('.chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    } catch (err) {
      console.error('Error al hacer scroll hacia abajo:', err);
    }
  }

  // Método para cerrar el chat
  onCloseChat(): void {
    this.closeChat.emit();  // Emitir evento para cerrar el chat
  }
}
