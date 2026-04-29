// Utilidades compartidas

export function toRoman(n: number): string {
  const map: [string, number][] = [
    ['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],
    ['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1],
  ];
  let out = '', x = n;
  for (const [s, v] of map) { while (x >= v) { out += s; x -= v; } }
  return out;
}

export function estadoSlug(estado: string): string {
  return estado.toLowerCase().replace(/\s/g, '-');
}

/**
 * Parsea un texto con marcadores `{texto:slug}` y devuelve fragmentos
 * para renderizar enlaces de glosario.
 */
export type GlossPart = { kind: 'text'; value: string } | { kind: 'gloss'; text: string; slug: string };

export function parseGloss(text: string): GlossPart[] {
  const parts: GlossPart[] = [];
  const re = /\{([^:}]+):([^}]+)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ kind: 'text', value: text.slice(last, m.index) });
    parts.push({ kind: 'gloss', text: m[1], slug: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', value: text.slice(last) });
  return parts;
}
