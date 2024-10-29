import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import jwt_decode from 'jwt-decode'; // Asegúrate de importar jwt_decode

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  logout() {
    throw new Error('Method not implemented.');
  }
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }


  // Método que verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('Token no encontrado en localStorage.');
      return false;
    }
    const tokenExpired = this.isTokenExpired(token);
    console.log('Token encontrado. Expirado:', tokenExpired);
    return !tokenExpired;
  }

  // Obtener el token almacenado en localStorage
  getToken() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Método que decodifica el token y extrae el employeeId
  getEmployeeIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token); // Decodificar el token JWT
        console.log('Token decodificado:', decodedToken);
        return decodedToken.sub; // Devolver solo el employeeId
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    } else {
      console.log('No se encontró token.');
    }
    return null;
  }

  // Verificar si el token ha expirado
  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwt_decode(token);
      const expirationDate = decodedToken.exp * 1000; // Convertir de segundos a milisegundos
      const currentTime = new Date().getTime();
      console.log('Fecha de expiración del token:', expirationDate, 'Hora actual:', currentTime);
      return expirationDate < currentTime; // Si la fecha actual es mayor, el token ha expirado
    } catch (error) {
      console.error('Error al verificar la expiración del token:', error);
      return true; // Si hay un error, se asume que el token está expirado
    }
  }
  // Método que decodifica el token y extrae el employeeId y companyId
   getEmployeeDataFromToken(): { employeeId: number | null, companyId: number | null } {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token); // Decodificar el token JWT
        console.log('Token decodificado:', decodedToken);
        return {
          employeeId: decodedToken.sub, // Asumimos que `sub` es el employeeId
          companyId: decodedToken.companyId // Asegúrate que `companyId` esté en el token
        };
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return { employeeId: null, companyId: null };
      }
    } else {
      console.log('No se encontró token.');
    }
    return { employeeId: null, companyId: null };
  }


}
