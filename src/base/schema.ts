// Base técnica de Chymera: datos estructurados del negocio para Google (schema.org).
// Los datos deben ser idénticos a los del Perfil de Empresa en Google, Bing Places y Apple Business Connect,
// y a lo que se ve en la página: el marcado que no coincide con el texto visible no sirve.

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
  id?: string; // identificador fijo del negocio; por defecto `${url}#negocio`
  imagen?: string;
  telefono?: string;
  correo?: string;
  direccion: { calle?: string; barrio?: string; ciudad: string; region?: string; pais?: string };
  geo?: { lat: number; lng: number }; // coordenadas del pin del Perfil de Empresa
  mapa?: string; // enlace al Perfil de Empresa en Google Maps
  zonas?: string[]; // barrios o localidades que atiende: ['Usaquén', 'Cedritos']
  horario?: Horario[];
  redes?: string[]; // Instagram, Facebook, TikTok y los perfiles de Bing Places y Apple Maps
  rangoPrecios?: string;
  servicios?: { nombre: string; precio: number }[];
}

export function schemaNegocio(d: DatosSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': d.tipo,
    '@id': d.id ?? `${d.url}#negocio`,
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
    ...(d.geo && { geo: { '@type': 'GeoCoordinates', latitude: d.geo.lat, longitude: d.geo.lng } }),
    ...(d.mapa && { hasMap: d.mapa }),
    ...(d.zonas?.length && { areaServed: d.zonas.map((z) => ({ '@type': 'Place', name: z })) }),
    ...(d.horario && {
      openingHoursSpecification: d.horario.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.dias,
        opens: h.abre,
        closes: h.cierra,
      })),
    }),
    ...((d.redes?.length || d.mapa) && { sameAs: [...(d.mapa ? [d.mapa] : []), ...(d.redes ?? [])] }),
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

// Google ya no muestra las preguntas como resultado enriquecido (desde mayo de 2026), pero las usa para entender
// la página. Solo con preguntas y respuestas que se ven en la página.
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

// Página de un servicio (Negocio y Reservas): enlaza el servicio con el negocio por su @id.
export function schemaServicio(s: {
  nombre: string;
  descripcion: string;
  url: string;
  negocio: string; // el @id de schemaNegocio, por ejemplo `${url}#negocio`
  precio?: number; // "desde", en COP
  zonas?: string[];
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.nombre,
    description: s.descripcion,
    url: s.url,
    provider: { '@id': s.negocio },
    ...(s.zonas?.length && { areaServed: s.zonas.map((z) => ({ '@type': 'Place', name: z })) }),
    ...(s.precio && {
      offers: {
        '@type': 'Offer',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: s.precio, priceCurrency: 'COP' },
      },
    }),
  };
}

// Migas de pan para las páginas internas: [{ nombre: 'Inicio', url }, { nombre: 'Masajes', url }].
export function schemaMigas(migas: { nombre: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.nombre, item: m.url })),
  };
}
