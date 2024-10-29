import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { form } from '../../model/form';
import { FormService } from '../../service/form.service';
import { PhotoService } from '../../service/photo.service'; // Importa el PhotoService
import { photo } from '../../model/photo';

@Component({
  selector: 'app-info-form',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.css'] // Corrige la referencia a 'styleUrls'
})
export class InfoFormComponent implements OnInit {
  formId: number | null = null; // ID del formulario actual
  formDetails: form | null = null; // Detalles del formulario a mostrar
  photos: photo[] = []; // Almacena las fotos del formulario
backgroundImageUrl: string = 'http://localhost:8080/photos/garage-background.jpg';

  private baseUrl: string = 'http://localhost:8080'; // Base URL del backend

  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    private photoService: PhotoService // Inyecta el servicio de fotos
  ) { }

  ngOnInit(): void {
    // Obtener el ID del formulario de los parámetros de la ruta
    this.formId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.formId) {
      // Cargar los detalles del formulario
      this.loadFormDetails(this.formId);
      // Cargar las fotos del formulario
      this.loadFormPhotos(this.formId);
    }
  }

  // Método para obtener los detalles del formulario por ID
  loadFormDetails(id: number): void {
    this.formService.getFormById(id).subscribe(
      (form: form) => {
        this.formDetails = form;
      },
      (error: any) => {
        console.error('Error al cargar los detalles del formulario:', error);
      }
    );
  }

  // Método para obtener las fotos del formulario por formId
  loadFormPhotos(formId: number): void {
    this.photoService.getPhotosByFormId(formId).subscribe(
      (photos: photo[]) => {
        this.photos = photos;
        console.log('Fotos del formulario:', photos);
      },
      (error: any) => {
        console.error('Error al cargar las fotos del formulario:', error);
      }
    );
  }

  // Método para construir la URL completa de la foto
  // Método para construir la URL completa de la foto en el componente Angular
  getFullPhotoUrl(photoUrl: string): string {
    if (photoUrl.startsWith('/photos/')) {
      // Para URL basadas en servidor
      return `${this.baseUrl}${photoUrl}`;
    } else if (photoUrl.startsWith('data:image')) {
      // Para imágenes codificadas en Base64
      return photoUrl;
    }
    return '';
  }

}
