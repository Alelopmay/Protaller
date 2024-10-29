import { Component, Input, OnInit } from '@angular/core';
import { car } from '../../model/car';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarService } from '../../service/car.service';
import { form } from '../../model/form';
import { Invoice } from '../../model/Invoice';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-list-car-byclient',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-car-byclient.component.html',
  styleUrl: './list-car-byclient.component.css'
})
export class ListCarByclientComponent implements OnInit {
  @Input() cars: car[] = []; // Recibir los coches como input
  selectedInvoices: Invoice[] = []; // Almacena las facturas seleccionadas
  selectedForms: form[] = []; // Almacena los formularios seleccionados
  showInvoices: boolean = false; // Controla la visibilidad de las facturas
  showForms: boolean = false; // Controla la visibilidad de los formularios

  constructor(private carService: CarService) { }

  ngOnInit(): void {
    // Aquí puedes inicializar cualquier lógica adicional si es necesario
  }

  // Método para ver los formularios del coche
  viewReports(licensePlate: string): void {
    this.carService.getFormsByCarLicensePlate(licensePlate).subscribe(
      (formData: any[]) => {
        this.selectedForms = formData.map(item => ({
         
          description: item[1],
          date: item[2],
          initialDiagnosis: item[3],
          inspectionResults: item[4],
          workPerformed: item[5]
        }));
        console.log('Formularios recibidos:', this.selectedForms); // Verifica
        this.showForms = true; // Mostrar la sección de formularios
        this.showInvoices = false; // Ocultar la sección de facturas
      },
      (error: HttpErrorResponse) => {
        console.error('Error al cargar formularios:', error);
        this.handleError(error); // Manejo de errores
      }
    );
  }

  // Método para ver las facturas del coche
  viewInvoices(licensePlate: string): void {
    this.carService.getInvoicesByCarLicensePlate(licensePlate).subscribe(
      (invoices: any[]) => {
        this.selectedInvoices = invoices.map(invoice => ({
          invoice: { licensePlate: licensePlate }, // Aquí añadimos el objeto invoice
         
          subtotal: invoice[1],
          issueDate: new Date(invoice[2]), // Asegúrate de que esto sea un objeto de fecha
          vat: invoice[3],
          total: invoice[4],
          paymentMethod: invoice[5],
          warranty: invoice[6]
        }));
        console.log('Facturas recibidas:', this.selectedInvoices); // Verifica
        this.showInvoices = true; // Mostrar la sección de facturas
        this.showForms = false; // Ocultar la sección de formularios
      },
      (error: HttpErrorResponse) => {
        console.error('Error al cargar facturas:', error);
        this.handleError(error); // Manejo de errores
      }
    );
  }

  // Manejo de errores para mostrar información detallada al usuario
  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    if (error.error instanceof Object) {
      errorMessage = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
    } else {
      errorMessage = `Ocurrió un error del lado del cliente: ${error.message}`;
    }

    console.error(errorMessage);
    console.warn('Algo salió mal; por favor, inténtelo de nuevo más tarde.');
    return throwError('Algo salió mal; por favor, inténtelo de nuevo más tarde.');
  }
}