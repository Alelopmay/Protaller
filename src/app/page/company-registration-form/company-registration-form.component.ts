import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CompanyService } from '../../service/company.service';
import { Company } from '../../model/company';
import { LeafletService } from '../../service/leaflef.service';

@Component({
  selector: 'app-company-registration-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './company-registration-form.component.html',
  styleUrls: ['./company-registration-form.component.css']
})
export class CompanyRegistrationFormComponent implements OnInit {
  companyForm: FormGroup;
  successMessage: string | null = null;
  confirmationMessage: string | null = null;
  showSuccessModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private leafletService: LeafletService,  // Inyectar el servicio de Leaflet
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    // Inicialización del formulario
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      location: [null, Validators.required],  // Campo de ubicación
      schedule: ['', [Validators.required, Validators.minLength(5)]]  // Campo para el horario
    });
  }

  ngOnInit(): void {
    // Verifica que el código se está ejecutando en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap(); // Inicializa el mapa solo en el navegador
    }
  }

  async initializeMap(): Promise<void> {
    // Inicializa el mapa y agrega el listener para los clics
    try {
      await this.leafletService.initMap('map', [51.505, -0.09], 13);

      // Escuchar clics en el mapa
      this.leafletService.addClickListener((latlng) => {
        this.setLocation(latlng);

        // Convertir LatLng a un array [lat, lng] antes de agregar el marcador
        const coords: [number, number] = [latlng.lat, latlng.lng];
        this.leafletService.addMarker(coords);  // Agregar el marcador con coordenadas correctas
      });
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  // Actualiza el valor del campo 'location' en el formulario
  setLocation(latlng: any): void {
    this.companyForm.patchValue({
      location: {
        lat: latlng.lat,
        lng: latlng.lng
      }
    });
  }

  // Método para registrar la empresa
  registerCompany(): void {
    if (this.companyForm.valid) {
      const newCompany: Company = this.companyForm.value;
      this.companyService.createCompany(newCompany).subscribe({
        next: (response: boolean) => {
          if (response) {
            this.successMessage = '¡La empresa fue creada con éxito!';
            this.showSuccessModal = true;
            this.companyForm.reset();

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          } else {
            this.confirmationMessage = 'La empresa no se pudo crear. Puede que ya exista.';
          }
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    } else {
      const invalidFields = this.getInvalidFields(this.companyForm);
      this.confirmationMessage = 'Por favor, completa todos los campos requeridos correctamente: ' + invalidFields.join(', ');
    }
  }

  // Manejo de errores
  handleError(err: any): void {
    if (err.status === 409) {
      this.confirmationMessage = 'La empresa ya existe. Intenta con otro nombre.';
    } else if (err.status === 0) {
      this.confirmationMessage = 'Error de conexión. No se pudo contactar con el servidor.';
    } else if (err.status >= 400 && err.status < 500) {
      this.confirmationMessage = 'Error en los datos proporcionados. Por favor, revisa los campos.';
    } else if (err.status >= 500) {
      this.confirmationMessage = 'Error interno del servidor. Intenta nuevamente más tarde.';
    } else {
      this.confirmationMessage = 'Ocurrió un error desconocido. Intenta nuevamente.';
    }
  }

  // Obtener los campos inválidos para mostrarlos al usuario
  getInvalidFields(form: FormGroup): string[] {
    const invalidFields: string[] = [];
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.invalid) {
        invalidFields.push(key);
      }
    });
    return invalidFields;
  }

  // Método para cancelar el registro y redirigir
  cancelRegistration(): void {
    if (confirm('¿Estás seguro de que deseas cancelar el registro?')) {
      this.router.navigate(['/login']);
    }
  }

  // Cerrar el modal de éxito
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }
}
