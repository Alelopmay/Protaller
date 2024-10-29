import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../service/employee.service';
import { AuthService } from '../../service/auth.service';
import { Filesystem, FilesystemDirectory, FilesystemEncoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-registre-worker',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registre-worker.component.html',
  styleUrls: ['./registre-worker.component.css']
})
export class RegistreWorkerComponent implements OnInit {
  worker: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    role: '',
    photo: '', // Foto en Base64
    companyId: 0 // Inicialmente 0, se establecerá más tarde
  };

  @Output() workerSaved = new EventEmitter<void>();
  @Output() workerCancelled = new EventEmitter<void>();

  confirmationMessage: string | null = null;

  constructor(private employeeService: EmployeeService, private authService: AuthService) { }

  ngOnInit() {
    this.setCompanyIdFromToken();
  }

  setCompanyIdFromToken() {
    const employeeData = this.authService.getEmployeeDataFromToken();
    if (employeeData && employeeData.companyId) {
      this.worker.companyId = employeeData.companyId; // Usa el companyId del token
    } else {
      console.error('No se pudo obtener el companyId del token.');
    }
  }

  // Método para manejar la presentación del formulario
  onSubmit() {
    if (!this.worker.photo) {
      this.confirmationMessage = 'Por favor, carga una foto antes de guardar.';
      return;
    }

    // Enviar el employeeService con el companyId ya establecido
    this.employeeService.createEmployee(this.worker).subscribe(
      (response) => {
        this.confirmationMessage = '¡Trabajador guardado con éxito!';
        this.resetWorker();
        setTimeout(() => {
          this.workerSaved.emit();
        }, 1000);
      },
      (error) => {
        console.error('Error al guardar el trabajador:', error);
        this.confirmationMessage = 'Error al guardar el trabajador. Inténtalo de nuevo.';
      }
    );
  }

  cancel() {
    this.workerCancelled.emit(); // Emitir evento cuando se cancela
    this.resetWorker(); // Limpiar los datos del trabajador
  }

  resetWorker() {
    this.worker = {
      id: 0,
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      role: '',
      photo: '', // Reiniciar la foto a cadena vacía
      companyId: this.authService.getEmployeeDataFromToken().companyId || 0 // Restablecer al companyId del token
    };
  }

  // Método para manejar el cambio de archivo y convertirlo a Base64
  async onFileChange(event: any) {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Utilizar FileReader para leer el archivo
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const base64Data = e.target.result.split(',')[1]; // Obtener solo la parte Base64
        this.worker.photo = base64Data;

        // Opcional: guarda el archivo en el sistema de archivos de Capacitor
        await this.saveFileToAppDirectory(file);
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para guardar el archivo en el sistema de archivos de la aplicación
  async saveFileToAppDirectory(file: File) {
    try {
      const base64Data = await this.convertFileToBase64(file);

      const filename = `${new Date().getTime()}_${file.name}`;
      await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: FilesystemDirectory.Data,
        encoding: FilesystemEncoding.UTF8,
      });
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
    }
  }

  // Método para convertir un archivo a Base64
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]); // Retorna solo los datos Base64 sin el prefijo MIME
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
}
