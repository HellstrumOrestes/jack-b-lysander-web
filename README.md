# jackblysander.com

Sitio web personal de **Jack B. Lysander**. Ficción serializada en español.

Construido con [Astro](https://astro.build), desplegado en GitHub Pages,
con dominio personalizado `jackblysander.com`.

---

## Requisitos en tu máquina

Solo necesitas dos cosas:

1. **Node.js 20 o superior** (recomendado 22). Para comprobarlo:
   ```bash
   node --version
   ```
   Si no lo tienes o tu versión es menor, descárgalo desde
   <https://nodejs.org> (instala la versión "LTS").

2. **Git**. Para comprobarlo:
   ```bash
   git --version
   ```

No hace falta instalar nada de forma global aparte de eso.

---

## Correr el sitio en local

Desde la carpeta del proyecto:

```bash
npm install      # solo la primera vez
npm run dev      # arranca el servidor de desarrollo
```

Abre <http://localhost:4321/> en el navegador. Cualquier cambio que guardes
en un archivo `.md` o `.astro` se refleja al instante sin necesidad de
recargar.

Para parar el servidor: `Ctrl + C` en la terminal.

---

## Cómo añadir un capítulo nuevo

1. Abre la carpeta del proyecto en VS Code (o tu editor favorito).
2. Ve a `src/content/capitulos/<slug-de-la-obra>/`. Por ejemplo, para
   *Samantha Solstice*: `src/content/capitulos/samantha-solstice/`.
3. Crea un archivo nuevo siguiendo este patrón de nombre:
   ```
   <numero-con-cero>-<titulo-en-minusculas-con-guiones>.md
   ```
   Ejemplo: `03-el-libro-azul.md`.

   **Importante**: el número siempre con cero a la izquierda hasta el 99
   (`01`, `02`, …, `09`, `10`, `11`, …). Esto mantiene los archivos
   ordenados visualmente en el editor.

4. El archivo tiene que empezar por el bloque de metadatos (frontmatter)
   y luego el texto del capítulo en Markdown:

   ```markdown
   ---
   titulo: "El libro azul"
   numero: 3
   obra: "samantha-solstice"
   fecha: 2026-05-12
   sinopsis: "Frase corta y opcional para el índice de la obra."
   borrador: false
   ---

   Aquí va el cuerpo del capítulo, en Markdown normal.

   Un párrafo nuevo se separa con una línea en blanco.

   *Cursiva* y **negrita** se escriben así.

   > Las citas largas se escriben con este símbolo al principio.
   ```

5. Guarda el archivo. Si quieres dejarlo a medias sin que se publique,
   pon `borrador: true` en el frontmatter; mientras esté en `true`, el
   capítulo no aparecerá en la web ni en el RSS.

6. Comprueba en local que se ve bien:
   ```bash
   npm run dev
   ```
   y entra a `http://localhost:4321/obras/samantha-solstice/`.

7. Cuando esté listo, súbelo:
   ```bash
   git add src/content/capitulos/samantha-solstice/03-el-libro-azul.md
   git commit -m "Capítulo 3 de Samantha Solstice: El libro azul"
   git push
   ```

8. En 1-2 minutos GitHub Actions habrá rebuild y publicado en
   `jackblysander.com`. Puedes ver el progreso en la pestaña
   *Actions* del repositorio en GitHub.

---

## Cómo añadir una obra nueva

1. Crea el archivo de la obra:
   `src/content/obras/<slug-de-la-obra>.md`.

   El **slug** es el identificador en URL: en minúsculas, sin acentos
   ni espacios, con guiones. Ejemplo: `samantha-solstice`, `jane`,
   `los-trenes-de-medianoche`. **El nombre del archivo es el slug**
   — no necesitas declararlo en el frontmatter.

2. Pega este frontmatter y rellénalo:

   ```markdown
   ---
   titulo: "Título de la obra"
   sinopsis_corta: "Una sola línea para la home y el listado de obras."
   sinopsis_larga: |
     Aquí puedes escribir varios párrafos. Esta sinopsis aparece en la
     página propia de la obra.

     Para hacer un párrafo nuevo, deja una línea en blanco igual que en
     cualquier Markdown.
   genero: "Fantasía contemporánea"
   estado: "En publicación"   # o "Completa", "En pausa"
   fecha_inicio: 2026-04-28
   imagen_portada: "/images/mi-portada.jpg"   # OPCIONAL — borra la línea si no hay
   orden: 1   # OPCIONAL — controla el orden de aparición en home/listado
   ---
   ```

3. Crea la carpeta para sus capítulos:
   `src/content/capitulos/<slug-de-la-obra>/`. Empieza con el primer
   capítulo (`01-...md`) siguiendo las instrucciones de la sección
   anterior.

4. Si quieres añadir imagen de portada, pon el archivo en
   `public/images/` (crea la carpeta si no existe) y referéncialo en
   `imagen_portada` con la ruta absoluta `/images/archivo.jpg`.

5. Sube los cambios con `git add`, `git commit`, `git push` igual que
   con un capítulo.

---

## Glosario por obra

Cada obra puede tener su propio glosario de términos (personajes,
lugares, objetos, conceptos). Aparece publicado en
`/obras/<slug-obra>/glosario/` y, dentro de un capítulo, los enlaces
que apunten a un término del glosario salen con **tooltip al hover**
en desktop y **navegan a la página completa** del término al hacer
clic (también en móvil).

### Cómo añadir un término

1. Crea un archivo en
   `src/content/glosario/<slug-obra>/<slug-termino>.md`. Ejemplo:
   `src/content/glosario/samantha-solstice/samantha.md`.

2. El frontmatter es **obligatorio** y se valida en build:

   ```markdown
   ---
   termino: "Samantha Solstice"             # cómo se muestra el nombre
   obra: "samantha-solstice"                # debe coincidir con la obra
   descripcion_corta: "Bibliotecaria nocturna y protagonista de la novela."
   ---

   Aquí va la descripción larga del término en Markdown.
   Aparecerá en la página individual del término. Puedes
   escribir varios párrafos.
   ```

3. **`descripcion_corta`** es lo que se muestra como tooltip al hover
   en los capítulos. Tiene un máximo de **180 caracteres** (suficiente
   para 2-3 líneas en un tooltip). Si te pasas, el build da error con
   un mensaje claro.

4. El cuerpo del archivo (debajo del frontmatter) es la descripción
   larga que aparece en `/obras/<slug-obra>/glosario/<slug-termino>/`.

### Cómo enlazar un término desde un capítulo

En un `.md` de capítulo, escribes un enlace **Markdown estándar** que
apunta a la URL del término:

```markdown
[Samantha](/obras/samantha-solstice/glosario/samantha/)
```

Eso es todo. El plugin Rehype detecta automáticamente que ese enlace
apunta al glosario, lee la `descripcion_corta` del archivo del término
y la inyecta como tooltip. Tú no tienes que repetir la descripción.

Si quieres mostrar el término con otra forma o capitalización, cambia
el texto entre corchetes:

```markdown
[bibliotecaria del turno de noche](/obras/samantha-solstice/glosario/samantha/)
```

El tooltip seguirá mostrando lo declarado en `descripcion_corta`.

### Reglas y consejos

- **No autoenlaces todas las apariciones.** Pon el enlace solo cuando
  añada valor. Cansa que cada vez que aparece "Samantha" en el capítulo
  10 salga el tooltip de "protagonista".
- **El glosario es por obra.** Un término "Samantha" en
  `samantha-solstice` puede coexistir con otro en otra obra sin
  colisionar; cada uno vive en su carpeta y tiene su URL.
- **El tooltip funciona solo en desktop.** En móvil/tablet no hay
  hover real; ahí el tap navega directamente a la página completa del
  término. Diseñado así a propósito.
- **Si pones un enlace a una URL `/glosario/...` que no existe**, el
  enlace se quedará como un `<a>` normal (sin tooltip ni clase
  especial). No rompe nada, pero al hacer clic dará 404.

### Estructura final

```
src/content/glosario/
└── samantha-solstice/
    ├── samantha.md
    ├── biblioteca-nocturna.md
    └── libro-azul.md
```

Cada obra tiene su propia carpeta dentro de `glosario/`. Si una obra
no tiene términos, simplemente no creas la carpeta y no aparece la
sección "Glosario" en su página.

---

## Trabajar capítulos en borrador (rama `borradores`)

Como el repositorio es público, cualquiera podría leer un `.md` con
`borrador: true` aunque no se publique en la web. Para evitarlo, usa
la rama `borradores`:

1. **Cuando empieces un capítulo a medio**, trabájalo en la rama
   `borradores`. Desde la interfaz de GitHub.com:
   - Arriba a la izquierda del repo hay un selector de rama (pone
     `main`). Haz clic, escribe `borradores` y selecciona la rama.
   - Crea o edita el `.md` allí. Commit en la rama `borradores`.
2. **Cuando esté listo para publicar**, lo "mueves" a `main`:
   - Pestaña **Pull requests** → **New pull request**.
   - Base: `main` ← Compare: `borradores`. Crear PR.
   - **Merge pull request** → confirma. En 1-2 min está en la web.
3. Si quieres que el capítulo NO aparezca aunque ya esté en `main`,
   pon `borrador: true` en el frontmatter: ese flag impide que se
   publique en la web ni en el RSS, aunque el archivo esté en `main`.

**Tip**: pulsa la tecla `.` en cualquier vista del repo para abrir
**github.dev** (un VS Code completo en el navegador). Mucho más
cómodo para escribir que el editor de archivos por defecto de
GitHub.com.

Si prefieres trabajar todo en local con `npm run dev` y ver el
preview antes de publicar, sigue siendo válido: clona el repo y
trabaja como cualquier proyecto.

---

## Validación: por qué a veces el build falla

El proyecto usa **Astro Content Collections** con validación estricta.
Si algún archivo `.md` tiene el frontmatter mal escrito, el build
fallará con un mensaje del tipo:

```
[InvalidFrontmatter] capitulos → samantha-solstice/03-el-libro-azul.md
  fecha: Expected date, received string
```

Errores típicos y cómo arreglarlos:

- **Fecha mal escrita** → `fecha: 2026-05-12` (sin comillas, formato
  AAAA-MM-DD).
- **Falta un campo obligatorio** → revisa que estén `titulo`, `numero`,
  `obra`, `fecha`.
- **`obra:` no coincide con ningún slug** → tiene que ser exactamente
  igual que el `slug` del archivo en `src/content/obras/`.
- **Comillas raras** → si copias y pegas de Word o Notion, a veces
  vienen comillas tipográficas («"», «"») que rompen el frontmatter.
  Sustitúyelas por comillas rectas (`"`).

---

## Deployment automático a GitHub Pages

Cada vez que haces `git push` a la rama `main`:

1. GitHub detecta el push.
2. Se ejecuta el workflow de `.github/workflows/deploy.yml`.
3. Instala dependencias, hace `npm run build`, y publica `dist/` en
   GitHub Pages.
4. En 1-2 minutos, los cambios están en `https://jackblysander.com`.

No tienes que hacer nada manual. Si quieres ver el estado de un
deployment, entra a la pestaña **Actions** del repositorio en GitHub.

Si el build falla, recibirás un email de GitHub con el log. Lo más
probable es un frontmatter mal escrito (ver sección anterior).

---

## Configuración inicial (una sola vez)

Esto solo lo haces la primera vez que pones el repositorio en marcha.
Si ya está todo activo, sáltatelo.

### 1. Crear el repositorio en GitHub

Si lo creas desde cero:

1. Entra a <https://github.com/new>.
2. Nombre del repositorio: `jack-b-lysander-web` (o el que quieras).
3. Visibilidad: pública (GitHub Pages funciona en repos privados
   también, pero solo con cuenta de pago).
4. **No** añadas README ni `.gitignore` ni licencia desde la interfaz
   web — ya están en este proyecto.

### 2. Subir el código

Desde la carpeta local del proyecto:

```bash
git remote add origin https://github.com/<tu-usuario>/jack-b-lysander-web.git
git branch -M main
git push -u origin main
```

(Si ya tienes el `origin` configurado, sáltate el primer comando.)

### 3. Activar GitHub Pages en el repositorio

1. En GitHub, abre el repo.
2. Ve a **Settings** → **Pages** (en el menú lateral izquierdo).
3. En **Build and deployment** → **Source**, elige
   **GitHub Actions**.
4. Guarda. No hace falta tocar nada más en esa pantalla; el workflow
   ya está incluido en el código (`.github/workflows/deploy.yml`).
5. Vuelve a la pestaña **Actions** del repo. Deberías ver un workflow
   en marcha. Espera 1-2 minutos a que termine.

Cuando termine sin errores, el sitio estará vivo en
`https://<tu-usuario>.github.io/jack-b-lysander-web/`. **Esto es
temporal**: en el siguiente paso lo conectamos al dominio de verdad.

### 4. Configurar el dominio personalizado en GitHub

1. **Settings** → **Pages** → **Custom domain**.
2. Escribe `jackblysander.com` y dale a **Save**.
3. GitHub te dirá *"DNS check unsuccessful"* en rojo. Es normal: aún
   no hemos configurado los DNS. Pasa al paso 5.

### 5. Configurar los DNS en WordPress.com

Recuerda: WordPress.com solo está actuando de **registrador** del
dominio. No vas a tocar nada del sitio WordPress, solo los DNS.

1. Entra a tu cuenta de WordPress.com.
2. **Mis Sitios** → **Upgrades** → **Domains** (o
   `https://wordpress.com/domains/manage/`).
3. Haz clic sobre `jackblysander.com`.
4. Busca **DNS records** o **Name Servers and DNS** → **DNS records**.

Vas a añadir **5 registros**: 4 de tipo A para el dominio raíz, y 1
CNAME para `www`.

#### Registros A (apuntan al dominio raíz `jackblysander.com`)

Añade los siguientes 4 registros A. En el campo "Name" / "Host" déjalo
**vacío** o pon `@` (depende de la interfaz de WordPress.com — si
ofrece la opción de "raíz" o "apex", úsala).

| Tipo | Name | Value           | TTL   |
|------|------|-----------------|-------|
| A    | @    | 185.199.108.153 | 3600  |
| A    | @    | 185.199.109.153 | 3600  |
| A    | @    | 185.199.110.153 | 3600  |
| A    | @    | 185.199.111.153 | 3600  |

(Estas son las IPs oficiales de GitHub Pages. Las cuatro son
necesarias para tener redundancia.)

#### Registro CNAME (para `www.jackblysander.com`)

| Tipo  | Name | Value                       | TTL   |
|-------|------|-----------------------------|-------|
| CNAME | www  | <tu-usuario>.github.io.     | 3600  |

(Sustituye `<tu-usuario>` por tu nombre de usuario de GitHub. **El
punto al final es importante** en muchas interfaces, aunque algunas
lo añaden solas.)

#### Si WordPress.com tiene registros antiguos

Antes de añadir los nuevos, **borra** cualquier registro A existente
sobre el dominio raíz que apunte a IPs de WordPress (`192.0.78.x` o
similares), y borra el CNAME de `www` si lo había. Si no, los DNS
estarán "duplicados" y la web seguirá yendo al WordPress viejo.

**No toques** los registros MX (correo) si los tienes — esos son para
el email del dominio y no tienen nada que ver con la web.

### 6. Esperar la propagación

Los cambios de DNS tardan en propagarse. Esperar:

- **Mejor caso**: 5-15 minutos.
- **Caso típico**: 1-2 horas.
- **Peor caso**: hasta 24-48 horas.

Para comprobar si ha propagado, en la terminal:

```bash
dig jackblysander.com +short
```

Cuando devuelva las cuatro IPs `185.199.108.153`, `185.199.109.153`,
`185.199.110.153`, `185.199.111.153`, ya está. Antes de eso, no.

### 7. Activar HTTPS

Una vez los DNS han propagado:

1. Vuelve a **Settings** → **Pages** del repositorio en GitHub.
2. Verás que el aviso rojo de "DNS check unsuccessful" ahora es verde.
3. Espera unos minutos (GitHub pide automáticamente un certificado
   Let's Encrypt). Cuando esté listo, marca la casilla
   **Enforce HTTPS**.

A partir de aquí, `https://jackblysander.com` funciona con
certificado válido.

---

## Errores típicos al configurar el dominio

- **"DNS check unsuccessful" no se va.** Aún no ha propagado, o has
  dejado registros A antiguos sin borrar. Espera más, y revisa con
  `dig` que solo aparezcan las IPs de GitHub.

- **El sitio sigue mostrando el WordPress antiguo.** Caché del
  navegador o DNS local cacheado. Prueba en modo incógnito o desde
  el móvil con datos.

- **HTTPS no se activa.** Le toma a GitHub hasta una hora generar el
  certificado tras detectar los DNS correctos. Si después de unas
  horas sigue sin funcionar, en **Settings → Pages** desmarca y
  vuelve a marcar **Enforce HTTPS**, o reescribe el dominio
  personalizado y guarda otra vez. Esto fuerza que GitHub vuelva a
  pedir el certificado.

- **`www.jackblysander.com` no carga.** Falta el CNAME de `www`, o
  está mal escrito. Debe apuntar a `<tu-usuario>.github.io.` (con el
  punto final) y NO a `jackblysander.com`.

- **El build falla en GitHub Actions.** Casi siempre es un
  frontmatter mal escrito en un `.md`. El log de Actions te dice qué
  archivo y qué campo. Arréglalo en local, comprueba con `npm run
  build` que ya no falla, y vuelve a hacer push.

- **Has cambiado el dominio en Settings → Pages y se borra el
  archivo `CNAME`.** GitHub a veces elimina el archivo `public/CNAME`
  cuando reescribes el dominio en la interfaz. Si pasa, vuelve a
  crear el archivo `public/CNAME` con el contenido `jackblysander.com`
  y haz push.

---

## Resumen del flujo de publicación habitual

Ya con todo configurado, publicar un capítulo nuevo es esto:

1. Abro el editor en la carpeta del repo.
2. Creo `src/content/capitulos/samantha-solstice/03-mi-titulo.md`.
3. Escribo el frontmatter y el texto.
4. `git add`, `git commit -m "Capítulo 3"`, `git push`.
5. Espero 1-2 minutos.
6. Está en `jackblysander.com`.
7. Voy a Buttondown y mando el aviso a la lista.

Fin.

---

## Estructura del proyecto

```
.
├── .github/workflows/deploy.yml   # CI: build + deploy a GitHub Pages
├── astro.config.mjs               # Configuración Astro
├── public/
│   ├── CNAME                      # Dominio personalizado
│   ├── logo.png
│   └── logo-transparent.png
├── src/
│   ├── components/                # Header, Footer, NewsletterForm, ObraCard
│   ├── content/
│   │   ├── config.ts              # Schemas Zod (frontmatter validado)
│   │   ├── obras/                 # Una obra = un .md
│   │   ├── capitulos/<obra>/      # Capítulos por obra
│   │   └── sobre.md               # Página "Sobre el autor"
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro            # /
│   │   ├── obras/index.astro      # /obras/
│   │   ├── obras/[slug]/index.astro       # /obras/<slug>/
│   │   ├── obras/[slug]/[capitulo].astro  # /obras/<slug>/<cap>/
│   │   ├── sobre.astro            # /sobre/
│   │   ├── rss.xml.ts             # /rss.xml
│   │   └── 404.astro
│   └── styles/global.css
├── package.json
├── tsconfig.json
└── README.md
```

---

## SEO y archivos automáticos

El sitio genera en cada build:

- **`/sitemap-index.xml`** y `/sitemap-0.xml` — para Google y otros buscadores. Generados por `@astrojs/sitemap`.
- **`/robots.txt`** — permite el rastreo a todos los user-agents y declara la ubicación del sitemap.
- **`/rss.xml`** — feed RSS con todos los capítulos publicados (no borradores), descendente por fecha.
- **`/llms.txt`** — descripción del sitio en formato Markdown para LLMs (ChatGPT, Claude, Perplexity, etc.). Sigue la convención de [llmstxt.org](https://llmstxt.org). Se regenera con cada build con la lista de obras y capítulos publicados.

Todas las páginas tienen meta tags Open Graph completos, Twitter Cards (`summary_large_image`), canonical correcto, `theme-color`, y JSON-LD Schema.org según el tipo:

- Home, /obras/, /sobre/, /404 → `WebSite` global.
- /obras/[slug]/ → `CreativeWorkSeries` con autor, idioma, género y `hasPart` con todos los capítulos.
- /obras/[slug]/[capitulo]/ → `Article` con autor, fecha de publicación e `isPartOf` apuntando a la obra.
- /sobre/ → `Person`.

### Imagen Open Graph (`og:image`)

Cuando alguien comparte un enlace tuyo en redes sociales o en mensajería, esa imagen es la que aparece como preview. Hoy el sitio usa `public/logo-transparent.png` como placeholder, lo cual no es ideal.

Para sustituirla por la definitiva:

1. Crea un PNG de **1200×630 px** con el branding que quieras (nombre del autor, fondo crema, una línea sutil…).
2. Guárdalo como `public/og-default.png`.
3. Edita `src/components/SEO.astro`, busca la línea con `// TODO: sustituir por imagen Open Graph` y cambia `/logo-transparent.png` por `/og-default.png`.
4. Commit + push.

A nivel de obra, también puedes poner una `imagen_portada` en el frontmatter de cada `obras/<slug>.md`; ese valor se usa como `og:image` en las páginas de obra y de sus capítulos.

### Favicon

Hoy el favicon es un placeholder SVG con las iniciales JBL en burdeos sobre crema (`public/favicon.svg`). Cuando tengas un favicon definitivo:

- Sustituye `public/favicon.svg` por tu versión SVG (ideal por nitidez).
- Si quieres versiones PNG (16×16, 32×32, apple-touch-icon 180×180), genera los archivos con cualquier favicon generator (p. ej. <https://realfavicongenerator.net>) y métela en `public/`. Ya está enlazado en `BaseLayout.astro` un fallback PNG genérico — puedes ajustar las rutas allí.

---

## Newsletter (Buttondown)

El formulario de suscripción está en
`src/components/NewsletterForm.astro` y apunta al endpoint público
de Buttondown:

```
https://buttondown.com/api/emails/embed-subscribe/jack_b_lysander
```

No hay claves API ni variables de entorno. El formulario funciona
solo con HTML; Buttondown gestiona double opt-in y envíos del lado
servidor.

Si algún día cambia el nombre de usuario de Buttondown, edita ese
archivo (es la única referencia en el código).

