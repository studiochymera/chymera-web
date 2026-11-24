# Web de Chymera Studios

Sitio estático en Astro + Tailwind CSS v4. Se publica en Cloudflare (Workers con archivos estáticos, ver `wrangler.jsonc`) cada vez que se sube un cambio a la rama main de GitHub (studiochymera/chymera-web).

## Diseño: skills que se usan siempre
Antes de diseñar o cambiar algo visual (una página, una sección, una demo, una pieza de marca), cargar y seguir estas skills, sin esperar a que nadie lo pida:
- `diseno-web-chymera`: dirección de arte, composición, tipografía, animación y revisión con capturas.
- `frontend-design`: para que el resultado no parezca una web hecha con IA.
- `web-animation-design` y `make-interfaces-feel-better` (plugin audit-suite): animación y pulido fino. La animación va en CSS; JavaScript solo donde las reglas de esta web lo permiten.
- Al terminar, `design-critique` y `accessibility-review` (plugin Design) sobre capturas a 360, 768 y 1440 px.

Si alguna de estas skills no está disponible en la sesión, decirlo en la respuesta y seguir con las demás. Si chocan con las metas de velocidad o accesibilidad del Manual de calidad, mandan las metas del manual.

## Reglas de la casa
- Todo texto, precio y dato de contacto vive en `src/data/site.json`. No escribir textos sueltos en los componentes.
- Precios en pesos colombianos (COP), con punto de miles: 1.150.000.
- Marca "Ensamble" (desde nov. 2026): el símbolo es una C hecha de tres piezas (dos cuartos de círculo y un triángulo amarillo) y la palabra "chymera" en minúscula, en Bricolage Grotesque 800. Letras de la web: Bricolage Grotesque (titulares) y Figtree (textos).
- Colores de marca (definidos en `src/styles/global.css`), paleta Medianoche y maíz, 60-30-10: papel #F5F5F0 (fondo), medianoche #14213D (principal), maíz #FCC931 (acento: pieza diagonal del símbolo y botón principal, con texto tinta encima), tinta #0E1424 (texto largo). El maíz nunca va como texto sobre papel (no pasa contraste). Los nombres viejos (`crema`, `azul`, `celeste`) siguen existiendo y apuntan a la paleta nueva.
- Logos en `public/brand/` en SVG con las letras en curvas: `chymera-logo-*` (símbolo + palabra), `chymera-simbolo-*` y `chymera-palabra-*`, en versión medianoche (sobre claro) y papel (sobre oscuro). Se regeneran con `python3 scripts/marca/logos.py` (necesita fonttools y uharfbuzz). Copia de todos en /mnt/project-files/marca/logos. Rutas de imágenes relativas, sin "/" inicial.
- Las piezas de la marca (formas y composiciones) viven en `src/lib/piezas.ts`; la mesa animada de la portada es `src/components/Mesa.astro` + `src/scripts/mesa.ts`.
- Diseñar primero para celular. Botón de WhatsApp siempre visible.
- Antes de terminar: `npm run build` sin errores.

## Base técnica y demos del portafolio
- `src/base/` es la base técnica de Chymera: lo que no se ve y se reutiliza en cada web de cliente (head con SEO, datos estructurados, botón de WhatsApp, mapa diferido, formulario con autorización, política de datos y aviso de privacidad, fotos optimizadas). No trae diseño: cada web pone el suyo. La copia para webs de clientes está en /mnt/project-files/plantilla-base; si cambias algo aquí, cámbialo allá también.
- Plantillas legales de la base: `src/data/base/legal.json`.
- Buscadores e IA: `robots.txt` deja todo abierto (también a los buscadores con IA) y `npm run indexnow` avisa a Bing de las páginas del sitemap después de publicar (llave en `public/<llave>.txt`; comando de despliegue en Cloudflare: `npx wrangler deploy && npm run indexnow`). Nunca prometer un puesto en Google ni aparecer en ChatGPT.
- Demos en `/demos/barberia/` (Presencia), `/demos/gimnasio/` (Negocio) y `/demos/spa/` (Reservas). Cada una tiene su diseño propio: textos en `src/data/demos/<demo>.json`, estilos en `src/styles/demos/<demo>.css` (no usan `global.css`), componentes en `src/components/demos/<demo>/`, fotos en `src/assets/demos/<demo>/`. Las demos no se indexan en Google y no van en `sitemap.xml`.
- Cada demo muestra solo lo que incluye su plan (mismos límites que la ficha de planes). Los textos de la franja de Chymera y del portafolio están en `site.json` (claves `demos` y `portafolio`).
- Los datos de contacto de las demos son los de Chymera; nada de teléfonos, correos o redes inventados.
- Vistas previas privadas de clientes en `public/vista-previa/<cliente>-<código>/`: HTML estático ya armado (no usa Astro ni `site.json`), con `noindex` en cada página y `X-Robots-Tag` en `public/_headers`. Solo se entra con el enlace: no enlazarlas desde el sitio, no ponerlas en `sitemap.xml` ni en `robots.txt` (eso revelaría la ruta). La fuente de la de Andok Group está en /mnt/project-files/clientes/andok-group/web/.

## Comandos
- `npm install` · `npm run dev` (http://localhost:4321) · `npm run build` (sale en `dist/`)
