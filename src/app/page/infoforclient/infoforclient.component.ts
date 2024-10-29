import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ClientService } from '../../service/client.service';
import { car } from '../../model/car';
import { FormsModule } from '@angular/forms';
import { ListCarByclientComponent } from '../../component/list-car-byclient/list-car-byclient.component';

@Component({
  selector: 'app-infoforclient',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,ListCarByclientComponent],
  templateUrl: './infoforclient.component.html',
  styleUrls: ['./infoforclient.component.css']
})
export class InfoforclientComponent {
  cars: car[] = []; // Array to store cars
  email: string = ''; // For storing the email
  phoneNumber: string = ''; // For storing the phone number
  message: string = ''; // To display messages

  constructor(private clientService: ClientService, private router: Router) { }

  // Method to request car information based on client phone and email
  requestCarInfo(): void {
    this.clientService.getCarsByClientPhoneNumberAndEmail(this.phoneNumber, this.email).subscribe({
      next: (response: car[]) => {
        if (response.length > 0) {
          this.cars = response; // Assign cars to the array
          this.message = `${response.length} coches encontrados para el cliente.`;
        } else {
          this.cars = [];
          this.message = 'No se encontraron coches para este cliente.';
        }
      },
      error: (err) => {
        this.message = 'Error al obtener la información de los coches. Por favor, verifica los datos del cliente.';
        console.error('Error fetching car info:', err);
      }
    });
  }

  // Method to navigate back to the home page
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
