import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CarService } from '../../service/car.service';
import { AuthService } from '../../service/auth.service'; // Importa el AuthService

@Component({
  selector: 'app-list-car',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './list-car.component.html',
  styleUrls: ['./list-car.component.css']
})
export class ListCarComponent implements OnInit {

  cars: any[] = [];
  filteredCars: any[] = []; // Lista filtrada según la búsqueda
  errorMessage: string = '';

  @Input() searchQuery: string = ''; // Recibe el término de búsqueda desde el padre

  constructor(
    private carService: CarService,
    private router: Router,
    private authService: AuthService // Inyectar AuthService para obtener el ID del empleado
  ) { }

  ngOnInit(): void {
    console.log('Iniciando el componente ListCarComponent.');

    // Obtener el ID del empleado desde el token JWT
    const employeeId = this.authService.getEmployeeIdFromToken();

    if (employeeId) {
      console.log('ID del empleado obtenido:', employeeId);
      this.getCarsByCompany(employeeId);
    } else {
      console.error('No se pudo obtener el ID del empleado.');
    }
  }

  ngOnChanges(): void {
    console.log('El término de búsqueda ha cambiado:', this.searchQuery);
    this.filterCars();
  }

  getCarsByCompany(employeeId: number): void {
    console.log('Obteniendo coches para la compañía del empleado con ID:', employeeId);
    this.carService.getCarsByEmployeeId(employeeId).subscribe(
      (data: any[]) => {
        this.cars = data.map(item => ({
          licensePlate: item[0],
          model: item[1],
          carCondition: item[2],
          hasInvoice: item[3],
          imageUrl: this.getCarImageUrl(item[1]) // Usar el modelo para obtener la imagen
        }));
        this.filterCars();
      },
      (error) => {
        this.errorMessage = error;
        console.error('Error:', error);
      }
    );
  }

  filterCars(): void {
    if (this.searchQuery.trim()) {
      const lowerQuery = this.searchQuery.toLowerCase();
      console.log('Filtrando coches con la búsqueda:', lowerQuery);
      this.filteredCars = this.cars.filter(car =>
        car.model.toLowerCase().includes(lowerQuery) ||
        car.licensePlate.toLowerCase().includes(lowerQuery)
      );
      console.log('Coches filtrados:', this.filteredCars);
    } else {
      this.filteredCars = this.cars;
      console.log('Mostrando todos los coches:', this.filteredCars);
    }
  }

  getCarImageUrl(model: string): string {
    const formattedModel = model.toLowerCase().replace(/\s+/g, '-'); 
    return `assets/fotos/${formattedModel}.png`; // Ajusta la ruta según donde estén tus imágenes
  }

  setSelectedCarLicensePlate(car: any): void {
    console.log('Matrícula seleccionada:', car.licensePlate);
  }

  moreInfo(car: any): void {
    this.setSelectedCarLicensePlate(car);
    this.router.navigate(['/info', car.licensePlate]);
  }

  makeReport(car: any): void {
    this.setSelectedCarLicensePlate(car);
    this.router.navigate(['/form', { licensePlate: car.licensePlate }]);
  }

  navigateToInvoice(car: any): void {
    this.setSelectedCarLicensePlate(car);
    this.router.navigate(['/invoice', { licensePlate: car.licensePlate }]);
  }

  getCarRows(cars: any[]) {
    const carRows = [];
    for (let i = 0; i < cars.length; i += 4) {
      carRows.push(cars.slice(i, i + 4));
    }
    return carRows;
  }
}
