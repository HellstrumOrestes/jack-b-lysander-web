// Plugin Rehype: enriquece enlaces que apuntan a páginas del glosario
// con un atributo data-tooltip y la clase glosario-link, para que el CSS
// puro pinte un tooltip con la descripción corta al hover. En móvil,
// GlosarioPin.astro intercepta el click y muestra un panel con la misma
// info + botón a la página completa.
//
// Detecta enlaces cuyo href tiene la forma:
//   /obras/<obra-slug>/glosario/<termino-slug>/
// y busca la `descripcion_corta` en el frontmatter del archivo
// correspondiente en src/content/glosario/<obra>/<termino>.md

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { visit } from 'unist-util-visit';

const GLOSARIO_DIR = fileURLToPath(
  new URL('../src/content/glosario/', import.meta.url),
);

let cachedMap = null;

function loadGlosarioMap() {
  if (cachedMap) return cachedMap;
  const map = new Map();

  let obras;
  try {
    obras = readdirSync(GLOSARIO_DIR);
  } catch {
    cachedMap = map;
    return map;
  }

  for (const obraSlug of obras) {
    const obraDir = join(GLOSARIO_DIR, obraSlug);
    let stats;
    try {
      stats = statSync(obraDir);
    } catch {
      continue;
    }
    if (!stats.isDirectory()) continue;

    const files = readdirSync(obraDir);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const terminoSlug = file.replace(/\.md$/, '');
      const fullPath = join(obraDir, file);
      const contents = readFileSync(fullPath, 'utf-8');

      const m = contents.match(
        /^descripcion_corta:\s*(?:"([^"]+)"|'([^']+)'|(.+?))\s*$/m,
      );
      if (!m) continue;
      const desc = (m[1] ?? m[2] ?? m[3] ?? '').trim();
      if (!desc) continue;

      const url = `/obras/${obraSlug}/glosario/${terminoSlug}/`;
      map.set(url, desc);
    }
  }

  cachedMap = map;
  return map;
}

export default function rehypeGlosario() {
  return (tree) => {
    const map = loadGlosarioMap();
    if (map.size === 0) return;

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string') return;

      const desc = map.get(href);
      if (!desc) return;

      const existing = node.properties.className;
      const classes = Array.isArray(existing)
        ? [...existing, 'glosario-link']
        : existing
          ? [existing, 'glosario-link']
          : ['glosario-link'];
      node.properties.className = classes;
      node.properties['data-tooltip'] = desc;
    });
  };
}
