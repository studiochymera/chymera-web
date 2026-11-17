---
name: "web-cliente-chymera"
description: "Usar al construir, rediseñar o cambiar la web de un cliente de Chymera Studios: diseño propio por cliente, venta, SEO local, presencia en Google, Maps e IA, legal colombiano y listas de revisión."
---

# Web de cliente de Chymera Studios

Chymera Studios hace webs para negocios locales de Bogotá (Astro + Tailwind, publicadas en Cloudflare Workers). La fuente completa es el Manual de calidad: https://claude.ai/code/artifact/59ad2fe8-bd9f-4315-b3a9-fbf406a4ace0. Léelo antes de empezar; si algo aquí lo contradice, manda el manual.

## Regla principal: diseño propio
- Cada cliente recibe un diseño hecho para él. Lo que se reutiliza es la base técnica (velocidad, SEO, formularios, seguridad, parte legal), nunca el diseño.
- Las demos del portafolio son solo muestras: nunca se entregan con otro logo y otros colores.
- Cada web tiene su composición de portada, pareja de tipografías, uso del color, estilo de fotos y al menos un elemento distintivo sacado del cliente (su logo, su espacio, su oficio o su barrio).
- Antes del borrador, comparar con las webs anteriores de Chymera y las demos; si se parece, rehacer esa parte.
- El oficio visual (dirección de arte, tipografía, composición, animación y revisión con capturas) está en la habilidad `diseno-web-chymera`; úsala en los pasos 3, 4 y 8.

## Paso a paso
1. Ficha del proyecto con las respuestas del formulario del cliente: negocio, cliente ideal, acción principal, tono, barrio, diferencial, 3 servicios estrella, las 5 dudas que más le preguntan, la prueba real que tiene (calificación en Google, años, clientes atendidos), su Perfil de Empresa en Google (enlace o "no tiene"), el correo que lo administra, los barrios que atiende y otros directorios donde aparece.
2. Mapa de búsquedas: una búsqueda de servicio + zona por página, sin repetir.
3. Dirección de diseño: referencias, paleta, tipografías, composición, fotos, elemento distintivo y gesto de movimiento. Escribirla en el CLAUDE.md del cliente, junto con la sección "Venta de este cliente".
4. Portada primero, en celular y computador; compararla antes de seguir.
5. Repositorio desde la base técnica, con CLAUDE.md hecho desde /mnt/project-files/plantilla-base/CLAUDE.md, y su propia llave de IndexNow en `public/<llave>.txt`.
6. Textos en el tono del cliente; todo texto en src/data/site.json.
7. Imágenes WebP o AVIF (principal máx. 200 KB, demás máx. 120 KB), con ancho, alto y texto alternativo.
8. Construcción primero para celular (360 px), solo las secciones del plan contratado, con las reglas de venta.
9. SEO, presencia en IA y legal del plan (secciones de abajo).
10. Lista "Antes de enviar el borrador" del manual; enlace de vista previa al cliente.
11. Con saldo pagado: lista "Antes de publicar" y el "Protocolo de lanzamiento" del manual. Entregar al cliente "Lo que le toca al negocio" con la guía de reseñas.
12. A los 30 días: revisar búsquedas en Search Console, ajustar títulos y preguntar cuántos WhatsApp llegaron con el texto de la web. A las 6 semanas: repetir la prueba en ChatGPT, Gemini y Perplexity y compararla con la línea base.

## Venta (manual, sección "Lo que hace vender")
- Una sola acción principal; un botón principal por pantalla y como máximo una acción secundaria discreta.
- Primera pantalla a 360 px, sin bajar: qué ofrece, en qué barrio, para quién, una prueba real y el botón principal.
- Cada sección termina con un botón hacia la acción principal; el botón flotante de WhatsApp sigue siempre visible.
- Cada botón de WhatsApp con su propio mensaje listo que nombra el servicio o la sección; los mensajes viven en site.json.
- Botones con verbo y resultado ("Reserva tu cita por WhatsApp"); nunca "Enviar", "Más información" ni "Haz clic aquí".
- Prueba social real al lado de los botones, nunca inventada. En Presencia solo la que trae el plan (fotos reales, años o clientes en el texto, redes); testimonios y preguntas frecuentes son de Negocio y Reservas.
- Precios a la vista; si varían, "desde" y de qué depende; marcar el más pedido.
- Las dudas de la ficha se responden en su sección o en preguntas frecuentes.
- Teléfono con tel:, botón "Cómo llegar", horario a la vista; formulario de 3 campos más la casilla de autorización.
- Urgencia solo si es verdad y con vigencia (Ley 1480 de 2011).

## Que lo encuentren: Google, Maps e IA (manual, sección "Que te encuentren")
En búsquedas locales pesan más el Perfil de Empresa en Google y las reseñas que la web. ChatGPT, Gemini, Perplexity y los resúmenes con IA de Google usan Google, Bing, los mapas, los directorios y la propia web.
- La primera frase visible dice qué es, en qué barrio, para quién y el precio desde. Servicios con precio y duración en texto, nunca solo en imágenes.
- Nombre, dirección, teléfono y horario en texto en el pie, escritos exactamente igual que en el Perfil de Empresa, Bing Places y Apple Maps.
- Datos estructurados con `src/base/schema.ts`: `schemaNegocio` con el tipo exacto, `geo`, `mapa` (enlace al Perfil), `zonas` y `redes`; en Negocio y Reservas `schemaServicio` en cada página de servicio y `schemaMigas` en las internas; `schemaPreguntas` solo con preguntas visibles. Sin estrellas de reseñas propias.
- Nunca páginas casi iguales por barrio.
- robots.txt abierto a todos, también a los buscadores con IA. En el dominio de Cloudflare, apagar el bloqueo de bots de IA y el robots.txt administrado.
- IndexNow: comando de despliegue `npx wrangler deploy && npm run indexnow`.
- Protocolo de lanzamiento: Search Console (sitemap y solicitar indexación del inicio y las páginas de servicio), Bing Webmaster Tools (importar desde Search Console), Perfil de Empresa, Bing Places y Apple Business Connect con los mismos datos, y línea base con capturas en Google y en las IAs. Las cuentas quedan a nombre del negocio, con Chymera como administrador.
- No se hace: Indexing API de Google (solo sirve para empleos y transmisiones en vivo), llms.txt (Google no lo usa), reseñas compradas o a cambio de descuentos, ni promesas de puesto en Google o de aparecer en ChatGPT.

## Metas que toda web cumple
- PageSpeed Insights en celular: velocidad 90+, accesibilidad 95+, SEO 100.
- Botón de WhatsApp siempre visible con mensaje listo; botones de 44 px o más.
- Prueba de los 5 segundos en celular: se entiende qué ofrece, dónde queda, por qué confiar y qué tocar.
- Precios en COP con punto de miles e impuestos incluidos; cero textos de relleno.
- Título máx. 60 caracteres, descripción máx. 155, un H1, lang es-CO, datos estructurados validados en la Prueba de resultados enriquecidos, sitemap y robots abiertos.
- https y encabezados de seguridad con _headers.

## Legal por plan
- Todas: datos del negocio en el pie, política de datos y aviso de privacidad (básico en Presencia) con el negocio como responsable, precios con impuestos y promociones con vigencia, fotos con licencia, crédito "Sitio hecho por Chymera Studios".
- Negocio y Reservas: formulario con casilla de autorización sin marcar y enlace a la política, Turnstile y campo trampa; estadísticas solo con Cloudflare Web Analytics (Presencia no incluye estadísticas).
- Reservas: condiciones de anticipo, cancelación y devolución antes de pagar, medios de pago, precio total, enlace a sic.gov.co y derecho de retracto cuando aplique.
- Salud y estética: sin promesas de resultados ni fotos de antes y después sin autorización; el cliente aprueba esos textos.

## Al terminar
- npm run build sin errores.
- Pasar la lista del manual que corresponda y decir qué se revisó.
- Si la web enseñó algo nuevo, proponer agregarlo al manual, a esta habilidad y al CLAUDE.md modelo.