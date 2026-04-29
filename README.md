# Jack B. Lysander — sitio de autor

Sitio personal para publicar ficción serializada en español. Construido con [Astro](https://astro.build) y contenido en Markdown.

## Stack

- **Astro 4** (SSG estático, sin JS de framework en runtime)
- **Content collections** para `obras`, `capitulos`, `glosario`
- CSS plano con tokens y modo claro/oscuro vía `data-theme`
- Tipografía Fraunces + EB Garamond + Inter (Google Fonts)

## Estructura

```
src/
  layouts/
    BaseLayout.astro      Layout común: <head>, fuentes, header, footer, no-flash
  components/
    Header.astro          Marca + nav + toggle de tema
    Footer.astro
    Fleuron.astro         Ornamento SVG (3 losanges)
    Bookshelf.astro       Estantería interactiva con lomos
    NewsletterCard.astro  Tarjeta-formulario de suscripción
    ReadingProgress.astro Barra fija de progreso de lectura
    GlosarioPin.astro     Panel inferior tras click en término
    ProseParagraph.astro  Párrafo con marcadores {término:slug}
  content/
    config.ts             Schemas zod de las colecciones
    obras/                Una obra por archivo .md (frontmatter)
    capitulos/<obra>/     Capítulos en .md, agrupados por obra
    glosario/             Términos como .json
  pages/
    index.astro           Home con hero + estantería + newsletter
    sobre.astro
    newsletter.astro
    obras/[slug]/index.astro          Página de obra
    obras/[slug]/[capitulo].astro     Página de capítulo (la lectura)
    rss.xml.js                        Feed RSS
  styles/
    global.css            Tokens, paletas, modo oscuro, todos los componentes
  lib/
    utils.ts              toRoman, parseGloss, etc.
public/
  favicon.svg
```

## Desarrollo local

Requiere Node 18+ (recomendado: 20).

```bash
cd astro
npm install
npm run dev
```

Abre http://localhost:4321.

## Build

```bash
npm run build      # genera dist/ estático
npm run preview    # sirve el build localmente
```

## Añadir contenido

### Una obra nueva

Crea `src/content/obras/mi-obra.md`:

```yaml
---
titulo: Mi obra
sinopsis_corta: Una frase gancho.
sinopsis_larga:
  - "Primer párrafo de sinopsis larga."
  - "Segundo párrafo."
genero: Novela
estado: En publicación   # o "Próximamente", "Borrador", "Concluida"
fecha_inicio: 1 ene 2026
capitulos_publicados: 0
orden: 4                 # posición en la estantería (menor = más a la izquierda)
lomo:
  color: "#2a3340"       # color del lomo
  accent: "#c9a961"      # bandas decorativas
  alto: 0.95             # 0..1 (relativo a la balda)
---
```

### Un capítulo nuevo

Crea `src/content/capitulos/mi-obra/01-titulo-del-capitulo.md`:

```yaml
---
obra: mi-obra            # slug de la obra
numero: 1
titulo: Título del capítulo
fecha: 1 ene 2026
sinopsis: Frase corta para el índice.
minutos: 6               # tiempo estimado de lectura
proximo: false           # true = aparece como "Próximamente"
---

Tu prosa aquí. Los párrafos se separan con líneas en blanco.

Para enlazar un término del glosario usa `{texto:slug}`. Ejemplo:
{Samantha:samantha} la dejó sobre la mesa.
```

### Un término de glosario

Crea `src/content/glosario/mi-termino.json`:

```json
{
  "termino": "Mi término",
  "descripcion_corta": "Descripción que aparece en tooltip y panel."
}
```

Luego úsalo en cualquier capítulo con `{texto visible:mi-termino}`.

## Personalización

### Paleta y tipografía

En `src/layouts/BaseLayout.astro`, los atributos `data-palette` y `data-typeset` del `<html>` controlan la dirección visual:

- `data-palette`: `granate` (default), `tinta`, `mar`
- `data-typeset`: `default` (Fraunces+Garamond), `garamond`, `cormorant`, `crimson`

Los tokens viven en `src/styles/global.css` bajo `:root` y se sobrescriben por paleta/tema.

### Newsletter real

`NewsletterCard.astro` simula el envío. Para conectarlo a Buttondown, ConvertKit, Mailchimp, etc. pásale el endpoint:

```astro
<NewsletterCard action="https://buttondown.email/api/emails/embed-subscribe/jacklysander" />
```

## Despliegue

Compatible con cualquier host estático: Netlify, Vercel, Cloudflare Pages, GitHub Pages.

Antes de publicar, edita `astro.config.mjs` y cambia `site` a tu dominio real.

### GitHub + Netlify (recomendado)

1. Sube este directorio a un repo GitHub.
2. En Netlify: **Add new site → Import from GitHub**.
3. Build command: `npm run build`. Publish directory: `dist`.

### GitHub Pages

Añade este workflow en `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push: { branches: [main] }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    permissions: { pages: write, id-token: write }
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

## Licencia

Código: MIT. Contenido (obras y capítulos): © Jack B. Lysander, todos los derechos reservados.
