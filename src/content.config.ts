// Definición de las colecciones de contenido (obras y capítulos)
// con validación de frontmatter mediante Zod. Si un archivo tiene un
// frontmatter inválido, el build falla indicando archivo y campo.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const obras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/obras' }),
  schema: z.object({
    titulo: z.string(),
    sinopsis_corta: z.string(),
    sinopsis_larga: z.string(),
    genero: z.string().optional(),
    estado: z.enum(['En publicación', 'Completa', 'En pausa']),
    fecha_inicio: z.date(),
    // Permitimos rutas absolutas locales (/imagen.jpg) o URLs https.
    // Esto evita que un valor accidental se cuele como atributo src.
    imagen_portada: z
      .string()
      .regex(/^(\/|https:\/\/)/, 'imagen_portada debe empezar por "/" o "https://"')
      .optional(),
    orden: z.number().optional(),
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
    borrador: z.boolean().default(false),
  }),
});

export const collections = { obras, capitulos };
