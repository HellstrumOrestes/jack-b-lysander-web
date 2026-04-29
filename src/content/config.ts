// Definición de las colecciones de contenido (obras y capítulos)
// con validación de frontmatter mediante Zod. Si un archivo tiene un
// frontmatter inválido, el build falla indicando archivo y campo.

import { defineCollection, z } from 'astro:content';

const obras = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    sinopsis_corta: z.string(),
    sinopsis_larga: z.string(),
    genero: z.string().optional(),
    estado: z.enum(['En publicación', 'Completa', 'En pausa']),
    fecha_inicio: z.date(),
    imagen_portada: z.string().optional(),
    orden: z.number().optional(),
  }),
});

const capitulos = defineCollection({
  type: 'content',
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
