// Base técnica de Chymera: avisa a Bing (y a los buscadores que usan IndexNow) de las páginas del sitemap.
// Se corre después de publicar: en Cloudflare Workers, comando de despliegue
// `npx wrangler deploy && npm run indexnow`. Google no usa IndexNow; para Google bastan el sitemap y Search Console.
// Nunca hace fallar la publicación: si algo sale mal, solo lo dice. `INDEXNOW_PRUEBA=1 npm run indexnow` muestra
// lo que se enviaría sin enviarlo.
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const avisar = (texto) => console.log(`[indexnow] ${texto}`);

try {
  const config = readFileSync('astro.config.mjs', 'utf8');
  const sitio = config.match(/site:\s*['"]([^'"]+)['"]/)?.[1]?.replace(/\/$/, '');
  if (!sitio) throw new Error('no encontré `site` en astro.config.mjs');

  // La llave es un archivo public/<llave>.txt cuyo contenido es la misma llave
  const archivoLlave = readdirSync('public').find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  if (!archivoLlave) throw new Error('falta el archivo de la llave en public/ (<32 caracteres hexadecimales>.txt)');
  const llave = archivoLlave.replace('.txt', '');

  // Las URL salen del sitemap ya construido en dist/
  const leer = (f) => readFileSync(`dist/${f}`, 'utf8');
  const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  let urls = [];
  if (existsSync('dist/sitemap-index.xml')) {
    for (const mapa of locs(leer('sitemap-index.xml'))) urls.push(...locs(leer(new URL(mapa).pathname.slice(1))));
  } else if (existsSync('dist/sitemap.xml')) {
    urls = locs(leer('sitemap.xml'));
  } else {
    throw new Error('no hay sitemap en dist/; corre `npm run build` antes');
  }
  urls = urls.filter((u) => u.startsWith(sitio));
  if (!urls.length) throw new Error('el sitemap no tiene URL de ' + sitio);

  const cuerpo = { host: new URL(sitio).host, key: llave, keyLocation: `${sitio}/${archivoLlave}`, urlList: urls };
  // INDEXNOW_PRUEBA=1 muestra lo que se enviaría, sin enviarlo
  if (process.env.INDEXNOW_PRUEBA) {
    console.log(JSON.stringify(cuerpo, null, 2));
    process.exit(0);
  }

  const respuesta = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(cuerpo),
  });
  // 200 y 202 son aceptadas; 403 = la llave no se encuentra publicada; 422 = URL de otro dominio
  avisar(`${urls.length} páginas enviadas, respuesta ${respuesta.status}`);
} catch (error) {
  avisar(`no se envió: ${error.message}`);
}
