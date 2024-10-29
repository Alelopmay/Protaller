import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormService } from '../../service/form.service';
import { AuthService } from '../../service/auth.service';
import { PhotoService } from '../../service/photo.service';
import { CommonModule } from '@angular/common';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-form-repair',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './form-repair.component.html',
  styleUrls: ['./form-repair.component.css']
})
export class FormRepairComponent implements OnInit {
  formRepair: FormGroup;
  selectedCarLicensePlate: string | null = null;
  formSuccessMessage: string | null = null;
  currentDate: string;
  photos: string[] = [];  // Almacenará las fotos en base64
  isSubmitting = false; // Para evitar múltiples envíos simultáneos

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private photoService: PhotoService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.formRepair = this.fb.group({
      description: ['', Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      initialDiagnosis: ['', Validators.required],
      inspectionResults: ['', Validators.required],
      workPerformed: ['', Validators.required]
    });

    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.selectedCarLicensePlate = this.route.snapshot.paramMap.get('licensePlate');
    this.formRepair.patchValue({
      date: this.currentDate
    });
  }

  // Método para manejar el cambio de archivos seleccionados
  onFileChange(event: any): void {
    const files = event.target.files;  // Archivos seleccionados

    if (files && files.length > 0) {
      this.photos = [];  // Reinicia las fotos antes de añadir nuevas
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          this.photos.push(base64);  // Añade la imagen convertida a base64
        };
        reader.readAsDataURL(file);  // Convierte el archivo a base64
      });
    }
  }

  // Método para enviar el formulario de reparación y las fotos
  onSubmit(): void {
    if (this.formRepair.valid && this.photos.length > 0) {
      this.isSubmitting = true;
      const formPayload = {
        description: this.formRepair.get('description')?.value,
        date: this.formRepair.get('date')?.value,
        initialDiagnosis: this.formRepair.get('initialDiagnosis')?.value,
        inspectionResults: this.formRepair.get('inspectionResults')?.value,
        workPerformed: this.formRepair.get('workPerformed')?.value,
        car: {
          licensePlate: this.selectedCarLicensePlate
        },
        employee: {
          id: this.authService.getEmployeeIdFromToken()
        }
      };

      // Enviar el formulario de reparación primero
      this.formService.createForm(formPayload).subscribe(
        (response: any) => {
          const formId = response.id;  // Obtenemos el ID del formulario creado
          console.log('Formulario enviado correctamente', response);

          // Subir las fotos vinculadas al formId
          this.uploadPhotos(formId).then(() => {
            this.formSuccessMessage = "Formulario y fotos creados con éxito";

            // Limpiar el formulario excepto la fecha
            const savedDate = this.formRepair.get('date')?.value;  // Guardamos la fecha actual
            this.formRepair.reset();  // Limpiar el formulario
            this.formRepair.patchValue({ date: savedDate });  // Restaurar la fecha

            this.photos = [];  // Limpiar las fotos seleccionadas
            this.isSubmitting = false;  // Reiniciar el estado de envío
            setTimeout(() => {
              this.router.navigate(['/success']);
            }, 3000);
          });
        },
        (error) => {
          console.error('Error al enviar el formulario', error);
          this.isSubmitting = false;
        }
      );
    } else {
      console.error('El formulario no es válido o no se han añadido fotos.');
    }
  }


  // Subir todas las fotos al backend vinculadas al formId
  async uploadPhotos(formId: number): Promise<void> {
    const uploadPromises = this.photos.map((photoBase64) => {
      const formData = new FormData();
      formData.append('file', this.dataUrlToFile(photoBase64, `photo_${formId}.jpg`));  // Convertimos base64 a archivo
      formData.append('formId', formId.toString());
      return this.photoService.createPhoto(formData).toPromise();
    });

    await Promise.all(uploadPromises);
  }

  // Método para convertir base64 a un objeto File
  dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
