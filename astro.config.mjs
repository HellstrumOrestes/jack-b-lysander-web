import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkGlosario from './plugins/remark-glosario.mjs';
import rehypeGlosario from './plugins/rehype-glosario.mjs';

// El sitio se sirve desde dominio personalizado (CNAME en public/),
// por eso `site` apunta a https://jackblysander.com.
export default defineConfig({
  site: 'https://jackblysander.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    smartypants: true,
    remarkPlugins: [remarkGlosario],
    rehypePlugins: [rehypeGlosario],
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/rss.xml') && !page.includes('/llms.txt'),
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES' },
      },
    }),
  ],
});
