// Base técnica de Chymera: política de datos (completa) o aviso de privacidad (básico)
// llenados con los datos del negocio. Las plantillas viven en src/data/base/legal.json.
import plantillas from '../data/base/legal.json';
import { rellenar } from './formato';

export interface DatosLegales {
  negocio: string;
  responsable: string; // razón social y NIT, o nombre y cédula del dueño
  direccion: string;
  correo: string;
  telefono: string;
  web?: string;
  fecha: string; // "14 de octubre de 2026"
  finalidades?: string[]; // solo completa
  proveedores?: string; // solo completa
  textoReservas?: string; // solo plan Reservas
}

export interface SeccionLegal {
  titulo: string;
  texto?: string[];
  lista?: string[];
}

export interface DocumentoLegal {
  titulo: string;
  descripcion: string;
  intro: string;
  secciones: SeccionLegal[];
}

export function documentoLegal(tipo: 'completa' | 'basica', d: DatosLegales): DocumentoLegal {
  const p = plantillas[tipo];
  const valores: Record<string, string> = {
    negocio: d.negocio,
    responsable: d.responsable,
    direccion: d.direccion,
    correo: d.correo,
    telefono: d.telefono,
    web: d.web ?? '',
    fecha: d.fecha,
    proveedores: d.proveedores ?? '',
    textoReservas: d.textoReservas ?? '',
  };
  const r = (t: string) => rellenar(t, valores);
  return {
    titulo: r(p.titulo),
    descripcion: r(p.descripcion),
    intro: r(p.intro),
    secciones: p.secciones.map((s: { titulo: string; texto?: string[]; lista?: string[] | string }) => ({
      titulo: r(s.titulo),
      texto: s.texto?.map(r).filter((t) => t.trim() !== ''),
      lista: s.lista === '{finalidades}' ? d.finalidades ?? [] : Array.isArray(s.lista) ? s.lista.map(r).filter((t) => !/:\s*$/.test(t)) : undefined,
    })),
  };
}
