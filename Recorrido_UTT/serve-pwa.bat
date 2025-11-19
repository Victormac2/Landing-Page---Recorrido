@echo off
REM Script para servir la PWA en http-server

echo.
echo ========================================
echo  Sirviendo PWA en http-server
echo ========================================
echo.

cd www

REM Obtener la IP local
for /f "tokens=2 delims=: " %%A in ('ipconfig /all ^| findstr IPv4') do (
    set IP=%%A
)

echo Accede desde tu telefono a:
echo http://%IP%:8080
echo.
echo Para obtener tu IP, ejecuta: ipconfig /all
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

http-server -p 8080 -a 0.0.0.0 -c-1
