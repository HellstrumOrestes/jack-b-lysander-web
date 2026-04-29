// Feed RSS con todos los capítulos publicados, descendente por fecha.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const obras = await getCollection('obras');
  const obrasMap = new Map(obras.map((o) => [o.data.slug, o.data.titulo]));

  const capitulos = (await getCollection('capitulos', (c) => c.data.borrador !== true))
    .sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime());

  return rss({
    title: 'Jack B. Lysander',
    description: 'Ficción serializada en español. Aviso de cada nuevo capítulo.',
    site: context.site!,
    language: 'es-ES',
    items: capitulos.map((cap) => {
      const obraTitulo = obrasMap.get(cap.data.obra) ?? cap.data.obra;
      const capSlug = cap.slug.split('/').pop();
      const num = String(cap.data.numero).padStart(2, '0');
      return {
        title: `${obraTitulo} — Capítulo ${num}: ${cap.data.titulo}`,
        link: `/obras/${cap.data.obra}/${capSlug}/`,
        pubDate: cap.data.fecha,
        description: cap.data.sinopsis ?? '',
      };
    }),
  });
}
