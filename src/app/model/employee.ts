export interface Employee {
    id: number;          // ID del empleado
    firstName: string;   // Nombre del empleado
    lastName: string;    // Apellido del empleado
    username: string;    // Nombre de usuario
    password?: string;   // Contraseña (puede ser omitida en el frontend por razones de seguridad)
    role?: string;       // Rol del empleado (opcional)
    photo?: string;      // URL o ruta de la foto (opcional)
    companyId: number;   // ID de la empresa
}
