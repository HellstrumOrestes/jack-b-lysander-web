// Endpoint llms.txt — descripción del sitio para LLMs siguiendo la
// convención de https://llmstxt.org. Se regenera en cada build con
// las obras y capítulos publicados.

import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');

  const obras = (await getCollection('obras')).sort((a, b) => {
    const oa = a.data.orden ?? 999;
    const ob = b.data.orden ?? 999;
    if (oa !== ob) return oa - ob;
    const fa = a.data.fecha_inicio?.getTime() ?? 0;
    const fb = b.data.fecha_inicio?.getTime() ?? 0;
    return fb - fa;
  });

  const capitulos = (
    await getCollection(
      'capitulos',
      (c) => c.data.borrador !== true && c.data.proximo !== true,
    )
  ).sort((a, b) => a.data.numero - b.data.numero);

  const capsPorObra = new Map<string, typeof capitulos>();
  for (const c of capitulos) {
    const arr = capsPorObra.get(c.data.obra) ?? [];
    arr.push(c);
    capsPorObra.set(c.data.obra, arr);
  }

  const lines: string[] = [];
  lines.push('# Jack B. Lysander');
  lines.push('');
  lines.push(
    '> Ficción serializada en español por Jack B. Lysander (pseudónimo literario). Las obras se publican capítulo a capítulo en este sitio. Idioma del contenido: español de España.',
  );
  lines.push('');
  lines.push('## Sobre el autor');
  lines.push('');
  lines.push(`- [Sobre mí](${site}/sobre/): Biografía y contexto del autor.`);
  lines.push('');
  lines.push('## Obras');
  lines.push('');

  for (const obra of obras) {
    const obraUrl = `${site}/obras/${obra.id}/`;
    lines.push(`### ${obra.data.titulo}`);
    lines.push('');
    lines.push(
      `- Estado: ${obra.data.estado}` +
        (obra.data.genero ? ` · Género: ${obra.data.genero}` : ''),
    );
    lines.push(`- Página de la obra: ${obraUrl}`);
    lines.push(`- Sinopsis: ${obra.data.sinopsis_corta}`);
    lines.push('');

    const caps = capsPorObra.get(obra.id) ?? [];
    if (caps.length > 0) {
      lines.push('Capítulos publicados:');
      lines.push('');
      for (const cap of caps) {
        const capSlug = cap.id.split('/').pop();
        const num = String(cap.data.numero).padStart(2, '0');
        lines.push(
          `- [Capítulo ${num}: ${cap.data.titulo}](${site}/obras/${obra.id}/${capSlug}/)`,
        );
      }
      lines.push('');
    }
  }

  lines.push('## Recursos');
  lines.push('');
  lines.push(`- [Feed RSS](${site}/rss.xml): suscripción a nuevos capítulos.`);
  lines.push(`- [Sitemap](${site}/sitemap-index.xml): índice de todas las páginas.`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
