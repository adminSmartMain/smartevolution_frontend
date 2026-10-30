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
La prueba actual no envía credenciales: verifica que la página de login y sus
controles críticos se puedan servir correctamente.
