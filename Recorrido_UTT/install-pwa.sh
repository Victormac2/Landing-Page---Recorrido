#!/bin/bash
# Script para completar la instalación de PWA

echo "🚀 Instalando dependencias de PWA..."

# Instalar @angular/service-worker
npm install @angular/service-worker

echo "✅ Instalación completada!"
echo ""
echo "📋 Siguientes pasos:"
echo "1. Genera los iconos PWA en src/assets/icon/"
echo "2. Ejecuta: npm run build (para producción)"
echo "3. Verifica en Chrome DevTools → Application → Manifest"
echo ""
echo "Para más información, consulta PWA_SETUP.md"
