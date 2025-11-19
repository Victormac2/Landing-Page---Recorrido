Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ADMIN\Desktop\Recorrido UTT\Recorrido_UTT\src\assets\icon\favicon.png"
$dst192 = "C:\Users\ADMIN\Desktop\Recorrido UTT\Recorrido_UTT\src\assets\icon\icon-192x192.png"
$dst512 = "C:\Users\ADMIN\Desktop\Recorrido UTT\Recorrido_UTT\src\assets\icon\icon-512x512.png"

$original = [System.Drawing.Image]::FromFile($srcPath)

$bmp192 = New-Object System.Drawing.Bitmap(192, 192)
$g192 = [System.Drawing.Graphics]::FromImage($bmp192)
$g192.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g192.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g192.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g192.DrawImage($original, 0, 0, 192, 192)
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/png' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 95)
$bmp192.Save($dst192, $codec, $encParams)
$g192.Dispose()
$bmp192.Dispose()

$bmp512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($bmp512)
$g512.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g512.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g512.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g512.DrawImage($original, 0, 0, 512, 512)
$bmp512.Save($dst512, $codec, $encParams)
$g512.Dispose()
$bmp512.Dispose()

$original.Dispose()

Write-Host "Done"
