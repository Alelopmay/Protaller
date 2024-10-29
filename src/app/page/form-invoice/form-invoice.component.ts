import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Invoice } from '../../model/Invoice'; // Modelo de factura
import { InvoiceService } from '../../service/invoice.service';

@Component({
  selector: 'app-form-invoice',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-invoice.component.html',
  styleUrls: ['./form-invoice.component.css']
})
export class FormInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  carLicensePlate: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const currentDate = new Date().toISOString().substring(0, 10);

    this.invoiceForm = this.fb.group({
      subtotal: ['', [Validators.required, Validators.min(0)]],
      issueDate: [{ value: currentDate, disabled: true }, Validators.required],
      vat: ['', [Validators.required, Validators.min(0)]],
      total: ['', [Validators.required, Validators.min(0)]],
      paymentMethod: ['', Validators.required],
      warranty: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.carLicensePlate = params.get('licensePlate');
      console.log('Matrícula en FormInvoice:', this.carLicensePlate);
    });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const invoice: Invoice = this.invoiceForm.getRawValue();
      invoice.issueDate = new Date(invoice.issueDate);

      if (this.carLicensePlate) {
        invoice.car = {
          licensePlate: this.carLicensePlate,
          model: 'ModeloEjemplo', // Proporciona valores adecuados
          carCondition: 'Nuevo', // Proporciona valores adecuados
          clientId: 1 // Proporciona valores adecuados
        };
      } else {
        invoice.car = null;
      }

      this.invoiceService.createInvoice(invoice).subscribe({
        next: (response) => {
          console.log('Invoice created:', response);
          this.successMessage = '¡Factura creada exitosamente!';  // Mensaje de éxito
          this.errorMessage = null; // Asegurar que el mensaje de error se oculte
          this.invoiceForm.reset(); // Opcional: resetear el formulario después de guardar
        },
        error: (error) => {
          console.error('Error creating invoice:', error);
          this.errorMessage = 'Ocurrió un error al crear la factura. Por favor, inténtalo de nuevo.'; // Mensaje de error
          this.successMessage = null; // Asegurar que el mensaje de éxito se oculte
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  logFormErrors() {
    Object.keys(this.invoiceForm.controls).forEach(key => {
      const controlErrors = this.invoiceForm.get(key)?.errors;
      if (controlErrors) {
        console.error(`Error in control ${key}:`, controlErrors);
      }
    });
  }
}