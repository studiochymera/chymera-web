# Manual de calidad

Copia del doc "Manual de calidad · Chymera Studios" (https://claude.ai/artifact/C5GifgXEAEv8x6cUofNZfV), versión del 15 de octubre de 2026, copiada el 16 de noviembre de 2026. Si el doc y esta copia difieren, manda el doc.

## Lo que garantiza toda web de Chymera

Ninguna web sale al aire sin cumplir estas diez metas, sin importar el plan. La primera es que cada cliente recibe un diseño propio: las demos del portafolio son solo muestras y nunca se entregan con otro logo y otros colores. Son medibles, así que se revisan con herramientas gratuitas y no a ojo.

| Área | Meta | Cómo se mide |
| --- | --- | --- |
| Diseño propio | No se parece a ninguna otra web de Chymera ni a las demos | Comparación lado a lado antes del borrador |
| Celular | Se ve y se usa bien desde 360 px de ancho, sin desplazamiento lateral | Revisión en un celular real y en el simulador del navegador |
| Velocidad | Puntaje de 90 o más en celular; la imagen principal carga en menos de 2,5 s | PageSpeed Insights |
| SEO | Puntaje de 100; cada página con título, descripción y datos del negocio para Google | PageSpeed Insights y prueba de resultados enriquecidos |
| Accesibilidad | Puntaje de 95 o más; texto con contraste suficiente | PageSpeed Insights |
| Contacto | Botón de WhatsApp visible en todo momento, con mensaje listo | Prueba en celular |
| Venta | La primera pantalla en celular dice qué ofrece, dónde y para quién, con una prueba real y el botón de la acción principal; cada sección termina con un camino a esa acción | Prueba de los 5 segundos y recorrido completo en celular (sección "Lo que hace vender") |
| Legal | Toda la lista legal del plan cumplida | Lista de la sección legal |
| Contenido | Cero textos de relleno, precios y horarios confirmados por el cliente | Revisión antes del borrador |
| Seguridad | Candado https y encabezados de seguridad activos | securityheaders.com |

## Paso a paso para construir cada web

Estos 12 pasos van desde que llega el material completo (paso 6 de [Qué hacer después de la venta](https://claude.ai/code/artifact/599599e0-2eba-4247-8d5e-30901dbb93ac)) hasta el primer mes en línea. Los pasos 1 a 4 definen el diseño propio del cliente, del 5 al 9 se construye, el 10 es el borrador y el 11 y el 12 son la publicación.

1. **Ficha del proyecto.** Con las respuestas del formulario, escribir en media página: negocio, cliente ideal, acción principal (WhatsApp, llamar, reservar), tono, barrio, lo que lo hace diferente, sus 3 servicios estrella, las 5 dudas que más le preguntan sus clientes y la prueba real que tiene (calificación en Google, años, clientes atendidos). Todo lo demás se decide con esta ficha.
2. **Mapa de búsquedas.** Elegir la búsqueda principal de cada página con el servicio y la zona, como "spa en Usaquén" o "masajes en Usaquén". Una búsqueda por página, sin repetir.
3. **Dirección de diseño.** Definir el concepto visual de este cliente y anotarlo en la ficha: 2 o 3 referencias (también de fuera de su sector), cómo se usa su paleta, la pareja de tipografías, la composición de la portada, el estilo de fotos y un elemento distintivo sacado de su marca, su espacio o su barrio.
4. **Portada primero.** Diseñar la portada en celular y en computador y ponerla al lado de las webs anteriores de Chymera y de las demos. Si alguien podría confundirlas, se rehace antes de seguir.
5. **Base técnica.** Crear el repositorio del cliente desde la base técnica de Chymera, que trae lo que no se ve: velocidad, SEO, formularios, seguridad y parte legal. Los componentes visuales se diseñan para este cliente siguiendo la dirección de diseño.
6. **Textos.** Escribirlos con Claude a partir de la ficha, en el tono del cliente. Todo texto vive en un solo archivo de datos, como en la web de Chymera.
7. **Imágenes.** Seleccionar, recortar y comprimir las fotos; escribir el texto alternativo de cada una.
8. **Construcción.** Armar las páginas del plan, primero para celular.
9. **SEO y legal.** Completar títulos, descripciones, datos estructurados, mapa del sitio, política de datos y aviso de privacidad, y la lista legal del plan.
10. **Revisión y borrador.** Pasar la lista de revisión antes del borrador y enviar el enlace de vista previa al cliente.
11. **Publicación.** Con el saldo pagado, conectar el dominio, pasar la lista de revisión antes de publicar y hacer el protocolo de lanzamiento de la sección "Que te encuentren".
12. **Seguimiento.** A los 30 días revisar en Search Console por qué búsquedas aparece y ajustar títulos si hace falta. Preguntarle al cliente cuántos mensajes de WhatsApp llegaron con el texto de la web y ajustar la portada o los botones si son pocos. A las 6 semanas, repetir la prueba en ChatGPT, Gemini y Perplexity y compararla con la línea base.

## Diseño, textos e imágenes

Una web se ve profesional cuando es consistente y fácil de usar en el celular, no cuando tiene muchos efectos.

### Diseño propio para cada cliente

Lo que se reutiliza entre clientes es la base técnica que no se ve (velocidad, SEO, formularios, parte legal), nunca el diseño. Dos clientes del mismo sector pueden tener webs parecidas en estructura, pero no en apariencia.

- Las demos del portafolio muestran lo que sabemos hacer; no se entregan a un cliente cambiando logo y colores.
- Cada web tiene su propia composición de portada, pareja de tipografías, uso del color y estilo de fotos.
- Cada web lleva al menos un elemento distintivo sacado del cliente: una forma de su logo, la textura de su espacio, un detalle de su oficio o de su barrio.
- Si una web nueva se parece a una anterior de Chymera, se rehace la parte que se parece antes del borrador.

### Diseño

- Primero celular: se diseña a 360 px y después se agranda.
- Lo primero que se ve en el celular dice qué hace el negocio, dónde está y tiene el botón de la acción principal.
- Máximo 2 tipografías y la paleta del cliente: 1 color de fondo, 1 principal y 1 de acento.
- Botones y enlaces de al menos 44 px de alto para el dedo.
- Espacios generosos y una sola alineación por sección.
- Sin ventanas emergentes, carruseles que se mueven solos ni música.
- Mismo estilo de tarjetas, botones y títulos en todo el sitio.

### Textos

- Frases cortas, en el tono que eligió el cliente, tuteando o en usted según su negocio.
- Cada sección responde una pregunta del cliente: qué ofrece, cuánto cuesta, dónde queda, cómo reservo.
- Precios visibles en COP con punto de miles.
- Nunca textos de relleno, testimonios inventados ni promesas de resultados.
- El cliente confirma por escrito precios, horarios y datos de contacto.

### Imágenes

- Fotos del cliente o de bancos con licencia comercial (Unsplash, Pexels). Nunca fotos sacadas de Google ni logos de terceros.
- Sin imágenes hechas con IA que hagan pasar personas por el equipo o los clientes del negocio.
- Formato WebP o AVIF, la principal de máximo 200 KB y las demás de máximo 120 KB.
- Todas con ancho y alto declarados, y las que no se ven al abrir cargan después.
- Cada foto con texto alternativo que diga lo que muestra, como "Sala de masajes con luz cálida en Usaquén".

### Logo y Kit de marca

- **Logo que el cliente ya tiene:** se usa tal cual. Si solo está en foto o en baja calidad, se redibuja en vector sin cambiar el diseño (gratis con cualquier plan) y queda a color, en negro y en blanco. Cambiarlo o modernizarlo ya es un Kit de marca.
- **Logo nuevo (Kit de marca):** se construye en vector con decisiones creativas propias (letras, forma, espacio, color). La IA solo sirve para explorar ideas al principio; nunca se entrega como logo una imagen generada tal como sale, porque en 2023 la Dirección Nacional de Derecho de Autor negó el registro de obras hechas solo con instrucciones a una IA.
- **Tipografías con licencia abierta** (SIL Open Font License, como las de Google Fonts), convertidas a trazos en los archivos del logo para que no dependan de fuentes instaladas.
- **Que funcione pequeño y en una tinta:** el ícono se lee a 16 px (favicon) y el logo funciona en negro y en blanco. No se parece a marcas conocidas del mismo sector.
- **Búsqueda en la SIC antes de entregar:** búsqueda básica de marcas parecidas en la consulta de signos de la SIC, anotada en la guía como orientativa: no es un concepto jurídico ni garantiza el registro.
- **Entregables del kit:** logo horizontal, compacto e ícono, cada uno a color, en negro y en blanco (SVG, PDF y PNG transparente); paleta de 4 a 5 colores con HEX, RGB y CMYK aproximado; 2 tipografías; favicon; fotos de perfil para WhatsApp, Instagram, Facebook y Google; portada de Facebook; guía de marca de una página en PDF. Se entregan cuando el cliente ya pagó el saldo.

## Lo que hace vender

Una web de Chymera se mide por los mensajes, llamadas y reservas que le trae al negocio, no solo por cómo se ve. Estas 11 reglas salen de estudios de conversión y de cómo eligen los clientes locales (ver Fuentes), y se cumplen en todos los planes dentro de lo que incluye cada uno.

| Regla | Cómo se aplica | Por qué |
| --- | --- | --- |
| 1. Una sola acción principal | La de la ficha: WhatsApp, llamar o reservar. Un botón principal por pantalla y, como máximo, una acción secundaria discreta (cómo llegar o llamar). | En 18.639 páginas, las de un solo llamado a la acción convirtieron 13,5 %, contra 10,5 % las de tres (Unbounce) |
| 2. La primera pantalla vende | A 360 px y sin bajar: qué ofrece, en qué barrio, para quién, una prueba real y el botón principal. Nada de frases genéricas. | El 57 % del tiempo de lectura se pasa en la primera pantalla (Nielsen Norman Group) |
| 3. Un botón al final de cada sección | Cada sección termina con un camino a la acción principal, con el texto de esa sección ("Agenda este masaje"). El botón flotante de WhatsApp sigue siempre visible. | Quien se decide a mitad de página no tiene que volver arriba a buscar el botón |
| 4. Un mensaje listo por botón | Cada botón de WhatsApp lleva su propio mensaje con el servicio o la sección: "Hola, vi en la web el corte con barba y quiero agendar". Los textos viven en site.json. | El cliente no piensa qué escribir, y el negocio sabe qué le pidieron y que llegó por la web, sin cookies ni herramientas extra |
| 5. Botones que dicen lo que pasa | Verbo y resultado: "Reserva tu cita por WhatsApp", "Pregunta por disponibilidad". Nunca "Enviar", "Más información" o "Haz clic aquí". | El texto del botón es la promesa del siguiente paso |
| 6. Prueba real junto a la decisión | Calificación y reseñas reales de Google, años del negocio, clientes atendidos, fotos reales del local, el equipo y el trabajo. Va al lado de los botones, no al final. Nunca inventada. | 97 % usa reseñas para decidir y 74 % busca reseñas de los últimos 3 meses (BrightLocal 2026) |
| 7. Precios claros | Precio de cada servicio a la vista; si varía, "desde" y de qué depende. Se marca el más pedido y lo que incluye cada paquete en una línea. | Una duda de precio sin respuesta es un mensaje que no llega, o una pregunta que el negocio responde a mano todos los días |
| 8. Responder las dudas antes de que pregunten | Las 5 dudas de la ficha (precio, parqueadero, cómo llegar, medios de pago, si hay que reservar, cuánto dura) se responden en su sección o en preguntas frecuentes. | Quita objeciones y da a Google y a los asistentes de IA datos claros; la IA ya es la tercera fuente de recomendaciones locales (BrightLocal 2026) |
| 9. Llegar y contactar sin fricción | Teléfono que marca al tocarlo, dirección con botón "Cómo llegar" a Google Maps, horario a la vista. Formulario de 3 campos más la casilla de autorización. | La cantidad de campos pesa más que la cantidad de pasos en un formulario (Baymard) |
| 10. Rápida, porque vende | Las metas de velocidad del manual también son metas de venta: ninguna animación ni foto las rompe. | 0,1 s menos en celular subió la conversión 8,4 % en tiendas y 10,1 % en viajes (Deloitte para Google, 37 marcas) |
| 11. Urgencia solo si es verdad | Cupos, fechas y promociones solo reales y con vigencia. Nada de contadores falsos ni "últimos cupos" permanentes. | Es publicidad engañosa según el Estatuto del Consumidor (Ley 1480 de 2011) y rompe la confianza |

Por plan: en Presencia la prueba es la que trae el plan (fotos reales, años o clientes atendidos en el texto de la portada y el enlace a sus redes); los testimonios y las preguntas frecuentes son de Negocio y Reservas, que los ponen junto a los botones. En Reservas la acción principal es reservar y WhatsApp queda como ayuda.

### Lo que le toca al negocio después de publicar

La web trae el mensaje; la venta se cierra en WhatsApp. Esto se le entrega al cliente al publicar, por escrito.

- Responder WhatsApp en menos de una hora dentro del horario: las empresas que contestan en la primera hora tienen casi 7 veces más probabilidad de concretar que las que tardan una hora más (Harvard Business Review, 2011).
- Usar WhatsApp Business con perfil completo, catálogo y respuesta automática fuera de horario.
- Pedir reseña en Google a cada cliente contento, con el enlace directo y el QR que le dejamos, y responderlas todas en menos de 48 horas, sin respuestas copiadas y nombrando el servicio. Nunca comprarlas ni dar descuentos a cambio: Google las borra y puede suspender el perfil. El 80 % prefiere negocios que responden todas sus reseñas (BrightLocal 2026).
- Mantener completo el Perfil de Empresa en Google (Negocio y Reservas, o Presencia con el perfil agregado), subir fotos nuevas del trabajo real cada mes y avisar a Chymera si cambia un dato, para cambiarlo el mismo día en la web y en todos los perfiles. Google dice que un perfil completo hace 2,7 veces más probable que lo vean como confiable y 70 % más probable que lo visiten.
- Contar cada mes los mensajes que llegan con el texto de la web; esa cifra se revisa en el seguimiento de los 30 días.

## Que te encuentren: Google, Maps e IA

Los clientes de Chymera compiten en su barrio, así que cada página apunta a una búsqueda de servicio más zona y los datos del negocio son idénticos en la web y en Google.

| Elemento | Regla | Ejemplo |
| --- | --- | --- |
| Título de la página | Máximo 60 caracteres: servicio, zona y nombre | Spa en Usaquén · Spa Luna |
| Descripción | Máximo 155 caracteres, con la búsqueda y una razón para entrar | Masajes y faciales en Usaquén. Reserva por WhatsApp en minutos. |
| Título principal (H1) | Uno solo por página, con la búsqueda en palabras naturales | Tu spa en Usaquén |
| Dirección de la página | Corta, en español, sin tildes | /masajes/ |
| Datos estructurados | Tipo exacto de schema.org con nombre, dirección, teléfono, horario, precios, coordenadas, enlace al Perfil de Empresa, barrios que atiende y redes, idéntico a lo que se ve en la página | DaySpa, HealthClub, SportsActivityLocation |
| Nombre, dirección y teléfono | Escritos exactamente igual en el pie de cada página, el Perfil de Empresa, Bing Places, Apple Maps, Instagram y WhatsApp Business | Calle 120 # 7-30, Bogotá |
| Imagen para compartir | 1200 × 630 px con logo, para WhatsApp y redes | |
| Idioma | Declarado como español de Colombia (es-CO) | |
| Mapa del sitio | sitemap.xml enviado a Search Console y Bing; robots.txt abierto a todos, también a los buscadores con IA | |
| Enlaces internos | Cada servicio enlaza a contacto o reservas y a los otros servicios, con textos que dicen a dónde llevan | |

Por plan: Presencia es una sola página, así que apunta a una búsqueda principal. Negocio y Reservas tienen hasta 5 páginas y cada una apunta a una búsqueda distinta. En Negocio y Reservas (y en Presencia con el extra de 120.000) el perfil en Google Maps, Bing y Apple Maps queda con categoría, servicios, fotos, horario y el enlace a la web, y se le entrega al cliente la guía para pedir reseñas con mensaje y QR y a responderlas todas.

En búsquedas locales pesan más el Perfil de Empresa en Google y las reseñas que la web. ChatGPT, Gemini, Perplexity y los resúmenes con IA de Google arman sus respuestas con Google, Bing, los mapas, los directorios y la propia web. Google dijo en mayo de 2026 que sus funciones de IA usan el mismo índice y no piden nada aparte, así que la base es la misma: contenido claro, datos iguales en todas partes y el sitio abierto a los rastreadores.

### Que una IA pueda citar la página

- La primera frase visible dice qué es, en qué barrio, para quién y el precio desde.
- Servicios con precio y duración en texto, nunca solo en imágenes.
- Las 5 dudas de la ficha respondidas en texto visible (preguntas frecuentes en Negocio y Reservas).
- Nunca páginas casi iguales por barrio ni estrellas de reseñas propias en los datos estructurados.
- En Cloudflare, el bloqueo de bots de IA y el robots.txt administrado van apagados en el dominio del cliente; si no, el negocio desaparece de ChatGPT y Perplexity.

### Protocolo de lanzamiento

Se hace el día de la publicación y toma alrededor de una hora. Las cuentas quedan a nombre del negocio, con Chymera como administrador.

1. Revisar robots.txt, sitemap, canonical y que ninguna página tenga `noindex`. Validar los datos estructurados en la Prueba de resultados enriquecidos y en validator.schema.org.
2. Google Search Console: propiedad de dominio, sitemap con la URL completa y, en Inspección de URL, solicitar indexación del inicio y de cada página de servicio, una sola vez.
3. Bing Webmaster Tools: importar desde Search Console y confirmar que llegó el aviso de IndexNow (comando de despliegue `npx wrangler deploy && npm run indexnow`).
4. Perfil de Empresa en Google, creado o reclamado: categoría principal exacta y secundarias, servicios con precio, horario, enlace a la web, descripción con servicio y barrio, fotos reales y atributos. Google suele pedir verificar con un video del local.
5. Bing Places (se importa desde Google), Apple Business Connect, Facebook, Instagram y WhatsApp Business con los mismos datos, escritos igual.
6. Línea base: buscar el nombre del negocio en Google y Bing y preguntar a ChatGPT, Gemini y Perplexity por "[servicio] en [barrio]". Guardar las capturas en la carpeta del cliente.
7. A las 2 semanas, revisar en Search Console que las páginas estén indexadas. A las 6 semanas, repetir la prueba en las IAs y compararla con la línea base.

### Lo que no se hace

- Indexing API de Google: solo se permite para ofertas de empleo y transmisiones en vivo. Para avisar se usan el sitemap, Search Console e IndexNow.
- llms.txt: Google dijo que no lo usa y ninguna IA grande confirma que lo lea.
- Prometer un puesto en Google o aparecer en ChatGPT. Se promete la web y los perfiles listos y al día, y la guía para conseguir reseñas.
- FAQ para resultados enriquecidos: Google dejó de mostrarlos en mayo de 2026. El marcado de preguntas se puede dejar, solo con preguntas visibles.

Fuentes: [Indexing API de Google](https://developers.google.com/search/apis/indexing-api/v3/using-api), [fin de los resultados de FAQ](https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/), [guía de Google sobre IA y llms.txt](https://www.thekeyword.co/news/google-ai-search-optimization-guide), [informes de IA en Search Console](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports), [Cloudflare y los bots de IA](https://www.searchengineworld.com/cloudflare-for-seo-a-deep-dive-into-bot-management-ai-crawler-control-and-pay-per-crawl).

## Velocidad, accesibilidad, seguridad y formularios

Estas reglas son técnicas y van dentro de la base técnica, así que se cumplen solas en cada web nueva.

### Velocidad

- Páginas estáticas en Astro, sin JavaScript salvo donde haga falta (menú, formulario, reservas).
- Metas de Google: la imagen principal carga en menos de 2,5 s, la página responde a un toque en menos de 200 ms y nada salta de lugar al cargar.
- Tipografías alojadas en el mismo sitio y solo los pesos que se usan.
- Sin librerías pesadas ni mapas interactivos al abrir: el mapa carga cuando se llega a esa sección.

### Accesibilidad

- Contraste de texto de al menos 4,5 a 1 (3 a 1 en títulos grandes). Con la paleta de Chymera, el celeste nunca va como texto sobre crema.
- Todo se puede usar con teclado y el foco se ve.
- Cada campo de formulario con su etiqueta visible.
- Títulos en orden (H1, luego H2, luego H3).

### Seguridad

- Candado https en el dominio principal y en www.
- Encabezados de seguridad con el archivo _headers de Cloudflare (política de contenido, protección contra marcos y contra rastreo de origen).
- Ningún dato privado del cliente ni contraseña dentro del código.

### Formularios (Negocio y Reservas)

- El mensaje llega al correo del cliente por un Worker de Cloudflare, sin servicios de terceros. Enviar a un correo verificado es gratis en Cloudflare; se confirma al armar la base técnica.
- Protección contra spam con Cloudflare Turnstile y un campo trampa oculto.
- Solo los campos necesarios: nombre, WhatsApp o correo y mensaje.
- Casilla de autorización de datos sin marcar y mensaje de confirmación al enviar.

### Estadísticas

- Negocio y Reservas usan Cloudflare Web Analytics: es gratis y no usa cookies, así que no hace falta aviso de cookies. Presencia no incluye estadísticas.
- Nada de píxeles de Meta ni Google Analytics salvo que el cliente lo pida; si lo pide, se agrega aviso de cookies.

## Lo legal de cada web

Esta lista sale del doc [Aspectos legales para vender](https://claude.ai/code/artifact/5a36c376-d7a2-48f3-a12a-c332690e0f46) y se revisa en cada web según su plan. Los datos para llenarla vienen de las secciones 2, 4, 6 y 7 del formulario del cliente.

| Requisito | Presencia | Negocio | Reservas |
| --- | --- | --- | --- |
| Datos del negocio en el pie: nombre o razón social, NIT si tiene, dirección, teléfono y correo | Sí | Sí | Sí |
| Política de tratamiento de datos y aviso de privacidad, con el negocio como responsable y su correo para consultas | Versión básica | Sí | Sí |
| Precios en COP con impuestos incluidos, y cada promoción con sus condiciones y fecha de vigencia | Sí | Sí | Sí |
| Fotos y textos con derecho de uso, confirmado por el cliente en el formulario | Sí | Sí | Sí |
| Estadísticas sin cookies | No aplica (no incluye estadísticas) | Sí | Sí |
| Formulario con casilla de autorización sin marcar y enlace a la política | No aplica | Sí | Sí |
| Condiciones de reserva visibles antes de pagar: anticipo, cancelación, reprogramación y devolución | No aplica | No aplica | Sí |
| Medios de pago, tiempo de prestación y precio total | No aplica | No aplica | Sí |
| Enlace visible a la Superintendencia de Industria y Comercio (sic.gov.co) | No aplica | No aplica | Sí |
| Información del derecho de retracto cuando aplique | No aplica | No aplica | Sí |

Dos reglas más:

- **Sectores con normas de publicidad** (clínicas estéticas, odontología, salud): no prometer resultados ni mostrar fotos de antes y después sin autorización del paciente. El cliente revisa y aprueba esos textos por escrito.
- **Crédito en el pie:** "Sitio hecho por Chymera Studios", como dice la cláusula decimoséptima del contrato.

## Revisión antes del borrador y antes de publicar

Son dos revisiones: la primera evita que el cliente vea errores, la segunda evita que los vea el público. Se copian a la ficha de cada cliente y se marcan ahí.

### Antes de enviar el borrador

- [ ] Todas las secciones del plan están, y ninguna de otro plan.
- [ ] El diseño sigue la dirección de diseño del cliente y no se parece a otra web de Chymera ni a una demo.
- [ ] Cero textos de relleno, palabras en inglés de la base técnica o datos de otro cliente.
- [ ] Precios, horarios, dirección y teléfono coinciden con el formulario.
- [ ] Revisado en un celular real: menú, botones, galería y mapa.
- [ ] El botón de WhatsApp abre el chat del cliente con el mensaje listo.
- [ ] Cada botón de WhatsApp lleva su propio mensaje listo, que dice el servicio o la sección de donde viene.
- [ ] Prueba de los 5 segundos en celular: sin bajar se entiende qué ofrece, dónde queda, por qué confiar y qué tocar.
- [ ] Cada sección termina con un camino a la acción principal, y ningún botón dice "Enviar", "Más información" o "Haz clic aquí".
- [ ] Toda prueba social es real y confirmada por el cliente, y toda urgencia (cupos, promociones) es verdadera y tiene vigencia.
- [ ] Todos los enlaces funcionan, incluidas las redes.
- [ ] PageSpeed Insights en celular: velocidad 90 o más, accesibilidad 95 o más, SEO 100.
- [ ] Lista legal del plan cumplida.
- [ ] La compilación del sitio termina sin errores.

### Antes de publicar

- [ ] Los ajustes de la ronda están hechos y el cliente aprobó por escrito.
- [ ] El saldo está pagado.
- [ ] El dominio abre con candado, con y sin www.
- [ ] Formulario probado: el mensaje llegó al correo del cliente (Negocio y Reservas).
- [ ] Reserva de prueba con pago hecha de punta a punta (Reservas).
- [ ] Datos estructurados sin errores en la prueba de resultados enriquecidos de Google.
- [ ] La vista previa al compartir el enlace por WhatsApp muestra la imagen y el título correctos.
- [ ] Protocolo de lanzamiento hecho: Search Console con sitemap e indexación solicitada, Bing Webmaster Tools, IndexNow, Perfil de Empresa, Bing Places y Apple Business Connect con los mismos datos, y capturas de la línea base.
- [ ] En Cloudflare, el bloqueo de bots de IA y el robots.txt administrado están apagados en el dominio.
- [ ] El cliente recibió "Lo que le toca al negocio": responder WhatsApp en menos de una hora, respuesta automática fuera de horario y pedir y responder reseñas, con su mensaje listo y su QR.
- [ ] Estadísticas activas en Cloudflare Web Analytics (Negocio y Reservas).
- [ ] La web queda agregada al portafolio de Chymera, si el cliente no se opuso.
- [ ] Con Kit de marca: logo aprobado por escrito, búsqueda en la SIC hecha y el kit completo revisado contra la lista de entregables, listo para entregar con la página.

## Cómo se aplica solo

El manual se aplica en cada web por cuatro vías, y ninguna depende de que alguien se acuerde de él.

| Dónde vive | Qué hace | Cuándo actúa |
| --- | --- | --- |
| Instrucciones del proyecto Chymera | Le dicen a todo Claude que trabaje en este proyecto que siga este manual | Al abrir cualquier hilo nuevo |
| Memoria del proyecto | Guarda las decisiones de kev: precios, diseño propio, reglas legales | En todos los hilos |
| Habilidad "web-cliente-chymera" | Guarda este paso a paso en la cuenta de Claude de kev | Cada vez que se construye o cambia una web de cliente, en cualquier sesión |
| Archivo CLAUDE.md de cada web | Guarda las reglas y los datos de ese cliente dentro de su código | Cada vez que Claude Code abre esa web |

- El CLAUDE.md modelo está en /mnt/project-files/plantilla-base/CLAUDE.md. Lo que va entre corchetes se llena por cliente, incluida su dirección de diseño.
- La base técnica se construye en el siguiente paso, junto con las demos del portafolio.
- Cuando una web nueva enseñe algo (un error que se repitió, algo que gustó), se agrega a este manual, a la habilidad y al CLAUDE.md modelo.

### Fuentes

- [Formato del archivo _headers en Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Enviar correos desde un Worker de Cloudflare](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/)
- [Nielsen Norman Group: Scrolling and Attention (57 % del tiempo en la primera pantalla)](https://www.nngroup.com/articles/scrolling-and-attention/)
- [BrightLocal: Local Consumer Review Survey 2026](https://www.brightlocal.com/research/local-consumer-review-survey/)
- [Deloitte para Google: Milliseconds Make Millions](https://web.dev/case-studies/milliseconds-make-millions)
- [Unbounce, resumen de MarketingProfs: un solo llamado a la acción](https://www.marketingprofs.com/charts/2018/33935/what-converts-web-landing-page-benchmarks-and-trends-infographic)
- [Baymard: cantidad de campos en formularios](https://baymard.com/blog/checkout-flow-average-form-fields)
- [Harvard Business Review: The Short Life of Online Sales Leads (2011)](https://scholarsarchive.byu.edu/facpub/9711)
- [Google: perfil de empresa completo](https://support.google.com/business/answer/10515606)

Las metas de velocidad (2,5 s, 200 ms) son las métricas Core Web Vitals de Google y el contraste de 4,5 a 1 es el de la norma de accesibilidad WCAG 2.1 AA; ambas se citan de memoria y no se abrieron en esta revisión. Las cifras de "Lo que hace vender" salen de los resúmenes de búsqueda de esas fuentes (15 de octubre de 2026); las páginas no se pudieron abrir desde la sesión, así que antes de citarlas a un cliente se confirman en la fuente.
