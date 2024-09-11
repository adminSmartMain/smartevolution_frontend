Proyecto FRONTEND en Next.js - Nombre del Proyecto

Este repositorio contiene un proyecto desarrollado en Next.js.
Instalación y Ejecución
Instalación usando NVM y Docker

Asegúrate de tener Docker y NVM (Node Version Manager) instalados en tu sistema.
Paso 1: Clonar el Repositorio

bash

git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_DIRECTORIO>

Paso 2: Instalar Node.js 18.17 usando NVM

Si aún no tienes Node.js 18.17 instalado, puedes usar NVM para instalarlo:
nvm install 18.17
nvm use 18.17

Paso 3: Instalar Dependencias
npm install

Paso 4: Ejecutar en Desarrollo
Para ejecutar la aplicación en modo de desarrollo:
npm run dev

La aplicación estará disponible en http://localhost:3000.

Ejecución usando Docker

Paso 1: Construir y Ejecutar el Contenedor
# Construir la imagen del contenedor
sudo docker compose up --build -d

Esto construirá la imagen del contenedor y comenzará a ejecutar la aplicación en el puerto 3000. Puedes acceder a la aplicación en http://localhost:3000.

Detener y Eliminar Contenedores

Para detener y eliminar el contenedor Docker:
# Obtener el ID del contenedor en ejecución
docker ps

# Detener el contenedor
docker stop <CONTAINER_ID>

# Eliminar el contenedor
docker rm <CONTAINER_ID>

Este README.md proporciona una guía básica para la instalación y ejecución del proyecto Next.js, utilizando Node.js 18.17 instalado mediante NVM y ejecutándose tanto en desarrollo local como en Docker. Asegúrate de personalizarlo según las necesidades específicas de tu proyecto, como las configuraciones adicionales de Docker, variables de entorno, etc.
