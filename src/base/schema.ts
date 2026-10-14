// Base técnica de Chymera: datos estructurados del negocio para Google (schema.org).
// Los datos deben ser idénticos a los de Google Business.

export interface Horario {
  dias: string[]; // en inglés, como pide schema.org: ['Monday', 'Tuesday']
  abre: string; // '07:00'
  cierra: string; // '21:00'
}

export interface DatosSchema {
  tipo: string; // HairSalon, HealthClub, ExerciseGym, DaySpa, BeautySalon, SportsActivityLocation...
  nombre: string;
  descripcion: string;
  url: string;
  imagen?: string;
  telefono?: string;
  correo?: string;
  direccion: { calle?: string; barrio?: string; ciudad: string; region?: string; pais?: string };
  horario?: Horario[];
  redes?: string[];
  rangoPrecios?: string;
  servicios?: { nombre: string; precio: number }[];
}

export function schemaNegocio(d: DatosSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': d.tipo,
    name: d.nombre,
    description: d.descripcion,
    url: d.url,
    ...(d.imagen && { image: d.imagen }),
    ...(d.telefono && { telephone: d.telefono }),
    ...(d.correo && { email: d.correo }),
    address: {
      '@type': 'PostalAddress',
      ...(d.direccion.calle && { streetAddress: d.direccion.calle }),
      addressLocality: d.direccion.ciudad,
      ...(d.direccion.region && { addressRegion: d.direccion.region }),
      addressCountry: d.direccion.pais ?? 'CO',
    },
    ...(d.horario && {
      openingHoursSpecification: d.horario.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.dias,
        opens: h.abre,
        closes: h.cierra,
      })),
    }),
    ...(d.redes?.length && { sameAs: d.redes }),
    ...(d.rangoPrecios && { priceRange: d.rangoPrecios }),
    ...(d.servicios?.length && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios',
        itemListElement: d.servicios.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.nombre },
          price: s.precio,
          priceCurrency: 'COP',
        })),
      },
    }),
  };
}

export function schemaPreguntas(preguntas: { p: string; r: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map((q) => ({
      '@type': 'Question',
      name: q.p,
      acceptedAnswer: { '@type': 'Answer', text: q.r },
    })),
  };
}
