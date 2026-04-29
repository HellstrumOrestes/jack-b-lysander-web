// Definición de las colecciones de contenido (obras, capítulos, glosario)
// con validación de frontmatter mediante Zod. Si un archivo tiene un
// frontmatter inválido, el build falla indicando archivo y campo.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const obras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/obras' }),
  schema: z.object({
    titulo: z.string(),
    sinopsis_corta: z.string(),
    // sinopsis_larga puede ser un string o un array de párrafos.
    // Si no se proporciona, se usa sinopsis_corta como fallback.
    sinopsis_larga: z.union([z.string(), z.array(z.string())]).optional(),
    genero: z.string().optional(),
    estado: z.enum([
      'En publicación',
      'Próximamente',
      'En pausa',
      'Borrador',
      'Concluida',
    ]),
    fecha_inicio: z.date().optional(),
    capitulos_publicados: z.number().int().nonnegative().default(0),
    orden: z.number().optional(),
    // Lomo decorativo para la estantería de la home
    lomo: z
      .object({
        color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'lomo.color debe ser hex #RRGGBB'),
        accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'lomo.accent debe ser hex #RRGGBB'),
        alto: z.number().min(0.4).max(1).default(0.95),
      })
      .optional(),
    // Imagen Open Graph de la obra (opcional, ruta /imagen.jpg o https://...)
    imagen_portada: z
      .string()
      .regex(/^(\/|https:\/\/)/, 'imagen_portada debe empezar por "/" o "https://"')
      .optional(),
  }),
});

const capitulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/capitulos' }),
  schema: z.object({
    titulo: z.string(),
    numero: z.number().int().positive(),
    obra: z.string(),
    fecha: z.date(),
    sinopsis: z.string().optional(),
    minutos: z.number().int().positive().default(5),
    // Si true, el capítulo aparece en el índice como "Próximamente" pero
    // no se genera su página.
    proximo: z.boolean().default(false),
    // Si true, se ignora completamente (no se publica ni aparece).
    borrador: z.boolean().default(false),
  }),
});

// Glosario por obra. Cada término vive en
//   src/content/glosario/<obra-slug>/<termino-slug>.md
// El frontmatter declara cómo se muestra y la descripción que aparece
// en el tooltip al hover; el cuerpo es la descripción larga.
const glosario = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glosario' }),
  schema: z.object({
    termino: z.string(),
    obra: z.string(),
    descripcion_corta: z
      .string()
      .max(200, 'descripcion_corta no puede exceder 200 caracteres (cabe en un tooltip)'),
  }),
});

export const collections = { obras, capitulos, glosario };
