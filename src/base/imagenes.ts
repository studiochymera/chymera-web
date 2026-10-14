// Base técnica de Chymera: busca fotos en src/assets por nombre, sin extensión.
// buscarImagen('demos/spa/portada') encuentra src/assets/demos/spa/portada.jpg (o .png, .webp, .avif).
// Si la foto todavía no existe devuelve null y <Imagen> muestra un marcador.
import type { ImageMetadata } from 'astro';

const archivos = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp,avif}');

export async function buscarImagen(ruta: string): Promise<ImageMetadata | null> {
  const clave = Object.keys(archivos).find((k) => k.replace(/\.[a-z]+$/, '') === `/src/assets/${ruta}`);
  return clave ? (await archivos[clave]()).default : null;
}
