Add-Type -AssemblyName System.Drawing

$f192 = "C:\Users\ADMIN\Desktop\Recorrido UTT\Recorrido_UTT\www\assets\icon\icon-192x192.png"
$f512 = "C:\Users\ADMIN\Desktop\Recorrido UTT\Recorrido_UTT\www\assets\icon\icon-512x512.png"

Write-Host "Verificando iconos en www/assets/icon/..."

if (Test-Path $f192) {
    $img = [System.Drawing.Image]::FromFile($f192)
    Write-Host "✓ icon-192x192.png -> $($img.Width)x$($img.Height)"
    $img.Dispose()
} else {
    Write-Host "✗ icon-192x192.png NOT FOUND"
}

if (Test-Path $f512) {
    $img = [System.Drawing.Image]::FromFile($f512)
    Write-Host "✓ icon-512x512.png -> $($img.Width)x$($img.Height)"
    $img.Dispose()
} else {
    Write-Host "✗ icon-512x512.png NOT FOUND"
}
