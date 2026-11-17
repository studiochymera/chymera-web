---
name: "diseno-web-chymera"
description: "Usar al definir o construir el diseño visual de una web de Chymera o de un cliente: dirección de arte, tipografía, composición y animación que no parezca hecha con IA."
---

# Diseño web de nivel estudio (Chymera Studios)

Complementa a `web-cliente-chymera` (proceso, venta, SEO, legal) y al Manual de calidad. Aquí está solo el oficio visual. Stack: Astro + Tailwind v4 + CSS propio, sin frameworks de JS. Si las skills `frontend-design`, `web-animation-design` o `make-interfaces-feel-better` están activas, úsalas además de esta; si algo choca con las metas de velocidad del manual, gana el manual. El diseño está al servicio de la venta: si un recurso visual esconde el botón principal, la prueba o el precio, se quita.

## 1. Antes de escribir código: dirección de arte en 6 líneas
Escribirla en el CLAUDE.md del cliente:
1. Idea en una frase (ej. "taller de oficio, papel kraft y tinta", no "moderno y limpio").
2. Referencia real fuera de la web: un cartel, una carta de restaurante, una revista, la fachada del local.
3. Pareja tipográfica con rol claro: una de carácter para titulares (serif editorial, grotesca condensada, slab, display) + una de lectura. Prohibido usar Inter, Poppins o Montserrat como titular por defecto.
4. Paleta 60-30-10 sacada del cliente (logo, local, producto), con un color de acento que se use poco. El acento se reserva sobre todo para el botón de la acción principal.
5. Elemento distintivo propio (forma del logo, textura, numeración, sello, trazo) que aparezca al menos 3 veces.
6. Un solo gesto de movimiento que represente al negocio (ver sección 4).

## 2. Señales de "web hecha con IA" que están prohibidas
- Hero centrado con titular genérico, subtítulo gris y dos botones, sobre degradado morado/azul.
- Tres tarjetas iguales con ícono, título y texto como bloque de "beneficios".
- Todo con el mismo border-radius grande, sombras suaves y glassmorphism.
- Emojis o íconos de librería como decoración; ilustraciones 3D genéricas.
- Todas las secciones con el mismo ancho, mismo padding y texto centrado.
- Textos tipo "Eleva tu experiencia", "Soluciones innovadoras", "Descubre más".
- Animación fade-up idéntica en cada bloque al hacer scroll.
Si la portada tiene 3 o más de estas, rehacerla.

## 3. Composición y tipografía
- Retícula de 12 columnas en escritorio y 4 en celular; romperla a propósito (una imagen que sangra al borde, un titular que cruza columnas, texto alineado a la izquierda con margen asimétrico).
- Contraste de escala fuerte: titular de portada con `clamp()` entre ~2,6rem (360 px) y 6-8rem, frente a texto de 1-1,125rem. La jerarquía se hace con tamaño y peso, no con colores.
- Escala tipográfica modular (1,25 o 1,333) en variables CSS; interlineado 1,05-1,15 en titulares, 1,5-1,65 en texto; `letter-spacing` negativo en titulares grandes; `text-wrap: balance` en titulares y `pretty` en párrafos; medida de 60-75 caracteres.
- Ritmo vertical variado: alternar secciones densas y secciones con mucho aire; no todas con el mismo padding.
- Cada sección con una composición distinta (lista numerada grande, foto a sangre con texto encima, tabla, cita, mosaico irregular), nunca tarjetas repetidas tres veces. Cada una cierra con su botón hacia la acción principal, diseñado como parte de la composición.
- La prueba real (calificación, reseña, años, fotos del trabajo) se diseña junto al botón principal, no como bloque suelto al final.
- Fotos: encuadre y tratamiento coherentes (mismo grado de color, recortes con intención, `object-position` revisado en celular). Mejor pocas fotos grandes que muchas pequeñas, y reales del negocio antes que de banco.
- Detalles que dan nivel: números con `font-variant-numeric: tabular-nums` en precios, comillas tipográficas, guiones correctos, subrayados con `text-underline-offset`, foco visible diseñado (no el de navegador), selección de texto con el color de marca.

## 4. Animación profesional (CSS primero)
- Un gesto protagonista por web, coherente con el negocio (ej. barbería: navaja que corta una línea; spa: aparición lenta como vapor; gimnasio: cinta que avanza con el scroll). El resto, microinteracciones discretas.
- Duraciones: microinteracciones 120-220 ms; entradas 400-700 ms; nada más de 1 s salvo el gesto protagonista.
- Curvas: nunca `linear` ni `ease` por defecto en entradas. Usar salida suave, por ejemplo `cubic-bezier(0.22, 1, 0.36, 1)`; para hover `cubic-bezier(0.2, 0.7, 0.2, 1)`.
- Animar solo `transform`, `opacity`, `clip-path` y `filter`; nunca `width`, `height`, `top` o `margin`.
- Entradas escalonadas con `--i` y `animation-delay: calc(var(--i) * 60-90ms)`, máximo 6 elementos por grupo.
- Scroll: `animation-timeline: view()` dentro de `@supports`, con el contenido visible sin la animación (mejora progresiva). Si hace falta JS, un solo `IntersectionObserver` pequeño; GSAP solo si el gesto lo exige y cargado diferido.
- Transiciones entre páginas: View Transitions de Astro (`<ClientRouter />`) con nombres en el logo y la foto principal, si no daña la velocidad.
- Hover y presión: botones con `transform: translateY(-1px)` y `:active` con `scale(0.98)`; enlaces con subrayado que crece; imágenes con zoom de 1,03-1,05 dentro de su marco.
- Siempre `@media (prefers-reduced-motion: reduce)` que deja el contenido quieto y visible. Nada parpadea más de 3 veces por segundo.
- Nada de animación bloquea el primer pintado ni tapa el botón principal: el titular y el botón se ven sin esperar ninguna animación (LCP).

## 5. Revisión visual antes de enseñar el borrador
1. Capturas con Playwright (Chromium ya instalado) a 360, 768 y 1440 px de cada página; mirarlas de verdad.
2. Prueba de los 5 segundos: con la portada en celular y sin bajar, ¿se entiende qué es, dónde queda, por qué confiar y qué tocar? ¿Se reconoce el elemento distintivo?
3. Prueba del logo tapado: si se tapa el logo, ¿podría ser la web de cualquier otro negocio? Si sí, falta dirección de arte.
4. Recorrido de venta: bajar por toda la página en celular y comprobar que cada sección termina con un camino a la acción principal y que el botón flotante de WhatsApp nunca tapa otro botón ni un precio.
5. Comparar contra las demos y las webs anteriores de Chymera; ninguna sección debe parecer copiada.
6. Revisar contraste AA, foco con teclado y botones de 44 px.
7. Correr la sección 2 como lista. Decir a kev qué se revisó y qué se cambió.

## 6. Presupuesto de rendimiento (no negociable)
- Máximo 2 familias tipográficas, subconjunto latino, `font-display: swap`, la del titular precargada.
- JS propio total menor a 15 KB por página; sin librerías de animación en Presencia.
- Las metas de PageSpeed del manual (90+ velocidad en celular) se cumplen con las animaciones puestas: cada 0,1 s cuenta en la venta.