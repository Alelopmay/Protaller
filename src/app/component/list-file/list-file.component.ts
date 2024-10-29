import { Component, OnInit } from '@angular/core';
import { FileService } from '../../service/file.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importa el Router
import { MyFile } from '../../model/MyFile';
import { AuthService } from '../../service/auth.service'; // Importar el servicio de autenticación

@Component({
  selector: 'app-list-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-file.component.html',
  styleUrls: ['./list-file.component.css']
})
export class ListFileComponent implements OnInit {
  files: MyFile[] = [];
  employeeId: number | null = null; // Cambia esto a null inicialmente
  isActive: boolean = true; // Variable para controlar el estado actual

  constructor(private fileService: FileService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeIdFromToken(); // Obtener employeeId del token
    if (this.employeeId) {
      this.loadFiles(this.isActive); // Cargar archivos activos por defecto
    } else {
      console.error('No se pudo obtener el employeeId del token.');
    }
  }

  loadFiles(isActive: boolean): void {
    this.isActive = isActive; // Actualiza el estado actual
    const apiCall = isActive
      ? this.fileService.getActiveFilesByEmployeeId(this.employeeId!) // Utiliza el operador de aserción no nulo
      : this.fileService.getFilesByEmployeeId(this.employeeId!);

    apiCall.subscribe(
      (data: any) => {
        console.log(isActive ? 'Datos recibidos (activos):' : 'Datos recibidos (archivados):', data);

        this.files = data.map((item: any) => ({
          id: item.id,
          date: item.date,
          report: item.report,
          clientName: item.clientName,
          carLicensePlate: item.carLicensePlate,
          details: item.details,
          archived: item.archived
        })) as MyFile[];

        console.log('Archivos después de mapear:', this.files); // Verifica aquí
      },
      (error) => {
        console.error('Error al cargar archivos:', error);
      }
    );
  }

  workOnFile(file: MyFile): void {
    console.log('Trabajando en el archivo:', file);
    this.router.navigate(['/infofile'], { queryParams: { plate: file.id } });
  }
}
