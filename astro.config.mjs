import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Cambia site cuando despliegues (p. ej. https://jacklysander.com)
export default defineConfig({
  site: 'https://jacklysander.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    smartypants: true,
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
