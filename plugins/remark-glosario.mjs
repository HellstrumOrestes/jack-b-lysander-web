// Plugin Remark: expande la sintaxis abreviada {término:slug} en cuerpos
// de capítulo a un enlace Markdown estándar al glosario de la obra.
//
// Ejemplo:
//   {Samantha:samantha} → [Samantha](/obras/<obra-slug>/glosario/samantha/)
//
// El obra-slug se deduce del path del archivo en build time:
//   src/content/capitulos/<obra-slug>/<numero>-<titulo>.md
//
// Si el archivo no está dentro de capitulos/<obra>/, se deja la sintaxis
// como texto plano. El plugin Rehype rehype-glosario.mjs es el que luego
// enriquece esos enlaces con el atributo data-tooltip.

import { visit } from 'unist-util-visit';

// Match de {texto:slug}. El "slug" admite letras, dígitos, guiones y
// puntos. El "texto" no admite "{" ni "}" para evitar escapes con anidados.
const TOKEN = /\{([^{}]+?):([a-zA-Z0-9._-]+)\}/g;

function obraFromVfilePath(path) {
  if (!path) return null;
  // Normalizar separadores Windows
  const norm = path.replace(/\\/g, '/');
  const m = norm.match(/\/src\/content\/capitulos\/([^/]+)\//);
  return m ? m[1] : null;
}

export default function remarkGlosario() {
  return (tree, file) => {
    const obraSlug = obraFromVfilePath(file?.path ?? file?.history?.[0]);
    if (!obraSlug) return;

    visit(tree, 'text', (node, index, parent) => {
      const value = node.value;
      if (!value || !value.includes('{')) return;

      // Recorrer todas las apariciones del token y construir nuevos hijos
      let lastIndex = 0;
      const newChildren = [];
      let match;
      TOKEN.lastIndex = 0;
      while ((match = TOKEN.exec(value)) !== null) {
        const [full, texto, slug] = match;
        const start = match.index;
        if (start > lastIndex) {
          newChildren.push({ type: 'text', value: value.slice(lastIndex, start) });
        }
        newChildren.push({
          type: 'link',
          url: `/obras/${obraSlug}/glosario/${slug}/`,
          title: null,
          children: [{ type: 'text', value: texto }],
        });
        lastIndex = start + full.length;
      }
      if (lastIndex === 0) return; // sin matches

      if (lastIndex < value.length) {
        newChildren.push({ type: 'text', value: value.slice(lastIndex) });
      }

      // Reemplazar el nodo de texto por la lista de nodos
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...newChildren);
        return [visit.SKIP, index + newChildren.length];
      }
    });
  };
}
