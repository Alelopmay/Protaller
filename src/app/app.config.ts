import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
export const appConfig: ApplicationConfig = {

    providers: [
      provideRouter(routes),           // Provee el enrutador
      provideClientHydration(),        // Opcional: Hidratación si usas SSR
    provideHttpClient(withFetch()) // Aquí se añade withFetch()              // Provee el HttpClient
    ]
  };