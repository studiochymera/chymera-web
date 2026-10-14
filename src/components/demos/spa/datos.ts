// Datos y utilidades de la demo Bruma Spa (plan Reservas). Los textos viven en src/data/demos/spa.json.
import spa from '../../../data/demos/spa.json';
import site from '../../../data/site.json';
import { hora, raiz, rellenar, enlaceWhatsApp } from '../../../base/formato';
import { schemaNegocio } from '../../../base/schema';

export { spa, site };

export const demo = site.demos.lista.find((d) => d.slug === 'spa')!;
export const whatsapp = enlaceWhatsApp(spa.contacto.whatsapp, demo.whatsappTexto);

export type Servicio = (typeof spa.servicios.grupos)[number]['items'][number] & { grupo: string };

export const servicios: Servicio[] = spa.servicios.grupos.flatMap((g) => g.items.map((s) => ({ ...s, grupo: g.titulo })));
export const reservables = servicios.filter((s) => s.reservable);
if (reservables.length !== 8) throw new Error(`[spa] Deben ser exactamente 8 servicios reservables y hay ${reservables.length}.`);

export const minutos = (n: number) => rellenar(spa.servicios.minutos, { n: String(n) });

// Prefijo hasta la portada de la demo, para rutas relativas: "../" desde /demos/spa/servicios/.
export function rutas(pathname: string) {
  const r = raiz(pathname);
  const base = `${r}demos/spa/`;
  return {
    raiz: r,
    base,
    a: (ruta: string) => `${base}${ruta}`,
    reservar: (id?: string) => `${base}reservas/${id ? `?servicio=${id}` : ''}`,
  };
}

// Filas del horario con horas legibles: "9:00 a. m. a 7:00 p. m." o "Cerrado".
export const horario = spa.horario.map((f) => ({
  dias: f.dias,
  corto: f.corto,
  cerrado: Boolean(f.cerrado),
  horas: f.cerrado ? spa.textosHorario.cerrado : rellenar(spa.textosHorario.rango, { abre: hora(f.abre!), cierra: hora(f.cierra!) }),
}));

export function schemaSpa(url: string, site: URL | undefined, conServicios = false) {
  return schemaNegocio({
    tipo: spa.negocio.tipoSchema,
    nombre: spa.negocio.nombre,
    descripcion: spa.negocio.descripcionSchema,
    url,
    imagen: new URL('demos/spa/og.jpg', site).href,
    direccion: { barrio: spa.negocio.barrio, ciudad: spa.negocio.ciudad, region: spa.negocio.region },
    horario: spa.horario.filter((f) => !f.cerrado).map((f) => ({ dias: f.schema!, abre: f.abre!, cierra: f.cierra! })),
    rangoPrecios: spa.negocio.rangoPrecios,
    servicios: conServicios ? servicios.map((s) => ({ nombre: s.nombre, precio: s.precio })) : undefined,
  });
}
