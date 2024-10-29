import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FileService } from '../../service/file.service';
import { RepairService } from '../../service/repair.service';
import { CommonModule } from '@angular/common';
import { MyFile } from '../../model/MyFile';
import { repair } from '../../model/repair';
import { EmployeeService } from '../../service/employee.service';
import { AuthService } from '../../service/auth.service'; // Importa el servicio de autenticación
import { CarService } from '../../service/car.service';

@Component({
  selector: 'app-infofile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './infofile.component.html',
  styleUrls: ['./infofile.component.css']
})
export class InfofileComponent implements OnInit {
  file: MyFile | null = null;          // Detalles del archivo
  workData: any[] = [];                // Datos de trabajo
  repairData: repair[] = [];           // Datos de reparación
  formsData: any[] = [];               // Datos de formularios
  invoicesData: any[] = [];            // Datos de facturas
  errorMessage: string | null = '';     // Mensaje de error
  isWorking: boolean = false;           // Estado de trabajo
  elapsedTime: number = 0;              // Tiempo transcurrido
  interval: any;                        // Intervalo para el temporizador
  formattedTime: string = '00:00:00';   // Formato del tiempo
  startDateTime: Date | null = null;    // Fecha de inicio
  endDateTime: Date | null = null;      // Fecha de fin
  successMessage: string | undefined;
  employeeId: number | null = null;     // ID del empleado autenticado

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private repairService: RepairService,
    private employeeService: EmployeeService,
    private authService: AuthService,   // Inyecta el servicio de autenticación
    private router: Router,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeIdFromToken();

    this.route.queryParams.subscribe(params => {
      const fileId = params['plate'];
      if (fileId) {
        this.loadFileDetails(fileId);
        this.loadWorkData(fileId);
        this.loadFormsAndInvoices(fileId);
      } else {
        this.errorMessage = 'No se proporcionó un ID de archivo.';
      }
    });
  }

  loadFileDetails(fileId: string): void {
    this.fileService.getFileWithCarAndClientByFileId(fileId).subscribe(
      (response: any[]) => {
        if (response && response.length > 0 && Array.isArray(response[0])) {
          const data = response[0];
          const fileData = data.find((item: any) => item.id && item.date);
          const clientData = data.find((item: any) => item.name && item.phoneNumber);

          if (fileData) {
            this.file = {
              id: fileData.id,
              date: new Date(fileData.date).toISOString(),
              report: fileData.report,
              clientName: '',
              carLicensePlate: fileData.carLicensePlate,
              details: fileData.details,
              archived: fileData.archived
            };
          }

          if (clientData && this.file) {
            this.file.clientName = clientData.name;
          }
        } else {
          this.errorMessage = 'No se encontraron datos para el archivo.';
        }
      },
      (error) => {
        this.errorMessage = 'Error al cargar los detalles del archivo.';
        console.error('Error al cargar los detalles del archivo:', error);
      }
    );
  }

  loadWorkData(fileId: string): void {
    const numericFileId = Number(fileId);

    if (isNaN(numericFileId)) {
      this.errorMessage = 'ID de archivo no válido.';
      return;
    }

    this.fileService.getWorkDataByFileId(numericFileId).subscribe(
      (response: any[]) => {
        console.log('Datos de trabajo:', response);

        this.repairData = response.map(item => {
          const startDate = item[0] ? new Date(item[0]) : new Date();
          const endDate = item[1] ? new Date(item[1]) : new Date();

          const hoursWorked = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

          return {
            car: {
              licensePlate: '',
              model: '',
              carCondition: '',
              clientId: 0
            },
            employee: {
              id: 0,
              firstName: item[2],
              lastName: item[3],
              username: '',
              companyId: 0
            },
            startDate: startDate,
            endDate: endDate,
            hoursWorked: hoursWorked.toFixed(2)
          };
        });
      },
      (error) => {
        console.error('Error al cargar los datos de trabajo:', error);
        this.errorMessage = 'Error al cargar los datos de trabajo.';
      }
    );
  }

  loadFormsAndInvoices(fileId: string): void {
    if (this.file && this.file.carLicensePlate && this.employeeId) {
      const licensePlate = this.file.carLicensePlate;

      this.carService.getFormsByCarLicensePlateAndEmployeeId(licensePlate, this.employeeId).subscribe(
        (response: any[]) => {
          this.formsData = response;
        },
        (error) => {
          this.errorMessage = 'Error al cargar los formularios.';
          console.error('Error al cargar los formularios:', error);
        }
      );

      this.carService.getInvoicesByCarLicensePlateAndEmployeeId(licensePlate, this.employeeId).subscribe(
        (response: any[]) => {
          this.invoicesData = response;
        },
        (error) => {
          this.errorMessage = 'Error al cargar las facturas.';
          console.error('Error al cargar las facturas:', error);
        }
      );
    } else {
      this.errorMessage = 'No se pueden cargar los formularios y facturas, faltan datos.';
    }
  }

  startWork(): void {
    this.isWorking = true;
    this.elapsedTime = 0;

    const now = new Date();
    this.startDateTime = now;

    this.interval = setInterval(() => {
      this.elapsedTime++;
      this.formattedTime = this.formatTime(this.elapsedTime);
    }, 1000);
  }

  finishWork(): void {
    this.isWorking = false;
    clearInterval(this.interval);

    const now = new Date();
    this.endDateTime = now;

    this.saveRepair();

    if (this.startDateTime && this.endDateTime) {
      const workedTime = this.calculateWorkedTime(this.startDateTime, this.endDateTime);
      this.formattedTime = workedTime; // Muestra el tiempo trabajado en formato HH:MM:SS
    }
  }

  calculateWorkedTime(start: Date, end: Date): string {
    const delta = end.getTime() - start.getTime(); // Diferencia en milisegundos

    const seconds = Math.floor((delta / 1000) % 60);
    const minutes = Math.floor((delta / (1000 * 60)) % 60);
    const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  saveRepair(): void {
    if (this.file && this.startDateTime && this.employeeId !== null) {
      const repairData: repair = {
        car: {
          licensePlate: this.file.carLicensePlate,
          model: '',
          carCondition: '',
          clientId: 0
        },
        employee: {
          id: this.employeeId,
          firstName: '',
          lastName: '',
          username: '',
          companyId: 0
        },
        startDate: this.startDateTime,
        endDate: this.endDateTime !== null ? this.endDateTime : undefined
      };

      this.repairService.createRepair(repairData).subscribe(
        (response) => {
          console.log('Repair guardado exitosamente:', response);
        },
        (error) => {
          console.error('Error al guardar el repair:', error);
          this.errorMessage = 'No se pudo guardar la reparación. Intente de nuevo.';
        }
      );
    } else {
      this.errorMessage = 'No se pudo guardar la reparación. Faltan datos.';
    }
  }

  goBack(): void {
    window.history.back();
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  archive(): void {
    if (this.file && this.file.id) {
      const fileId = Number(this.file.id);

      if (isNaN(fileId)) {
        console.error('ID de archivo no válido:', this.file.id);
        this.errorMessage = 'ID de archivo no válido.';
        return;
      }

      this.employeeService.archiveFileByTaskId(fileId).subscribe(
        (response) => {
          if (response.success) {
            console.log('Archivo archivado exitosamente:', response.message);
            this.file!.archived = true;
            this.successMessage = response.message;
            this.loadFormsAndInvoices(fileId.toString());
          } else {
            console.error('Error al archivar el archivo:', response.message);
            this.errorMessage = 'Error al archivar el archivo: ' + response.message;
          }
        },
        (error) => {
          console.error('Error al archivar el archivo:', error);
          this.errorMessage = 'Error al archivar el archivo.';
        }
      );
    }
  }

  getTotalHours(): number {
    return this.repairData.reduce((total, repair) => {
      if (repair.endDate && repair.startDate) {
        const hoursWorked = (repair.endDate.getTime() - repair.startDate.getTime()) / 3600000; // En horas
        return total + hoursWorked;
      }
      return total;
    }, 0);
  }

}
