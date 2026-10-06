# App Películas - Ionic Vue Mobile Client

Este es el cliente móvil construido con Ionic Vue para el Taller #2, que consume la API de NestJS del Taller #1.

## Requisitos Previos

- Node.js (v18+)
- Ionic CLI (\`npm install -g @ionic/cli\`)
- Backend NestJS corriendo en \`http://localhost:3000\`

## Configuración y Ejecución

1. **Instalar dependencias:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Ejecutar en el navegador:**
   \`\`\`bash
   ionic serve
   \`\`\`
   Esto levantará el servidor de desarrollo de Vite (normalmente en \`http://localhost:8100\`).

3. **Ejecutar en Android (Opcional - Plus):**
   Para ejecutar la aplicación en Android, asegúrate de tener Android Studio instalado y configurado.
   \`\`\`bash
   # Compilar el proyecto web
   npm run build
   
   # Sincronizar con Capacitor
   npx cap sync android
   
   # Abrir en Android Studio
   npx cap open android
   \`\`\`

## Características Implementadas

- **Navegación:** Configuración de Ionic Vue Router con \`ion-page\`, \`ion-header\`, y \`ion-content\`.
- **Autenticación (JWT):** Vistas de login y registro. El token JWT se almacena de forma segura usando \`@capacitor/preferences\` y se envía automáticamente en cada petición mediante un interceptor de Axios.
- **CRUD de Películas:**
  - Búsqueda por nombre usando \`ion-searchbar\`.
  - Paginación (scroll infinito) usando \`ion-infinite-scroll\`.
  - Modales para creación y edición (\`ion-modal\`).
  - Alerta de confirmación para eliminar (\`ion-alert\`).
- **Plataforma Nativa:** Proyecto configurado con Capacitor y la plataforma Android añadida.

## Notas

- La configuración de la API base está en \`src/services/api.ts\`. Asegúrate de que apunte a la URL correcta si tu backend de NestJS está corriendo en un host o puerto distinto (por defecto \`http://localhost:3000\`).
- En caso de errores de CORS, asegúrate de que el backend de NestJS tenga CORS habilitado en \`main.ts\`.
