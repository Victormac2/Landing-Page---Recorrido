#!/usr/bin/env pwsh
# Script para servir la PWA en el teléfono

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sirviendo PWA en http-server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar a la carpeta www
Set-Location www

# Obtener la IP local
$ipConfig = ipconfig /all
$ipMatches = $ipConfig | Select-String -Pattern "IPv4 Address.*?(\d+\.\d+\.\d+\.\d+)"

$ips = @()
foreach ($match in $ipMatches) {
    if ($match.Matches.Groups[1].Value -notmatch "^127\.|^169\.") {
        $ips += $match.Matches.Groups[1].Value
    }
}

if ($ips.Count -gt 0) {
    $ip = $ips[0]
    Write-Host "Tu dirección IP local es: " -ForegroundColor Yellow -NoNewline
    Write-Host "$ip" -ForegroundColor Green
    Write-Host ""
    Write-Host "Accede desde tu teléfono a:" -ForegroundColor Yellow
    Write-Host "http://$ip`:8080" -ForegroundColor Green -Bold
} else {
    Write-Host "No se pudo detectar la IP. Usa 'ipconfig' para encontrarla manualmente." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar el servidor
http-server -p 8080 -a 0.0.0.0 -c-1
