// Datos y utilidades de la demo Forja (gimnasio, plan Negocio).
// Los textos viven en src/data/demos/gimnasio.json; el contacto es el de Chymera (site.json).
import d from '../../../data/demos/gimnasio.json';
import site from '../../../data/site.json';
import { raiz, enlaceWhatsApp, pesos, hora } from '../../../base/formato';
import { schemaNegocio } from '../../../base/schema';

export const datos = d;
export const textosBase = site.demos.textosBase;

const demo = site.demos.lista.find((x) => x.slug === 'gimnasio')!;

export const contacto = {
  whatsapp: site.whatsapp,
  whatsappTexto: demo.whatsappTexto,
  enlaceWhatsApp: enlaceWhatsApp(site.whatsapp, demo.whatsappTexto),
  correo: site.correo,
  instagram: `https://www.instagram.com/${site.instagram}/`,
  telefono: d.telefonoVisible,
  enlaceTelefono: `tel:${d.telefonoEnlace}`,
};

// Rutas relativas: a la raíz del sitio (Chymera) y a las páginas de la demo.
export function rutas(pathname: string) {
  const sitio = raiz(pathname);
  const inicio = `${sitio}demos/gimnasio/`;
  return { sitio, inicio, a: (ruta: string) => `${inicio}${ruta}` };
}

export function precio(valor: number | string): string {
  return typeof valor === 'number' ? pesos(valor) : valor;
}

// "$159.000" -> "159.000" para los números grandes en contorno
export function cifraPesos(valor: number): string {
  return pesos(valor).replace('$', '');
}

export function rangoHora(abre: string, cierra: string): string {
  return `${hora(abre)} – ${hora(cierra)}`;
}

export function schemaForja(url: string, conServicios = false): object {
  const servicios = conServicios
    ? [
        ...d.membresias.planes.map((p) => ({ nombre: `Membresía ${p.nombre}`, precio: p.precio })),
        ...d.servicios.flatMap((g) => g.items).filter((s): s is { nombre: string; detalle: string; precio: number } => typeof s.precio === 'number'),
      ]
    : undefined;
  return schemaNegocio({
    tipo: d.tipoSchema,
    nombre: d.nombre,
    descripcion: d.descripcionNegocio,
    url,
    direccion: { barrio: d.barrio, ciudad: d.ciudad, region: d.region },
    horario: d.horario.map((h) => ({ dias: h.schema, abre: h.abre, cierra: h.cierra })),
    rangoPrecios: d.rangoPrecios,
    servicios,
  });
}
