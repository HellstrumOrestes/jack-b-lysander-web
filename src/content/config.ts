import { defineCollection, z } from 'astro:content';

const obras = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    sinopsis_corta: z.string(),
    sinopsis_larga: z.array(z.string()).optional(),
    genero: z.string(),
    estado: z.enum(['En publicación', 'Próximamente', 'Borrador', 'Concluida']),
    fecha_inicio: z.string().optional(),
    capitulos_publicados: z.number().default(0),
    orden: z.number().default(0),
    lomo: z.object({
      color: z.string(),
      accent: z.string(),
      alto: z.number().default(0.95),
    }),
  }),
});

const capitulos = defineCollection({
  type: 'content',
  schema: z.object({
    obra: z.string(),               // slug de la obra
    numero: z.number(),
    titulo: z.string(),
    fecha: z.string(),
    sinopsis: z.string(),
    minutos: z.number().default(5),
    proximo: z.boolean().default(false),
  }),
});

const glosario = defineCollection({
  type: 'data',
  schema: z.object({
    termino: z.string(),
    descripcion_corta: z.string(),
  }),
});

export const collections = { obras, capitulos, glosario };
