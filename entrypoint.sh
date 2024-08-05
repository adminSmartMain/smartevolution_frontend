#!/bin/sh
echo "Instalando Librerias..."
npm i
echo "Compilando..."
npm run build
echo "Starting Next server..."
exec npm run start
