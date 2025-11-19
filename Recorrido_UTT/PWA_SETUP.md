# Guía PWA - Recorrido UTT

## ✅ Archivos Generados

Se han creado/actualizado los siguientes archivos para convertir tu aplicación Ionic + Angular en una PWA completa:

### 1. **`src/manifest.json`** - Manifiesto PWA
   - Metadatos de la aplicación (nombre, descripción, colores)
   - Definición de iconos en múltiples tamaños
   - Configuración de pantalla de inicio y orientación
   - Accesos directos (shortcuts)
   - Categorías de la aplicación

### 2. **`ngsw-config.json`** - Configuración del Service Worker
   - Estrategias de cacheo (prefetch, lazy, performance, freshness)
   - Grupos de activos (app, assets, imágenes)
   - Configuración de datos en caché
   - URLs de navegación

### 3. **`src/app/app.component.ts`** - Componente actualizado
   - Inicialización del Service Worker
   - Monitoreo de actualizaciones de versión
   - Notificación al usuario cuando hay actualizaciones disponibles

### 4. **`src/index.html`** - Etiquetas PWA agregadas
   - Meta tags necesarios para PWA
   - Link al manifest.json
   - Apple touch icons
   - Theme color

### 5. **`angular.json`** - Configuración actualizada
   - Incluido `manifest.json` en assets
   - Service Worker habilitado en producción

---

## 📋 Pasos para Completar la PWA

### Paso 1: Instalar @angular/service-worker
```bash
npm install @angular/service-worker
```

### Paso 2: Generar Iconos PWA
Necesitas generar iconos en diferentes tamaños. Coloca los siguientes archivos en `src/assets/icon/`:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png` (requerido)
- `icon-384x384.png`
- `icon-512x512.png` (requerido)
- `maskable-icon-192x192.png` (iconos adaptables)
- `maskable-icon-512x512.png` (iconos adaptables)
- `screenshot-540x720.png` (pantalla estrecha)
- `screenshot-1280x720.png` (pantalla ancha)

**Herramientas recomendadas para generar iconos:**
- [PWA Asset Generator](https://github.com/GoogleChromeLabs/pwa-asset-generator)
- [Favicon Generator](https://www.favicon-generator.org/)
- [AppIcon.co](https://www.appicon.co/)

### Paso 3: Compilar para Producción
```bash
ng build --configuration production
```

El service worker se compilará automáticamente como `ngsw-worker.js` en la carpeta `www/`.

### Paso 4: Servir la Aplicación con HTTPS
Las PWA requieren HTTPS (excepto localhost). Opciones:
- **Desarrollo local:** `ng serve` funciona en localhost
- **Producción:** Usa un servidor con certificado SSL

```bash
# Desarrollo
ng serve

# Producción
ng build --configuration production
# Luego servir con http-server u otro servidor con HTTPS
```

### Paso 5: Verificar la PWA en Chrome DevTools
1. Abre DevTools (F12)
2. Ve a **Application** → **Manifest**
3. Verifica que el manifest.json se cargue correctamente
4. Ve a **Service Workers** y verifica que esté registrado
5. Usa **Lighthouse** (Audits) para comprobar el score de PWA

---

## 🔧 Configuración Opcional Recomendada

### Agregar Splash Screen (opcional)
En el `manifest.json` puedes agregar una pantalla de carga personalizada.

### Mejorar el Cacheo
Edita `ngsw-config.json` para optimizar qué archivos se cachean y cómo.

### Instalar sin Prompt (opcional)
Personaliza cómo se ofrece la instalación de la app en `app.component.ts`.

---

## 📱 Cómo Probar la PWA

### En Chrome:
1. Abre la app en Chrome
2. Haz clic en el icono de instalación (esquina superior derecha) o dirígete a **Menú** → **Instalar app**
3. Confirma la instalación

### En Safari (iOS):
1. Abre la app en Safari
2. Toca el botón **Compartir**
3. Selecciona **Agregar a la pantalla de inicio**
4. Confirma

### Modo Offline:
- Abre DevTools → **Application** → **Service Workers**
- Marca **Offline**
- La app debería seguir funcionando con los recursos en caché

---

## ✨ Características PWA Habilitadas

✅ Installable en dispositivos  
✅ Funciona offline (con resources en caché)  
✅ Actualización automática disponible  
✅ Splash screen personalizado  
✅ Iconos adaptativos  
✅ Standalone mode (sin barra del navegador)  

---

## 📚 Recursos Adicionales

- [Angular Service Worker Guide](https://angular.io/guide/service-worker-intro)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Ionic PWA Guide](https://ionicframework.com/docs/angular/pwa)

---

## ⚠️ Notas Importantes

1. **HTTPS es obligatorio** en producción (excepto localhost)
2. Los iconos deben estar en formato PNG
3. El manifest.json debe ser servido con `Content-Type: application/json`
4. Prueba en diferentes navegadores y dispositivos
5. Mantén el versionado de assets para actualizaciones correctas

---

¡Tu PWA está lista para ser completada! 🚀
