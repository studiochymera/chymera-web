// Datos compartidos de la demo Filo Barbería: textos del JSON, contacto de Chymera y schema del negocio.
import site from '../../../data/site.json';
import d from '../../../data/demos/barberia.json';
import { schemaNegocio } from '../../../base/schema';
import { hora, enlaceWhatsApp } from '../../../base/formato';

export const demo = site.demos.lista.find((x) => x.slug === 'barberia')!;
export const textosBase = site.demos.textosBase;

export const contacto = {
  whatsapp: enlaceWhatsApp(site.whatsapp, demo.whatsappTexto),
  numeroWhatsApp: site.whatsapp,
  textoWhatsApp: demo.whatsappTexto,
  telefono: d.negocio.telefono,
  telefonoEnlace: `tel:${d.negocio.telefonoEnlace}`,
  correo: site.correo,
  instagram: `https://www.instagram.com/${site.instagram}/`,
};

export const horario = d.horario.map((h) => ({ ...h, rango: `${hora(h.abre)} a ${hora(h.cierra)}` }));

export const servicios = [...d.servicios.grupos.flatMap((g) => g.items), d.servicios.casa];

export function schemaFilo(url: string, sitio: URL | undefined) {
  return schemaNegocio({
    tipo: d.negocio.tipo,
    nombre: d.negocio.nombre,
    descripcion: d.negocio.descripcion,
    url,
    imagen: new URL('demos/barberia/og.jpg', sitio).href,
    direccion: { barrio: d.negocio.barrio, ciudad: d.negocio.ciudad, region: d.negocio.region },
    horario: d.horario.map((h) => ({ dias: h.schema, abre: h.abre, cierra: h.cierra })),
    rangoPrecios: d.negocio.rangoPrecios,
    servicios: servicios.map((s) => ({ nombre: s.nombre, precio: s.precio })),
  });
}

export { d };
