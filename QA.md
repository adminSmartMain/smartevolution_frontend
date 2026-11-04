# Pruebas locales

Instalar las dependencias y el navegador de Playwright una sola vez:

```bash
npm ci
npx playwright install chromium
```

Construir y ejecutar el smoke test del inicio de sesión:

```bash
set NEXT_PUBLIC_API_URL=/api
npm run build
npm run test:e2e
```

En PowerShell, usar `$env:NEXT_PUBLIC_API_URL = '/api'` en lugar de `set`.
Si ya tienes una aplicación corriendo en el puerto 3000, usa un servidor de
pruebas aislado para no reutilizar una compilación anterior:

```powershell
$env:PLAYWRIGHT_PORT = '3100'
npm run build
npm run test:e2e
Remove-Item Env:PLAYWRIGHT_PORT
```

Las pruebas usan respuestas HTTP simuladas para los flujos de autenticación;
no envían contraseñas ni escriben en la base de datos. Cubren login, errores de
credenciales, recuperación/restablecimiento de contraseña, protección de rutas,
permisos de facturas y el filtro XML del cargador de extracción.
