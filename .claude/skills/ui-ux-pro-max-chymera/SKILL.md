---
name: "ui-ux-pro-max-chymera"
description: "Usar al diseñar, rediseñar o revisar cualquier web de Chymera o de un cliente: consulta el catálogo UI/UX Pro Max (estilos, colores, tipografías, GSAP, reglas UX) guardado en el proyecto."
---

# UI/UX Pro Max en Chymera Studios

Catálogo de diseño (licencia MIT, de nextlevelbuilder/ui-ux-pro-max-skill) guardado en este repo en `.claude/skills/ui-ux-pro-max/`. No hace falta instalar nada: el buscador es Python sin dependencias. No usar `npm i uipro-cli`. En Windows el comando suele ser `python` en vez de `python3`.

Es una fuente de ideas y de reglas de revisión, no de decisiones. Mandan siempre, en este orden: lo que diga kev, el Manual de calidad, las reglas de la casa (CLAUDE.md, textos en site.json, precios en COP), `diseno-web-chymera` y la guía de diseño de kev. Su paleta sugerida NUNCA reemplaza la del cliente (logo, local, marca); se usa solo como referencia de estilo.

## Cómo buscar

```bash
U=.claude/skills/ui-ux-pro-max   # desde la raíz del repo
python3 $U/scripts/search.py "<2 a 5 palabras en inglés>" --domain <dominio>
```

Dominios: `product` (tipo de negocio), `style`, `color`, `typography`, `google-fonts`, `landing` (orden de secciones), `ux` (reglas), `gsap` (animaciones), `icons`, `chart`, `web`. Stack de Chymera: `--stack astro` o `--stack html-tailwind`. Dirección completa para una web nueva: `--design-system`.

Si la búsqueda sale vacía o no corresponde, reintentar una vez con menos palabras o con otro dominio. Si tampoco, decir que no hubo coincidencia y no inventar.

## Cuándo usarlo

1. **Web nueva (paso 3 de `web-cliente-chymera`):**
   - Buscar el tipo de negocio con `--domain product`. Ejemplos: "sports club", "barbershop", "spa wellness", "restaurant".
   - Correr `--design-system` con el negocio y 2 o 3 palabras de tono.
   - Tomar de ahí el patrón de portada, el estilo, los antipatrones y lo que el sector debe tener (por ejemplo horario, mapa o reservas). Escribir en el CLAUDE.md del cliente qué se tomó y qué se descartó, y por qué.
2. **Animación:** buscar la receta en `--domain gsap` antes de escribirla. Respetar su intensidad, duración y movimiento reducido. La regla de un solo gesto protagonista sigue mandando.
3. **Revisión antes de enseñar el borrador:**
   - Leer `references/pro-rules.md` (lista final) y las reglas de severidad alta de `references/quick-reference.md`.
   - Comprobar sobre todo: contraste 4,5:1, foco visible, botones de 44 px, texto de 16 px en celular, que nada tape el foco (scroll-padding), que no haya scroll horizontal, que el contenido no salte al cargar (CLS) y el movimiento reducido.
4. **Un problema puntual** (formulario, menú, etiqueta que se parte, carrusel): buscar primero el resultado de UX (`--domain ux`) y después el detalle de Astro o Tailwind (`--stack astro`).

## Lecciones de Chymera

- Vista previa como Artifact: el visor pone `body{background:#fff;color:#000;font:14px system}` sin capa. Por eso `body` (fondo, color, letra) va FUERA de `@layer` en global.css. Antes de enseñar, simularlo envolviendo el HTML con ese estilo y capturar.
- Las capturas se hacen con animaciones activas y también con movimiento reducido, a 360, 768, 1366x768 y 1440 px.
- Al terminar, decirle a kev en una línea qué reglas del catálogo se aplicaron.