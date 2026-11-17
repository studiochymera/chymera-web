---
name: "trabajo-eficiente-chymera"
description: "Usar al empezar cualquier tarea en el proyecto Chymera Studios: dónde está cada cosa y cómo trabajar gastando menos tokens sin bajar la calidad."
---

# Trabajo eficiente en Chymera Studios

Objetivo: llegar al resultado con la menor lectura y el menor ida y vuelta posibles, sin saltarse las verificaciones que kev exige (revisar cada página tocada, `npm run build` sin errores, ningún dato desactualizado).

## Mapa: dónde está cada cosa (no buscarla de nuevo)
Hay dos lugares de trabajo: el proyecto Chymera en la nube (tiene la carpeta /mnt/project-files) y Claude Code en el computador de kev (solo tiene este repo). Si /mnt/project-files no existe, estás en el computador: usa las rutas del repo y pide a kev lo que solo está en la nube.

En el repo (sirve en los dos lugares):
- Web de Chymera: este repo, studiochymera/chymera-web (fuente de verdad). Textos y precios en `src/data/site.json`.
- Manual de calidad: `.claude/skills/web-cliente-chymera/references/manual-calidad.md` (copia del doc https://claude.ai/artifact/C5GifgXEAEv8x6cUofNZfV; si difieren, manda el doc).
- Catálogo UI/UX Pro Max: `.claude/skills/ui-ux-pro-max/`. Logos para la web: `public/brand/`.
- Base técnica: `src/base/`. Lista de revisión: comando `/revisar`.

Solo en la nube (/mnt/project-files; en el computador no hay copia, pedirla a kev si hace falta):
- La copia /mnt/project-files/chymera-web está vieja: no editarla ni leerla como referencia.
- Plantilla para clientes: /mnt/project-files/plantilla-base (si cambia `src/base/` del repo, cambiar también allá, y al revés).
- Reglas para hacer webs: /mnt/project-files/instrucciones/instrucciones-webs.md (kev las pega en las instrucciones del proyecto), además del Manual de calidad y la skill web-cliente-chymera.
- Clientes: /mnt/project-files/clientes/<cliente>/ con su CLAUDE.md y FICHA.md.
- Ventas (contrato, cuenta de cobro, CRM, scripts del formulario, presentación): /mnt/project-files/ventas/.
- Marca en todos los formatos: /mnt/project-files/Chymera/Logos vectorizados/ (SVG y PNG). Fotos de demos: /mnt/project-files/demos-fotos/.
- Decisiones y precios: memoria del proyecto (MEMORY.md y sus archivos por tema). En el computador, confirmar con `site.json` o preguntar a kev.

## Leer poco y preciso
- Antes de abrir un archivo grande, mirar tamaño y estructura (`wc -c`, `ls`). En `site.json` (~30 KB) leer solo la clave que toca, con `python3 -c` o `jq`.
- Buscar con `rg` o `grep` en una carpeta concreta y por tipo, nunca en todo /mnt/project-files (es una unidad de red: cada archivo leído se descarga).
- No volver a leer un archivo que ya está en la conversación ni uno que se acaba de editar.
- En documentos de Claude Docs, leer el esquema (outline) o buscar el texto, no el documento entero.
- Fotos, PDF y capturas: abrirlos solo si hay que mirarlos de verdad.
- Para el historial, leer el hilo con `read_thread` (newest_first, límite pequeño), no toda la línea del proyecto.

## Hacer en lote
- Lanzar juntas las llamadas independientes (lecturas, búsquedas, comandos).
- Agrupar cambios del mismo archivo en una sola edición y un solo commit.
- Un `npm run build` al final de un bloque de cambios. Si falla, leer solo las últimas líneas del error (`npm run build 2>&1 | tail -30`).
- No usar subagentes para tareas que caben en el hilo; cada uno arranca de cero y relee contexto.

## Responder corto
- En español, empezando por el resultado. Lo que pase de 15 líneas va en un documento enlazado.
- No repetir lo que kev ya sabe ni narrar la investigación. Preguntas con opciones y una recomendación marcada.
- Progreso en la lista de estado, no en mensajes.

## Memoria del proyecto
- MEMORY.md se carga en todas las sesiones: mantenerlo como índice corto (menos de 4 KB), una línea por tema con enlace al archivo del tema.
- Lo aprendido va en el archivo de su tema en una o dos líneas (el dato y por qué), no la historia de cómo se supo.
- Antes de crear un archivo de memoria, buscar si ya hay uno del tema y actualizarlo.

## Lo que no se recorta
- Revisar cada página tocada y pasar las listas del Manual de calidad en webs de clientes.
- `npm run build` sin errores antes de dar algo por terminado.
- Comprobar precios y datos contra `site.json` o la memoria antes de afirmarlos, y buscar en la web, la ficha de planes, el contrato y la presentación cualquier dato que un cambio deje desactualizado.