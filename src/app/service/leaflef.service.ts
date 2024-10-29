import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Company } from '../model/company';

// Importación dinámica de Leaflet solo en el cliente
let L: any;

@Injectable({
  providedIn: 'root'
})
export class LeafletService {
  private map: any;       // Mapa de Leaflet
  private marker: any;    // Último marcador agregado

  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  // Método para cargar e inicializar el mapa
  async initMap(mapElementId: string, center: [number, number] = [51.505, -0.09], zoom: number = 13) {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Si estamos en el servidor, no hacemos nada
    }

    try {
      const { default: leaflet } = await import('leaflet');
      L = leaflet;

      const mapElement = document.getElementById(mapElementId);
      if (!mapElement) throw new Error(`Elemento con ID "${mapElementId}" no encontrado.`);

      this.map = L.map(mapElement).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      // Llamar a la función para marcar la ubicación actual
      this.markCurrentLocation();

      return this.map;
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  // Método para agregar un marcador en la ubicación actual
  async markCurrentLocation() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latlng: [number, number] = [position.coords.latitude, position.coords.longitude];
        await this.addMarker(latlng);

        const popup = L.popup()
          .setLatLng(latlng)
          .setContent("Aquí está usted")
          .openOn(this.map);
      }, (error) => {
        console.error('Error al obtener la ubicación:', error);
      });
    } else {
      console.error("Geolocalización no es soportada por este navegador.");
    }
  }

  // Método para agregar un marcador en una posición específica
  async addMarker(latlng: [number, number]) {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      if (!this.map) throw new Error('El mapa no está inicializado');

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker(latlng, {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [35, 45],
          iconAnchor: [17, 45]
        })
      }).addTo(this.map);

      return this.marker;
    } catch (error) {
      console.error('Error al agregar marcador:', error);
    }
  }

  // Método para agregar un marcador en el mapa con información de la empresa
  async addMarkerOnMap(mapId: string, latlng: [number, number], company: Company) {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      if (!this.map) throw new Error('El mapa no está inicializado');

      const marker = L.marker(latlng, {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [35, 45],
          iconAnchor: [17, 45]
        })
      }).addTo(this.map);

      // Crear un popup con los datos de la empresa
      marker.bindPopup(`
        <strong>${company.name}</strong><br>
        Dirección: ${company.address}<br>
        Horario: ${company.schedule}
      `);

      return marker;
    } catch (error) {
      console.error('Error al agregar marcador en el mapa:', error);
    }
  }

  // Método para limpiar todos los marcadores en el mapa
  clearMarkers(): void {
    if (!this.map) return;

    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer); // Elimina cada marcador
      }
    });
  }

  // Método para obtener el centro del mapa
  getMapCenter(): any {
    if (this.map) {
      return this.map.getCenter(); // Devuelve el centro del mapa
    }
    throw new Error('El mapa no está inicializado');
  }

  // Método para añadir un listener al mapa para detectar clics
  addClickListener(callback: (latlng: any) => void) {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.map) {
      this.map.on('click', (e: any) => {
        callback(e.latlng); // Ejecuta el callback con la posición del clic
      });
    }
  }

  // Método para dibujar un círculo en el mapa
  async drawCircleOnMap(center: [number, number], radius: number): Promise<any> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      // Primero elimina el círculo si ya existe
      this.clearCircle();

      const circle = L.circle(center, {
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.5,
        radius: radius // Radio en metros
      }).addTo(this.map);

      return circle;
    } catch (error) {
      console.error('Error al dibujar el círculo:', error);
    }
  }

  // Método para limpiar el círculo si existe
  private clearCircle() {
    if (this.map) {
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.Circle) {
          this.map.removeLayer(layer); // Elimina el círculo del mapa
        }
      });
    }
  }

  // Método para limpiar todos los marcadores en un mapa específico
  clearMarkersOnMap(mapId: string) {
    this.clearMarkers(); // Utiliza el método general para limpiar
  }
}
