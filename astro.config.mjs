import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Configuración de Astro para jackblysander.com
// El sitio se sirve desde dominio personalizado (CNAME en public/),
// por eso `site` apunta directamente a https://jackblysander.com.
export default defineConfig({
  site: 'https://jackblysander.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      // El feed RSS y llms.txt no son páginas HTML; los excluimos
      // del sitemap para que solo contenga rutas navegables.
      filter: (page) =>
        !page.includes('/rss.xml') && !page.includes('/llms.txt'),
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES' },
      },
    }),
  ],
});
