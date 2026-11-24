// Taller: tablero de 3 x 3 para armar un logo con las piezas de la marca.
// Cada toque cambia la forma de la casilla; el color sale del selector. La foto de perfil se
// actualiza con lo que se arme.
import { estado, trazo, type NombreForma } from '../lib/piezas';

const CICLO: (NombreForma | null)[] = [null, 'q0', 'q1', 'q2', 'q3', 't0', 't1', 't2', 't3', 'cuadro', 'circulo'];
const tipo = (f: NombreForma | null) =>
  f === null ? 'vacia' : f.startsWith('q') ? 'cuarto' : f.startsWith('t') ? 'triangulo' : (f as string);

document.querySelectorAll<HTMLElement>('[data-taller]').forEach((el) => {
  const casillas = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-casilla]'));
  const avatar = el.querySelector<HTMLElement>('[data-taller-avatar]')!;
  const plantilla = el.dataset.casilla!;
  const nombres = JSON.parse(el.dataset.formas!) as Record<string, string>;
  const colorActual = () => el.querySelector<HTMLInputElement>('input[name="taller-color"]:checked')?.value ?? '#14213D';

  // Empieza con el símbolo de Chymera y un par de piezas sueltas.
  const tablero: { f: NombreForma | null; c: string }[] = [
    { f: 'q0', c: '#14213D' }, { f: 't0', c: '#FCC931' }, { f: null, c: '#14213D' },
    { f: 'q3', c: '#14213D' }, { f: null, c: '#14213D' }, { f: 'circulo', c: '#FCC931' },
    { f: null, c: '#14213D' }, { f: 't2', c: '#3B4A6B' }, { f: 'q2', c: '#14213D' },
  ];

  const d = (f: NombreForma | null) => (f ? trazo(estado([f, 0.5, 0.5, 11, 11, 'M'])) : 'M6 6Z');

  const pintar = () => {
    tablero.forEach((t, i) => {
      const b = casillas[i];
      const p = b.querySelector('path')!;
      p.setAttribute('d', d(t.f));
      p.setAttribute('fill', t.c);
      b.setAttribute('aria-label', plantilla.replace('{n}', String(i + 1)).replace('{forma}', nombres[tipo(t.f)] ?? ''));
    });
    const piezas = tablero
      .map((t, i) => (t.f ? `<path transform="translate(${(i % 3) * 12} ${Math.floor(i / 3) * 12})" d="${d(t.f)}" fill="${t.c}"/>` : ''))
      .join('');
    avatar.innerHTML = `<svg viewBox="-6 -6 48 48" aria-hidden="true">${piezas}</svg>`;
  };

  casillas.forEach((b, i) => {
    b.addEventListener('click', () => {
      const t = tablero[i];
      const color = colorActual();
      // Si cambió el color, el primer toque solo pinta; si no, pasa a la siguiente forma.
      if (t.f && t.c !== color) t.c = color;
      else {
        t.f = CICLO[(CICLO.indexOf(t.f) + 1) % CICLO.length];
        t.c = color;
      }
      pintar();
    });
  });

  el.querySelector('[data-taller-mezclar]')?.addEventListener('click', () => {
    const colores = Array.from(el.querySelectorAll<HTMLInputElement>('input[name="taller-color"]')).map((i) => i.value);
    tablero.forEach((t) => {
      t.f = Math.random() < 0.28 ? null : CICLO[1 + Math.floor(Math.random() * (CICLO.length - 1))];
      t.c = colores[Math.random() < 0.55 ? 0 : 1 + Math.floor(Math.random() * (colores.length - 1))];
    });
    pintar();
  });
  el.querySelector('[data-taller-limpiar]')?.addEventListener('click', () => {
    tablero.forEach((t) => { t.f = null; });
    pintar();
  });

  pintar();
});
