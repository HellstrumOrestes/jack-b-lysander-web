---
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const caps = (await getCollection('capitulos', (c) => !c.data.proximo))
    .sort((a, b) => b.data.numero - a.data.numero);
  const obras = await getCollection('obras');
  const obraTitle = (slug) => obras.find((o) => o.slug === slug)?.data.titulo ?? '';

  return rss({
    title: 'Jack B. Lysander',
    description: 'Ficción serializada en español. Capítulos publicados sin prisa.',
    site: context.site,
    items: caps.map((c) => ({
      title: `${obraTitle(c.data.obra)} — ${c.data.titulo}`,
      pubDate: new Date(c.data.fecha),
      description: c.data.sinopsis,
      link: `/obras/${c.data.obra}/${c.slug.split('/').pop()}/`,
    })),
  });
}
