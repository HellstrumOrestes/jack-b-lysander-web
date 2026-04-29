// Plugin Rehype: enriquece los enlaces que apuntan a páginas del glosario
// con un atributo data-tooltip y la clase glosario-link, para que el CSS
// puro pinte un tooltip con la descripción corta al pasar el ratón.
//
// Detecta enlaces cuyo href tiene la forma:
//   /obras/<obra-slug>/glosario/<termino-slug>/
// y los enriquece con la descripcion_corta declarada en el frontmatter
// del archivo correspondiente en src/content/glosario/<obra>/<termino>.md
//
// El tooltip funciona solo en desktop (CSS :hover). En móvil/tablet, el
// tap sigue navegando a la página completa del término.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { visit } from 'unist-util-visit';

const GLOSARIO_DIR = fileURLToPath(
  new URL('../src/content/glosario/', import.meta.url),
);

// Cache: el mapa solo se construye una vez por proceso de build.
let cachedMap = null;

function loadGlosarioMap() {
  if (cachedMap) return cachedMap;
  const map = new Map();

  let obras;
  try {
    obras = readdirSync(GLOSARIO_DIR);
  } catch {
    // Si la carpeta no existe (p. ej. proyecto sin glosario), no hay nada que hacer.
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

      // Extraer descripcion_corta del frontmatter. Aceptamos comillas dobles,
      // simples o sin comillas (formato YAML inline simple).
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

      // Añadir clase 'glosario-link' sin pisar las que ya tuviera.
      const existing = node.properties.className;
      const classes = Array.isArray(existing)
        ? [...existing, 'glosario-link']
        : existing
          ? [existing, 'glosario-link']
          : ['glosario-link'];
      node.properties.className = classes;

      // El tooltip se pinta vía CSS leyendo data-tooltip.
      node.properties['data-tooltip'] = desc;
    });
  };
}
