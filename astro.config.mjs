import { defineConfig } from 'astro/config';

// Configuración de Astro para jackblysander.com
// El sitio se sirve desde dominio personalizado (CNAME en public/),
// por eso `site` apunta directamente a https://jackblysander.com.
export default defineConfig({
  site: 'https://jackblysander.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
