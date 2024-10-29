import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { CompanyService } from '../../service/company.service'; // Importa el servicio
import { Company } from '../../model/company'; // Importa el modelo de Company
import { FormsModule } from '@angular/forms';
import { LeafletService } from '../../service/leaflef.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  companies: Company[] = [];
  radius: number = 5000;

  constructor(
    private router: Router,
    private leafletService: LeafletService,
    private companyService: CompanyService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            this.initMap([lat, lng], 13); // Inicializa el mapa centrado en la ubicación del usuario
          },
          (error) => {
            console.error('Error obteniendo la ubicación del usuario:', error);
            this.initMap([40.7128, -74.0060], 13); // Fallback si falla la geolocalización
          }
        );
      } else {
        console.warn('Geolocalización no soportada por este navegador.');
        this.initMap([40.7128, -74.0060], 13); // Fallback si no hay geolocalización
      }
    }
  }

  // Inicializa el mapa
  private initMap(center: [number, number], zoom: number): void {
    this.leafletService.initMap('map', center, zoom).then(() => {
      this.loadCompaniesOnMap(); // Cargar las empresas y marcarlas en el mapa
    });
  }

  // Cargar las empresas y añadir los marcadores en el mapa
  // Cargar las empresas y añadir los marcadores en el mapa
  private loadCompaniesOnMap(): void {
    this.companyService.getAllCompanies().subscribe((companies) => {
      this.companies = companies;
      companies.forEach((company) => {
        if (company.latitude && company.longitude) {
          this.leafletService.addMarkerOnMap('map', [company.latitude, company.longitude], company);
        }
      });
    });
  }


  // Buscar empresas cercanas
  // Buscar empresas cercanas
  // Buscar empresas cercanas
  searchNearbyCompanies(): void {
    const center = this.leafletService.getMapCenter();
    const radius = this.radius;

    if (!center || !center.lat || !center.lng) {
      console.error('Error: No se pudo obtener la ubicación del mapa.');
      return;
    }

    // Dibuja el círculo en el mapa
    this.leafletService.drawCircleOnMap([center.lat, center.lng], radius);

    // Obtiene todas las empresas, pero solo filtra las cercanas dentro del radio
    this.companyService.getAllCompanies().subscribe(
      (companies) => {
        if (!companies || companies.length === 0) {
          console.warn('No se encontraron empresas.');
          this.companies = [];
          return;
        }

        // Filtrar las empresas que están dentro del radio
        const nearbyCompanies = companies.filter((company) => {
          if (company.latitude && company.longitude) {
            const distance = this.calculateDistance(
              center.lat, center.lng,
              company.latitude, company.longitude
            );
            return distance <= radius;
          }
          return false;
        });

        this.companies = nearbyCompanies; // Actualiza la lista de empresas cercanas

        // Limpiar los marcadores anteriores
        this.leafletService.clearMarkersOnMap('map');

        // Añadir solo los marcadores de empresas cercanas
        nearbyCompanies.forEach((company) => {
          if (company.latitude && company.longitude) {
            this.leafletService.addMarkerOnMap('map', [company.latitude, company.longitude], company); // Marcamos en el mapa
          }
        });
      },
      (error) => {
        console.error('Error al obtener las empresas cercanas:', error);
      }
    );
  }

  // Método para calcular la distancia entre dos puntos geográficos
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180; // φ, λ en radianes
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distancia en metros
    return distance;
  }


  irALogin() {
    this.router.navigate(['/login']);
  }

  infoForClient() {
    this.router.navigate(['/infoforclient']);
  }
}
