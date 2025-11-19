import { Component, OnInit, Inject, Optional } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, RouterModule],
})
export class AppComponent implements OnInit {
  constructor(@Optional() private swUpdate?: SwUpdate) {}

  ngOnInit() {
    this.initializePWA();
  }

  private initializePWA() {
    // Registrar el service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ngsw-worker.js').then(
        (registration) => {
          console.log('Service Worker registrado exitosamente:', registration);
        },
        (error) => {
          console.log('Error al registrar Service Worker:', error);
        }
      );
    }

    // Escuchar actualizaciones disponibles si SwUpdate está disponible
    if (this.swUpdate) {
      this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
        if (event.type === 'VERSION_READY') {
          console.log('Nueva versión disponible');
          // Mostrar notificación al usuario
          if (
            confirm(
              'Una nueva versión está disponible. ¿Desea actualizar?'
            )
          ) {
            this.swUpdate?.activateUpdate().then(() => {
              document.location.reload();
            });
          }
        }
      });
    }
  }
  }