# Guía: Ejecutar PWA en Teléfono

## ⚠️ Problema Común
Si la app no carga en el teléfono, es probable que sea por uno de estos motivos:

1. **No usas HTTPS** - Las PWAs requieren HTTPS (excepción: localhost)
2. **El teléfono y PC no están en la misma red**
3. **El firewall bloquea la conexión**
4. **El manifest.json no se encuentra**

---

## 🔧 Solución 1: Servidor Local en desarrollo (Recomendado para pruebas)

### Opción A: Con Angular CLI (más fácil)

```powershell
# Compilar en modo desarrollo
ng serve --host 0.0.0.0 --port 4200

# Luego accede desde el teléfono a: http://<IP_DE_TU_PC>:4200
```

Obtén tu IP local:
```powershell
ipconfig /all
# Busca la sección "Ethernet adapter" o "Wireless LAN adapter"
# Anota la dirección IPv4 (ejemplo: 192.168.1.100)
```

**En el teléfono:**
- Abre Chrome/Safari
- Ve a: `http://192.168.1.100:4200` (reemplaza con tu IP)

⚠️ **Nota:** Sin HTTPS, la PWA no se instalará completamente, pero la app funcionará offline una vez cargada.

---

### Opción B: Con http-server (solo para vista)

```powershell
cd www
http-server -p 8080 -a 0.0.0.0 -c-1
```

Accede desde el teléfono a: `http://<TU_IP>:8080`

---

## 🔐 Solución 2: HTTPS con Certificados Locales (Mejor para PWA)

### Paso 1: Generar certificados SSL autofirmados

```powershell
# En PowerShell como Administrador, ejecuta:
$cert = New-SelfSignedCertificate -CertStoreLocation cert:\CurrentUser\My -DnsName "localhost,127.0.0.1" -NotAfter (Get-Date).AddYears(1)
Export-PfxCertificate -Cert $cert -FilePath "cert.pfx" -Password (ConvertTo-SecureString "password123" -AsPlainText -Force)
Export-Certificate -Cert $cert -FilePath "cert.cer"
```

### Paso 2: Confiar en el certificado en Windows

```powershell
# Importar certificado
Import-Certificate -FilePath "cert.cer" -CertStoreLocation "Cert:\LocalMachine\Root"
```

### Paso 3: Servir con HTTPS

Instala un servidor HTTPS:
```powershell
npm install -g local-web-server
```

Luego crea un archivo `ws.json` en la raíz del proyecto:

```json
{
  "port": 8443,
  "https": true,
  "spa": "index.html"
}
```

Ejecuta:
```powershell
cd www
ws --config-file ../ws.json
```

**En el teléfono:** `https://<TU_IP>:8443`

---

## 📱 En el Teléfono Android

1. Abre Chrome
2. Ve a tu URL: `http://<TU_IP>:4200` (o la que uses)
3. Si funciona, verás el menú de "Instalar app" en la barra superior
4. Toca en él y confirma

---

## 📱 En el Teléfono iOS

1. Abre Safari
2. Ve a tu URL
3. Toca el botón **Compartir**
4. Toca **Agregar a pantalla de inicio**
5. Dale un nombre y confirma

---

## 🔍 Verificar que la PWA está funcional

En Chrome DevTools del teléfono (o en tu PC):

1. Abre DevTools (F12)
2. Ve a **Application** → **Manifest**
   - ✅ Debe mostrar el contenido de `manifest.json`
3. Ve a **Service Workers**
   - ✅ Debe estar "activated and running"
4. Ve a **Storage** → **Cache Storage**
   - ✅ Debe haber caches de la app

---

## ❌ Si Aún No Funciona

### Verificar el manifest.json

```powershell
# En la carpeta www/
cat manifest.json
```

Debe contener:
```json
{
  "name": "Recorrido UTT",
  "short_name": "Recorrido",
  "start_url": "/",
  "display": "standalone",
  ...
}
```

### Ver logs de errores

```powershell
# Mientras el servidor está corriendo, abre DevTools en la app
# Console (Consola) debería mostrar si hay errores
```

---

## 🚀 Resumen Rápido (Lo Más Fácil)

```powershell
# 1. Compila el proyecto
npm run build

# 2. Sirve desde www
cd www
http-server -p 8080 -a 0.0.0.0 -c-1

# 3. En tu teléfono, accede a:
# http://<TU_IP>:8080

# 4. Prueba que funciona
# Si los archivos cargan → PWA lista
```

---

¿Necesitas ayuda con alguno de estos pasos? Avísame cuál es el error específico que ves en el teléfono. 📱
