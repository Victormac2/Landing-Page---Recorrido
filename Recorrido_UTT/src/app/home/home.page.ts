import { Component, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class HomePage implements OnDestroy, AfterViewInit {
  private injectedElements: HTMLElement[] = [];
  private initialized = false;
  private initializationInProgress = false;

  constructor(private ngZone: NgZone) {}

  async ngAfterViewInit(): Promise<void> {
    if (this.initialized || this.initializationInProgress) {
      console.log('⚠️ Already initialized or in progress');
      return;
    }

    this.initializationInProgress = true;

    try {
      (window as any).MARZIPANO_TILE_PATH = 'assets/Marzipano/app-files/tiles';
      (window as any).MARZIPANO_ASSET_PATH = 'assets/Marzipano/app-files';
    } catch (e) {
      console.warn('No se pudo definir MARZIPANO_TILE_PATH:', e);
      this.initializationInProgress = false;
      return;
    }

    try {
      // Cargar scripts primero
      await this.loadMarzipanoAssets();
      console.log('✅ Scripts de Marzipano cargados.');

      // Esperar a que el DOM esté listo
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Intentar inicializar
      await this.tryInitializeMarzipano();
      this.initialized = true;
      console.log('✅ Marzipano inicializado correctamente');
    } catch (error) {
      console.error('Error durante la inicialización:', error);
    } finally {
      this.initializationInProgress = false;
    }
  }

  private tryInitializeMarzipano(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const MAX_ATTEMPTS = 10;
      let currentAttempt = 1;

      const tryInit = () => {
        if ((window as any).initializeMarzipano) {
          console.log('🚀 Ejecutando initializeMarzipano...');
          try {
            this.ngZone.runOutsideAngular(() => {
              (window as any).initializeMarzipano();
            });
            resolve();
          } catch (err) {
            console.error('❌ Error al ejecutar initializeMarzipano:', err);
            reject(err);
          }
        } else if (currentAttempt < MAX_ATTEMPTS) {
          console.warn(
            `⏳ initializeMarzipano aún no disponible (intento ${currentAttempt}/${MAX_ATTEMPTS})`
          );
          currentAttempt++;
          setTimeout(tryInit, 800);
        } else {
          const error = new Error('❌ No se pudo inicializar Marzipano tras varios intentos.');
          console.error(error);
          reject(error);
        }
      };

      tryInit();
    });
  }

  private async loadMarzipanoAssets(): Promise<void> {
    const base = 'assets/Marzipano/app-files';

    // Inyectar CSS
    this.injectCss(`${base}/vendor/reset.min.css`);
    this.injectCss(`${base}/style.css`);

    // Archivos JS en orden
    const scripts = [
      `${base}/vendor/screenfull.min.js`,
      `${base}/vendor/bowser.min.js`,
      `${base}/vendor/marzipano.js`,
      `${base}/data.js`,
      `${base}/index.js`,
    ];

    await this.loadScriptsSequentially(scripts);
    console.log('✅ Todos los scripts de Marzipano cargados.');
  }

  private injectCss(href: string): void {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    this.injectedElements.push(link);
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => {
        this.injectedElements.push(s);
        console.log(`✅ Script cargado: ${src}`);
        resolve();
      };
      s.onerror = () => {
        console.error(`❌ Error al cargar script: ${src}`);
        reject(new Error('Error al cargar: ' + src));
      };
      document.body.appendChild(s);
    });
  }

  private async loadScriptsSequentially(list: string[]): Promise<void> {
    for (const src of list) {
      try {
        await this.loadScript(src);
      } catch (e) {
        console.error(e);
      }
    }
  }

  ngOnDestroy(): void {
    this.initialized = false;
    this.initializationInProgress = false;

    for (const el of this.injectedElements) {
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    this.injectedElements = [];
  }
}
