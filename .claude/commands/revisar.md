---
description: Revisa la página o la web en la que se está trabajando con las listas del Manual de calidad de Chymera
argument-hint: "[página, ruta o cliente (opcional)]"
---

Revisa $ARGUMENTS (si viene vacío, las páginas que se tocaron en esta sesión) antes de darla por terminada.

1. Lee `.claude/skills/web-cliente-chymera/references/manual-calidad.md`, secciones "Lo que garantiza toda web de Chymera", "Lo que hace vender" y "Revisión antes del borrador y antes de publicar". Si es la web de un cliente, usa además su CLAUDE.md y su plan (Presencia, Negocio o Reservas).
2. Levanta el sitio con `npm run dev` y toma capturas con Playwright a 360, 768 y 1440 px, con animaciones y con movimiento reducido. Míralas de verdad.
3. Pasa, en este orden:
   - La lista "Antes de enviar el borrador" del manual (o "Antes de publicar" si se va a publicar).
   - La sección 2 de `diseno-web-chymera` ("Señales de web hecha con IA") y su sección 5 (revisión visual).
   - Las reglas de severidad alta de `.claude/skills/ui-ux-pro-max/references/quick-reference.md` y la lista de `references/pro-rules.md`.
   - Las skills `design-critique` y `accessibility-review` sobre las capturas.
   - Reglas de la casa del CLAUDE.md: textos en `site.json`, precios en COP con punto de miles, colores de marca, botón de WhatsApp siempre visible.
4. Corre `npm run build`. Si falla, lee solo las últimas líneas del error.
5. Corrige lo que sea claro. Lo que necesite una decisión de kev (textos de venta, precios, datos del cliente) déjalo anotado, no lo inventes.

Al final responde en español y en corto: una tabla con cada punto revisado (cumple, corregido o pendiente) y una línea con lo que queda pendiente para kev. Lo que no se pueda comprobar desde aquí (PageSpeed Insights, celular real, Search Console) va como pendiente, no como cumplido.
