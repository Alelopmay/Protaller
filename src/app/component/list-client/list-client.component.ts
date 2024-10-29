import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { client } from '../../model/client';
import { ClientService } from '../../service/client.service';
import { CarService } from '../../service/car.service'; // Importa el servicio de coches
import { car } from '../../model/car'; // Importa el modelo de coches
import { AuthService } from '../../service/auth.service'; // Asegúrate de importar AuthService

@Component({
  selector: 'app-list-client',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})
export class ListClientComponent implements OnInit, OnChanges {
  clients: client[] = []; // Lista completa de clientes
  filteredClients: client[] = []; // Lista filtrada de clientes
  cars: car[] = []; // Almacena la lista de coches
  showCarModal: boolean = false; // Controla si se muestra el modal de coches
  selectedClientId?: number; // Almacena el ID del cliente seleccionado
  @Input() searchTerm: string = ''; // Término de búsqueda desde el componente padre (ClientComponent)
  employeeId: number | null = null; // Almacena el ID del empleado

  constructor(
    private clientService: ClientService,
    private carService: CarService,
    private router: Router, // Asegúrate de que el router sea privado y correctamente inyectado
    private authService: AuthService // Inyectar el AuthService
  ) { }

  // Método de inicialización
  ngOnInit(): void {
    this.getEmployeeId(); // Obtener el ID del empleado al iniciar el componente
    this.getClientsByEmployeeId(); // Obtener clientes utilizando el ID del empleado
  }

  // Método que se ejecuta cuando el @Input() searchTerm cambia
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      this.filterClients(); // Filtra los clientes cada vez que cambie el término de búsqueda
    }
  }

  // Obtiene el ID del empleado desde el token de autenticación
  getEmployeeId(): void {
    this.employeeId = this.authService.getEmployeeIdFromToken(); // Obtener el ID del empleado del token
    if (!this.employeeId) {
      console.error('No se pudo obtener el ID del empleado del token.');
    }
  }

  // Obtiene la lista de clientes del servidor usando el ID del empleado
  getClientsByEmployeeId(): void {
    if (this.employeeId) {
      this.clientService.getClientsByEmployeeId(this.employeeId).subscribe(
        (data: client[]) => {
          this.clients = data;
          this.filteredClients = data; // Inicializamos la lista de clientes filtrados con todos los clientes
          this.filterClients(); // Aplica el filtro inicial
        },
        (error: any) => {
          console.error('Error fetching clients', error);
        }
      );
    } else {
      console.error('No se encontró ID del empleado para obtener los clientes.');
    }
  }

  // Filtra la lista de clientes en base al término de búsqueda
  filterClients(): void {
    if (this.searchTerm) {
      // Filtra por nombre, email o teléfono
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.phoneNumber?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // Si no hay término de búsqueda, muestra todos los clientes
      this.filteredClients = this.clients;
    }
  }

  // Método para listar los coches del cliente y mostrar el modal
  listCars(clientId: number | undefined): void {
    if (clientId !== undefined) {
      this.selectedClientId = clientId;
      this.showCarModal = true; // Mostrar el modal

      // Obtener los coches del cliente desde el servicio
      this.carService.getCarsByClientId(clientId).subscribe(
        (data: any[]) => {
          console.log('Datos recibidos antes de la transformación:', data); // Verificar datos recibidos

          // Transforma cada array en un objeto con las propiedades adecuadas y asigna también el clientId
          this.cars = data.map(carArray => ({
            id: carArray[0],
            licensePlate: carArray[1],
            model: carArray[2],
            carCondition: carArray[3],
            clientId: clientId // Agregamos el clientId aquí
          }));

          console.log('Datos transformados:', this.cars); // Verificar datos transformados
        },
        (error: any) => {
          console.error('Error fetching cars', error);
        }
      );
    } else {
      console.error('ID de cliente no disponible para listar autos.');
    }
  }

  // Método para eliminar un cliente
  deleteClient(clientId: number | undefined): void {
    if (clientId !== undefined) {
      // Mensaje de confirmación
      const confirmed = confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.');

      if (confirmed) {
        this.clientService.deleteClient(clientId).subscribe(
          () => {
            console.log(`Cliente con ID ${clientId} eliminado.`);
            // Actualiza la lista local
            this.clients = this.clients.filter(client => client.id !== clientId);
            this.filteredClients = this.filteredClients.filter(client => client.id !== clientId);
          },
          (error: any) => {
            console.error('Error eliminando cliente', error);
          }
        );
      } else {
        console.log('Eliminación cancelada.'); // Mensaje opcional para el caso de cancelación
      }
    } else {
      console.error('ID de cliente no disponible para eliminar.');
    }
  }

  // Método para cerrar el modal
  closeCarModal(): void {
    this.showCarModal = false; // Ocultar el modal
    this.cars = []; // Limpiar la lista de coches cuando se cierra el modal
  }

  // Método para manejar el clic sobre un coche
  onCarClick(licensePlate: string): void {
    console.log('Matrícula seleccionada:', licensePlate);
    // Navegar a la ruta 'car-info' pasando la matrícula
    this.router.navigate(['/info', licensePlate]);
  }
}
