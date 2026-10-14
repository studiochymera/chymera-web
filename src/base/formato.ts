// Base técnica de Chymera: formatos para Colombia y enlaces.

// 85000 -> "$85.000"
export function pesos(valor: number): string {
  return `$${Math.round(valor).toLocaleString('es-CO').replace(/[ \s,]/g, '.')}`;
}

// "07:00" -> "7:00 a. m.", "19:30" -> "7:30 p. m."
export function hora(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h < 12 ? 'a. m.' : 'p. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

export function enlaceWhatsApp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function enlaceMapa(consulta: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

// Prefijo relativo hasta la raíz del sitio, para que ninguna ruta empiece con "/".
// "/" -> "./", "/servicios/" -> "../"
export function raiz(pathname: string): string {
  const niveles = pathname.split('/').filter(Boolean).length;
  return niveles === 0 ? './' : '../'.repeat(niveles);
}

// Reemplaza {clave} por su valor: rellenar('Hola {nombre}', { nombre: 'Ana' })
export function rellenar(texto: string, valores: Record<string, string>): string {
  return texto.replace(/\{(\w+)\}/g, (_, k) => valores[k] ?? `{${k}}`);
}
