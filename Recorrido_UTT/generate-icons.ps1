Add-Type -AssemblyName System.Drawing

$src = "C:\Users\ADMIN\Desktop\Recorrido UTT\Recorrido_UTT\www\assets\icon\favicon.png"
$dst192 = "C:\Users\ADMIN\Desktop\Recorrido UTT\Recorrido_UTT\www\assets\icon\icon-192x192.png"
$dst512 = "C:\Users\ADMIN\Desktop\Recorrido UTT\Recorrido_UTT\www\assets\icon\icon-512x512.png"

if (-not (Test-Path $src)) {
    Write-Host "❌ No se encontró el archivo favicon.png en: $src"
    exit 1
}

$img = [System.Drawing.Image]::FromFile($src)

function ResizeImage([System.Drawing.Image] $image, [int] $w, [int] $h, [string] $out) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($image, 0, 0, $w, $h)

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/png" }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, 100)

    $bmp.Save($out, $codec, $encParams)
    $g.Dispose()
    $bmp.Dispose()
}

ResizeImage $img 192 192 $dst192
ResizeImage $img 512 512 $dst512
$img.Dispose()

$i192 = [System.Drawing.Image]::FromFile($dst192)
$i512 = [System.Drawing.Image]::FromFile($dst512)
Write-Host "✅ icon-192 -> $($i192.Width)x$($i192.Height)"
Write-Host "✅ icon-512 -> $($i512.Width)x$($i512.Height)"
$i192.Dispose()
$i512.Dispose()
