import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarService } from '../../service/car.service';
import { HttpErrorResponse } from '@angular/common/http';
import { client } from '../../model/client'; // Asegúrate de que la ruta sea correcta
import { throwError } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { form } from '../../model/form';
import { ModifyFormComponent } from '../../component/modify-form/modify-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-information',
  standalone: true,
  imports: [CommonModule, RouterModule,ModifyFormComponent,FormsModule],
  templateUrl: './car-information.component.html',
  styleUrls: ['./car-information.component.css']
})
export class CarInformationComponent implements OnInit {
  @Output() save = new EventEmitter<form>();
  licensePlate: string | null = null; // Almacena la matrícula del coche
  carData: any = {}; // Almacena los datos del coche
  client: client | null = null; // Almacena los datos del cliente
  forms: form[] = []; // Almacena los formularios asociados al coche
  invoices: any[] = []; // Almacena las facturas asociadas al coche

  selectedForm: form | null = null; // Formulario seleccionado para modificar
  showModifyModal: boolean = false;  // Controla la visibilidad del modal


  constructor(private route: ActivatedRoute, private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.licensePlate = params['licensePlate'];
      this.loadCarInformation(); // Carga la información del coche al inicializar
    });
  }

  loadCarInformation() {
    if (this.licensePlate) {
      // Obtener los datos del coche por matrícula
      this.carService.getCarByLicensePlate(this.licensePlate).subscribe(
        (data: any) => {
          if (data) {
            this.carData = data; // Asignar datos del coche
          } else {
            console.warn('No se encontraron datos para el coche con matrícula:', this.licensePlate);
          }
        },
        (error: any) => {
          console.error('Error al obtener los datos del coche:', error);
          this.handleError(error); // Manejo de errores
        }
      );

      // Obtener los datos del cliente por matrícula, sin el ID
      this.carService.getClientByCarLicensePlate(this.licensePlate).subscribe(
        (clientData: any[]) => {
          if (clientData && clientData.length > 0) {
            this.client = {
              name: clientData[0][0],         // El nombre está en la primera posición
              phoneNumber: clientData[0][1],  // El número de teléfono en la segunda posición
              email: clientData[0][2]         // El correo electrónico en la tercera posición
            };
          } else {
            console.warn('No se encontraron datos para el cliente asociado a la matrícula:', this.licensePlate);
          }
        },
        (error: any) => {
          console.error('Error al obtener los datos del cliente:', error);
          this.handleError(error); // Manejo de errores
        }
      );

      // Obtener los formularios y transformarlos
      this.carService.getFormsByCarLicensePlate(this.licensePlate).subscribe(
        (formData: any[]) => {
          this.forms = formData.map(item => ({
            id: item[0],
            description: item[1],
            date: item[2],
            initialDiagnosis: item[3],
            inspectionResults: item[4],
            workPerformed: item[5]
          }));
          console.log(this.forms); // Verifica que los datos se están cargando correctamente
        },
        (error: any) => {
          console.error('Error al obtener los formularios:', error);
          this.handleError(error); // Manejo de errores
        }
      );

      // Obtener las facturas y transformarlas
      this.carService.getInvoicesByCarLicensePlate(this.licensePlate).subscribe(
        (invoices: any[]) => {
          this.invoices = invoices.map(invoice => ({
            id: invoice[0],
            subtotal: invoice[1],
            issueDate: new Date(invoice[2]),
            vat: invoice[3],
            total: invoice[4],
            paymentMethod: invoice[5],
            warranty: invoice[6]
          }));
        },
        (error: any) => {
          console.error('Error al obtener las facturas:', error);
          this.handleError(error); // Manejo de errores
        }
      );
    }
  }

  // Método para ver más información del formulario
  // Método para ver más información del formulario
  viewMoreInfo(form: form) {
    if (form && form.id) {
      // Redirige a la página de información del formulario con el ID del formulario
      this.router.navigate(['/forminfo', form.id]);
    } else {
      console.error('Formulario no válido');
    }
  }

  // Método para modificar el formulario
  modifyForm(form: form) {
    this.selectedForm = { ...form }; // Crea una copia del formulario seleccionado
    this.showModifyModal = true; // Muestra el modal
  }

  // Método para guardar los cambios del formulario modificado
  onSaveForm(modifiedForm: form) {
    // Aquí puedes enviar los cambios al backend si es necesario
    const formIndex = this.forms.findIndex(f => f.id === modifiedForm.id);
    if (formIndex !== -1) {
      this.forms[formIndex] = { ...modifiedForm };
    }
    this.showModifyModal = false; // Cierra el modal después de guardar
  }

  // Método para redirigir a la página de factura
  printInvoice(invoice: any) {
    if (invoice && invoice.id) {
      console.log('Redirigiendo a la factura con ID:', invoice.id);
      this.router.navigate(['/invoiceInfo', invoice.id]);
    } else {
      console.error('Factura no válida');
    }
  }

  // Método para modificar la factura
  modifyInvoice(invoice: any) {
    if (invoice && invoice.id) {
      this.router.navigate(['/invoice', invoice.id]);
    } else {
      console.error('Factura no válida');
    }
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