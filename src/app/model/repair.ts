import { car } from './car'; // Asegúrate de que la ruta sea correcta
import { Employee } from './employee'; // Asegúrate de que la ruta sea correcta

export interface repair {
    id?: number;                  // ID de la reparación (opcional)
    car: car;                     // Objeto Car
    employee: Employee;           // Objeto Employee
    startDate: Date;              // Fecha de inicio
    endDate?: Date;               // Fecha de fin (opcional)
}
