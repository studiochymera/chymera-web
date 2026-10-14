// Prefijo relativo hasta la raíz del sitio, para que las rutas no empiecen con "/".
// "/" -> "./", "/planes/" -> "../", "/planes/negocio/" -> "../../"
export function raiz(pathname: string): string {
  const niveles = pathname.split('/').filter(Boolean).length;
  return niveles === 0 ? './' : '../'.repeat(niveles);
}

export function enlaceWhatsApp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
