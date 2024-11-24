import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

console.log('Iniciando la aplicación Angular...');

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // Asegúrate de que esté aquí
  ]
}).catch(err => {
  console.error('Error al iniciar la aplicación:', err);
});