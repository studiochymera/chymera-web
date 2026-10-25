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
- Colores de marca (definidos en `src/styles/global.css`): crema #FDF8F4 (fondo), azul #1D2A3A (principal), celeste #279BF2 (solo como acento sobre azul; sobre crema no pasa contraste para texto), tinta #040507 (texto largo). El vino #722F38 no se usa en la web.
- Logos en `public/brand/` en SVG (navy y cream), vectorizados de los archivos de marca. Todos los formatos están en /mnt/project-files/Chymera/Logos vectorizados. Rutas de imágenes relativas, sin "/" inicial.
- Diseñar primero para celular. Botón de WhatsApp siempre visible.
- Antes de terminar: `npm run build` sin errores.

## Base técnica y demos del portafolio
- `src/base/` es la base técnica de Chymera: lo que no se ve y se reutiliza en cada web de cliente (head con SEO, datos estructurados, botón de WhatsApp, mapa diferido, formulario con autorización, política de datos y aviso de privacidad, fotos optimizadas). No trae diseño: cada web pone el suyo. La copia para webs de clientes está en /mnt/project-files/plantilla-base; si cambias algo aquí, cámbialo allá también.
- Plantillas legales de la base: `src/data/base/legal.json`.
- Buscadores e IA: `robots.txt` deja todo abierto (también a los buscadores con IA) y `npm run indexnow` avisa a Bing de las páginas del sitemap después de publicar (llave en `public/<llave>.txt`; comando de despliegue en Cloudflare: `npx wrangler deploy && npm run indexnow`). Nunca prometer un puesto en Google ni aparecer en ChatGPT.
- Demos en `/demos/barberia/` (Presencia), `/demos/gimnasio/` (Negocio) y `/demos/spa/` (Reservas). Cada una tiene su diseño propio: textos en `src/data/demos/<demo>.json`, estilos en `src/styles/demos/<demo>.css` (no usan `global.css`), componentes en `src/components/demos/<demo>/`, fotos en `src/assets/demos/<demo>/`. Las demos no se indexan en Google y no van en `sitemap.xml`.
- Cada demo muestra solo lo que incluye su plan (mismos límites que la ficha de planes). Los textos de la franja de Chymera y del portafolio están en `site.json` (claves `demos` y `portafolio`).
- Los datos de contacto de las demos son los de Chymera; nada de teléfonos, correos o redes inventados.

## Comandos
- `npm install` · `npm run dev` (http://localhost:4321) · `npm run build` (sale en `dist/`)
