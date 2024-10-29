import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { client } from '../../model/client'; // Asegúrate de que esta importación sea correcta
import { CarService } from '../../service/car.service'; // Importa el servicio de coche
import { car } from '../../model/car'; // Asegúrate de que la ruta sea correcta
import { ClientService } from '../../service/client.service';
import { AuthService } from '../../service/auth.service'; // Importar el servicio de autenticación

@Component({
  selector: 'app-registre-car',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registre-car.component.html',
  styleUrls: ['./registre-car.component.css']
})
export class RegistreCarComponent implements OnInit {
  @Output() cancel = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();

  // Definición de las variables del formulario
  matricula: string = '';
  modelo: string = '';
  estado: string = '';
  selectedClient: client | null = null; // Almacenar el objeto client completo

  // Variable para mostrar el mensaje de confirmación
  showSuccessMessage: boolean = false;

  // Variable para almacenar la lista de clientes
  clients: Array<client> = [];

  // Lista de marcas de vehículos
  marcas: string[] = [
    'Toyota',
    'Honda',
    'Ford',
    'Chevrolet',
    'Nissan',
    'Volkswagen',
    'Hyundai',
    'Kia',
    'Dodge',
    'Jeep',
    'Subaru',
    'Mazda',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Porsche',
    'Renault',
    'Peugeot',
    'Fiat',
    'Tesla',
    // Añade más marcas según sea necesario
  ];

  constructor(private clientService: ClientService, private carService: CarService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    // Obtener el employeeId desde el token
    const employeeId = this.authService.getEmployeeIdFromToken();

    if (employeeId) {
      this.clientService.getClientsByEmployeeId(employeeId).subscribe({
        next: (clients: client[]) => {
          this.clients = clients.filter(client => client.id !== undefined) as client[];
        },
        error: (error: any) => {
          console.error('Error al cargar clientes', error);
        }
      });
    } else {
      console.error('No se pudo obtener el employeeId del token.');
    }
  }

  selectClient(clientId: number | undefined) {
    if (clientId !== undefined) {
      this.selectedClient = this.clients.find(c => c.id === clientId) || null; // Almacena el cliente completo
      console.log('Cliente seleccionado:', this.selectedClient);
    } else {
      console.error('ID de cliente es indefinido');
    }
  }

  registrarCoche() {
    if (this.selectedClient === null || this.selectedClient.id === undefined) {
      console.error('Por favor, seleccione un cliente antes de registrar el coche.');
      return; // Evita continuar si no hay cliente seleccionado
    }

    // Crear un objeto coche con los datos ingresados y solo el ID del cliente
    const nuevoCoche: car = {
      licensePlate: this.matricula,
      model: this.modelo,
      carCondition: this.estado,
      clientId: this.selectedClient.id // Usar solo el ID del cliente seleccionado
    };

    // Llamar al servicio para guardar el coche
    this.carService.saveCar(nuevoCoche).subscribe({
      next: (savedCar: any) => {
        // Limpiar los campos del formulario
        this.matricula = '';
        this.modelo = '';
        this.estado = '';
        this.selectedClient = null;

        // Mostrar el mensaje de éxito
        this.showSuccessMessage = true;

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);

        // Emitir el evento al componente padre
        this.register.emit();

        // Mostrar el coche registrado en la consola
        console.log('Coche registrado:', savedCar);
      },
      error: (error: any) => {
        // Manejar error aquí
        if (error.status === 409) { // Si el estado es 409, significa que ya existe
          console.error('El coche ya existe en la base de datos.');
          alert('El coche ya existe en la base de datos.'); // Puedes usar un modal o snackbar para mejor UX
        } else {
          console.error('Error al registrar el coche', error);
          alert('No se pudo registrar el coche. Por favor, inténtalo de nuevo.'); // Mensaje genérico
        }
      }
    });
  }


  cancelar() {
    this.cancel.emit();
  }
}
