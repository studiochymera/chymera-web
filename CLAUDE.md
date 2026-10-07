# Web de Chymera Studios

Sitio estático en Astro + Tailwind CSS v4. Se publica en Cloudflare Pages desde GitHub.

## Reglas de la casa
- Todo texto, precio y dato de contacto vive en `src/data/site.json`. No escribir textos sueltos en los componentes.
- Precios en pesos colombianos (COP), con punto de miles: 1.150.000.
- Colores de marca (definidos en `src/styles/global.css`): crema #FDF8F4 (fondo), azul #1D2A3A (principal), celeste #279BF2 (solo como acento sobre azul; sobre crema no pasa contraste para texto), tinta #040507 (texto largo). El vino #722F38 no se usa en la web.
- Logos en `public/brand/` (versiones navy y cream, PNG y WebP). Rutas de imágenes relativas, sin "/" inicial.
- Diseñar primero para celular. Botón de WhatsApp siempre visible.
- Antes de terminar: `npm run build` sin errores.

## Comandos
- `npm install` · `npm run dev` (http://localhost:4321) · `npm run build` (sale en `dist/`)
