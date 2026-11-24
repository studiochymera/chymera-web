// Piezas de la marca Ensamble: geometría y composiciones.
// Cada pieza es un cuadrilátero con un radio por esquina. Con eso salen todas las formas de la marca:
// cuadro, cuarto de círculo (una esquina con radio igual al lado), triángulo (una esquina colapsada),
// círculo, píldora, gota y cúpula. Como todas comparten la misma descripción, una pieza puede
// convertirse en otra con una interpolación simple: es lo que hace el motor de src/scripts/mesa.ts.
// Este archivo lo usan tanto Astro (para dibujar el SVG inicial, sin JavaScript) como el motor.

export type Punto = [number, number];

export interface Forma {
  c: [Punto, Punto, Punto, Punto]; // esquinas en el cuadrado unidad: sup-izq, sup-der, inf-der, inf-izq
  r: [number, number, number, number]; // radio de cada esquina, relativo al lado corto de la pieza
}

const CUADRO: Forma['c'] = [[0, 0], [1, 0], [1, 1], [0, 1]];
const MEDIO: Punto = [0.5, 0.5];

export const FORMAS = {
  cuadro: { c: CUADRO, r: [0, 0, 0, 0] },
  // Cuartos de círculo: el número dice qué esquina es la curva (0 sup-izq, 1 sup-der, 2 inf-der, 3 inf-izq).
  q0: { c: CUADRO, r: [1, 0, 0, 0] },
  q1: { c: CUADRO, r: [0, 1, 0, 0] },
  q2: { c: CUADRO, r: [0, 0, 1, 0] },
  q3: { c: CUADRO, r: [0, 0, 0, 1] },
  // Triángulos rectángulos: el número dice dónde está el ángulo recto.
  t0: { c: [[0, 0], [1, 0], MEDIO, [0, 1]], r: [0, 0, 0, 0] },
  t1: { c: [[0, 0], [1, 0], [1, 1], MEDIO], r: [0, 0, 0, 0] },
  t2: { c: [MEDIO, [1, 0], [1, 1], [0, 1]], r: [0, 0, 0, 0] },
  t3: { c: [[0, 0], MEDIO, [1, 1], [0, 1]], r: [0, 0, 0, 0] },
  // Triángulo isósceles con la punta arriba (montaña, flecha).
  iso: { c: [[0.5, 0], [0.75, 0.5], [1, 1], [0, 1]], r: [0, 0, 0, 0] },
  circulo: { c: CUADRO, r: [0.5, 0.5, 0.5, 0.5] },
  gota: { c: CUADRO, r: [0.5, 0.5, 0, 0.5] },
} satisfies Record<string, Forma>;

export type NombreForma = keyof typeof FORMAS;

export const COLORES = {
  P: '#F5F5F0', // papel
  M: '#14213D', // medianoche
  Y: '#FCC931', // maíz
  T: '#0E1424', // tinta
  G: '#D5D9E1', // gris claro
  L: '#E6E9EF', // gris muy claro
  S: '#3B4A6B', // pizarra
  W: '#FFFFFF',
} as const;
export type Color = keyof typeof COLORES;

// Una pieza en una composición: forma, posición y tamaño en la retícula de 12 x 12, color, giro en grados
// y radios propios opcionales (un número para las cuatro esquinas o uno por esquina).
export type Entrada = [NombreForma, number, number, number, number, Color, number?, (number | [number, number, number, number])?];

export interface Estado {
  x: number; y: number; w: number; h: number; rot: number; // rot en grados
  c: number[]; // 8 números: esquinas
  r: number[]; // 4 radios
  rgb: number[]; // 3 números
}

export function hexARgb(hex: string): number[] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function estado(e: Entrada): Estado {
  const [forma, x, y, w, h, color, rot = 0, radios] = e;
  const f = FORMAS[forma];
  const r = radios === undefined ? [...f.r] : typeof radios === 'number' ? [radios, radios, radios, radios] : [...radios];
  return { x, y, w, h, rot, c: f.c.flat(), r, rgb: hexARgb(COLORES[color]) };
}

interface Esquina { P: Punto; ent?: Punto; sal?: Punto; radio: number; horario: boolean }

// Geometría de una pieza en píxeles: sus cuatro esquinas, cada una con su curva (si tiene).
// `s` es la escala (píxeles por unidad de retícula).
function esquinas(p: Estado, s: number, dx: number, dy: number): Esquina[] | null {
  const w = p.w * s, h = p.h * s;
  if (w < 0.01 || h < 0.01) return null;
  const cx = (p.x + p.w / 2) * s + dx, cy = (p.y + p.h / 2) * s + dy;
  const a = (p.rot * Math.PI) / 180, co = Math.cos(a), si = Math.sin(a);
  const pts: Punto[] = [];
  for (let i = 0; i < 4; i++) {
    const u = (p.c[i * 2] - 0.5) * w, v = (p.c[i * 2 + 1] - 0.5) * h;
    pts.push([cx + u * co - v * si, cy + u * si + v * co]);
  }
  const corto = Math.min(w, h);
  // Distancia de tangencia deseada por esquina y ángulo de la esquina.
  const t: number[] = [], tanMedio: number[] = [], giro: number[] = [];
  for (let i = 0; i < 4; i++) {
    const P = pts[i], A = pts[(i + 3) % 4], B = pts[(i + 1) % 4];
    const ax = A[0] - P[0], ay = A[1] - P[1], bx = B[0] - P[0], by = B[1] - P[1];
    const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
    giro.push((P[0] - A[0]) * (B[1] - P[1]) - (P[1] - A[1]) * (B[0] - P[0]));
    if (la < 1e-6 || lb < 1e-6 || p.r[i] <= 0) { t.push(0); tanMedio.push(0); continue; }
    const cos = Math.max(-1, Math.min(1, (ax * bx + ay * by) / (la * lb)));
    const th = Math.acos(cos);
    if (th < 0.02 || th > Math.PI - 0.02) { t.push(0); tanMedio.push(0); continue; }
    const tm = Math.tan(th / 2);
    tanMedio.push(tm);
    t.push((p.r[i] * corto) / tm);
  }
  // Que dos curvas vecinas no se pisen en el mismo lado.
  const f = [1, 1, 1, 1];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    const L = Math.hypot(pts[j][0] - pts[i][0], pts[j][1] - pts[i][1]);
    const suma = t[i] + t[j];
    if (suma > L + 1e-6) {
      const k = L / suma;
      f[i] = Math.min(f[i], k);
      f[j] = Math.min(f[j], k);
    }
  }
  return pts.map((P, i) => {
    const ti = t[i] * f[i];
    if (ti < 0.01) return { P, radio: 0, horario: false };
    const A = pts[(i + 3) % 4], B = pts[(i + 1) % 4];
    const la = Math.hypot(A[0] - P[0], A[1] - P[1]), lb = Math.hypot(B[0] - P[0], B[1] - P[1]);
    return {
      P,
      ent: [P[0] + ((A[0] - P[0]) / la) * ti, P[1] + ((A[1] - P[1]) / la) * ti],
      sal: [P[0] + ((B[0] - P[0]) / lb) * ti, P[1] + ((B[1] - P[1]) / lb) * ti],
      radio: ti * tanMedio[i],
      horario: giro[i] > 0,
    };
  });
}

// Trazo SVG de una pieza (para el dibujo inicial que hace Astro y para el taller).
export function trazo(p: Estado, s = 1, dx = 0, dy = 0): string {
  const es = esquinas(p, s, dx, dy);
  if (!es) return '';
  const n = (v: number) => (Math.round(v * 100) / 100).toString();
  let d = '';
  es.forEach((e, i) => {
    const L = i === 0 ? 'M' : 'L';
    if (!e.ent || !e.sal) { d += L + n(e.P[0]) + ' ' + n(e.P[1]); return; }
    d += L + n(e.ent[0]) + ' ' + n(e.ent[1]);
    d += 'A' + n(e.radio) + ' ' + n(e.radio) + ' 0 0 ' + (e.horario ? 1 : 0) + ' ' + n(e.sal[0]) + ' ' + n(e.sal[1]);
  });
  return d + 'Z';
}

// La misma pieza, trazada directo en un lienzo (sin pasar por texto: es lo que corre en cada cuadro).
export function trazarEn(ctx: CanvasRenderingContext2D, p: Estado, s: number, dx = 0, dy = 0): boolean {
  const es = esquinas(p, s, dx, dy);
  if (!es) return false;
  ctx.beginPath();
  es.forEach((e, i) => {
    if (!e.ent || !e.sal) {
      if (i === 0) ctx.moveTo(e.P[0], e.P[1]); else ctx.lineTo(e.P[0], e.P[1]);
      return;
    }
    if (i === 0) ctx.moveTo(e.ent[0], e.ent[1]); else ctx.lineTo(e.ent[0], e.ent[1]);
    ctx.arcTo(e.P[0], e.P[1], e.sal[0], e.sal[1], e.radio);
  });
  ctx.closePath();
  return true;
}

export function rgbACss(rgb: number[]): string {
  return `rgb(${rgb.map((v) => Math.round(Math.max(0, Math.min(255, v)))).join(' ')})`;
}

// ---------------------------------------------------------------------------------------------
// Composiciones. Retícula de 12 x 12. La pieza i de una composición se convierte en la pieza i de la
// siguiente; las que sobran se encogen hasta desaparecer donde estaban.
// ---------------------------------------------------------------------------------------------

// Generador pseudoaleatorio con semilla: el SVG del servidor y el motor dan las mismas posiciones.
export function azar(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// El símbolo: dos cuartos de círculo y un triángulo, con 0,3 de separación.
function simbolo(x: number, y: number, tam: number, tinta: Color, acento: Color): Entrada[] {
  const s = (tam - 0.3) / 2;
  return [
    ['q0', x, y, s, s, tinta],
    ['q3', x, y + s + 0.3, s, s, tinta],
    ['t0', x + s + 0.3, y, s, s, acento],
  ];
}

// Piezas pequeñas que flotan alrededor del símbolo en la portada.
const SATELITES: [NombreForma, number, number, number, Color, number][] = [
  ['circulo', 0.6, 1.2, 0.7, 'Y', 0],
  ['t2', 10.4, 0.7, 0.9, 'M', 0],
  ['q1', 10.9, 5.2, 0.7, 'G', 0],
  ['cuadro', 0.4, 6.4, 0.55, 'M', 18],
  ['q2', 1.3, 10.6, 0.8, 'Y', 0],
  ['circulo', 6.6, 11.0, 0.45, 'M', 0],
  ['t1', 10.2, 9.9, 0.85, 'Y', 0],
  ['iso', 7.3, 0.2, 0.7, 'G', 12],
  ['cuadro', 11.0, 7.6, 0.4, 'Y', 30],
  ['q3', 4.3, 0.3, 0.55, 'M', 0],
  ['circulo', 3.3, 11.2, 0.35, 'G', 0],
  ['gota', 0.2, 3.6, 0.6, 'G', 45],
  ['t3', 8.8, 11.0, 0.5, 'M', 0],
];

export function portadaLogo(): Entrada[] {
  return [
    ...simbolo(2, 2, 8, 'M', 'Y'),
    ...SATELITES.map(([f, x, y, t, c, r]) => [f, x, y, t, t, c, r] as Entrada),
  ];
}

// Las mismas piezas, desarmadas y regadas por la mesa.
export function portadaSuelta(semilla = 7): Entrada[] {
  const rnd = azar(semilla);
  return portadaLogo().map((e, i) => {
    const grande = i < 3;
    const tam = grande ? 2.2 + rnd() * 0.9 : e[3] * (0.8 + rnd() * 0.6);
    const x = 0.4 + rnd() * (11.2 - tam);
    const y = 0.4 + rnd() * (11.2 - tam);
    const rot = (rnd() - 0.5) * 140;
    return [e[0], x, y, tam, tam, e[5], rot] as Entrada;
  });
}

// Recorrido "Lo que armamos": sobre fondo medianoche.
export const RECORRIDO: Record<string, Entrada[]> = {
  marca: [
    ['q0', 2.5, 1.0, 3.5, 3.5, 'P'],
    ['q1', 6.0, 1.0, 3.5, 3.5, 'Y'],
    ['q3', 2.5, 4.5, 3.5, 3.5, 'P'],
    ['q2', 6.0, 4.5, 3.5, 3.5, 'P'],
    ['t2', 4.75, 3.25, 2.5, 2.5, 'M'],
    ['cuadro', 2.5, 9.2, 2.1, 2.1, 'P', 0, 0.12],
    ['cuadro', 5.0, 9.2, 2.1, 2.1, 'Y', 0, 0.12],
    ['cuadro', 7.5, 9.2, 2.1, 2.1, 'S', 0, 0.12],
  ],
  web: [
    ['cuadro', 1, 1.8, 10, 8.4, 'P', 0, 0.04],
    ['cuadro', 1, 1.8, 10, 1.1, 'G', 0, [0.32, 0.32, 0, 0]],
    ['circulo', 1.45, 2.15, 0.4, 0.4, 'M'],
    ['circulo', 2.0, 2.15, 0.4, 0.4, 'Y'],
    ['circulo', 2.55, 2.15, 0.4, 0.4, 'S'],
    ['cuadro', 1.6, 3.5, 4.6, 3.6, 'M', 0, 0.06],
    ['circulo', 4.4, 3.9, 1.2, 1.2, 'Y'],
    ['iso', 2.0, 5.0, 3.0, 2.1, 'S'],
    ['cuadro', 6.7, 3.7, 3.7, 0.55, 'M', 0, 0.5],
    ['cuadro', 6.7, 4.55, 2.9, 0.55, 'M', 0, 0.5],
    ['cuadro', 6.7, 5.45, 3.4, 0.32, 'G', 0, 0.5],
    ['cuadro', 6.7, 6.0, 2.6, 0.32, 'G', 0, 0.5],
    ['cuadro', 6.7, 6.65, 2.1, 0.75, 'Y', 0, 0.5],
    ['cuadro', 1.6, 7.7, 2.75, 1.9, 'G', 0, 0.08],
    ['cuadro', 4.62, 7.7, 2.75, 1.9, 'G', 0, 0.08],
    ['cuadro', 7.64, 7.7, 2.75, 1.9, 'G', 0, 0.08],
  ],
  mapa: [
    ['cuadro', 1, 1, 10, 10, 'L', 0, 0.05],
    ['cuadro', 1, 6.3, 10, 0.7, 'W'],
    ['cuadro', 4.4, 1, 0.7, 10, 'W'],
    ['cuadro', 5.1, 3.4, 5.9, 0.45, 'W'],
    ['q2', 7.6, 7.6, 3.4, 3.4, 'G', 0, [0, 0, 1, 0]],
    ['cuadro', 5.6, 7.6, 1.5, 1.6, 'G', 0, 0.1],
    ['cuadro', 1.6, 7.6, 2.3, 2.8, 'G', 0, 0.08],
    ['gota', 6.15, 1.55, 2.7, 2.7, 'Y', 45],
    ['circulo', 7.0, 2.4, 1.0, 1.0, 'M'],
    ['circulo', 6.7, 5.25, 1.6, 0.45, 'S'],
    ['cuadro', 1.5, 1.5, 2.6, 1.5, 'W', 0, 0.14],
    ['cuadro', 1.8, 1.85, 1.7, 0.32, 'M', 0, 0.5],
    ['circulo', 1.8, 2.4, 0.32, 0.32, 'Y'],
    ['cuadro', 2.25, 2.4, 1.4, 0.32, 'G', 0, 0.5],
  ],
  mensajes: [
    ['cuadro', 3.4, 0.6, 5.2, 10.8, 'T', 0, 0.12],
    ['cuadro', 3.7, 1.4, 4.6, 9.2, 'P', 0, 0.05],
    ['cuadro', 5.3, 0.85, 1.4, 0.3, 'S', 0, 0.5],
    ['cuadro', 3.7, 1.4, 4.6, 1.1, 'M', 0, [0.21, 0.21, 0, 0]],
    ['circulo', 3.95, 1.62, 0.65, 0.65, 'Y'],
    ['cuadro', 4.8, 1.78, 1.8, 0.32, 'P', 0, 0.5],
    ['cuadro', 3.95, 3.0, 2.9, 1.0, 'G', 0, [0.35, 0.35, 0.35, 0]],
    ['cuadro', 5.1, 4.4, 2.95, 1.35, 'Y', 0, [0.3, 0.3, 0, 0.3]],
    ['cuadro', 3.95, 6.1, 2.3, 0.9, 'G', 0, [0.35, 0.35, 0.35, 0]],
    ['cuadro', 5.6, 7.3, 2.45, 0.9, 'Y', 0, [0.35, 0.35, 0, 0.35]],
    ['cuadro', 3.95, 9.3, 3.2, 0.85, 'G', 0, 0.5],
    ['circulo', 7.3, 9.3, 0.85, 0.85, 'M'],
  ],
  crece: [
    ['cuadro', 1.5, 10.2, 9, 0.22, 'P'],
    ['cuadro', 2.0, 7.4, 1.5, 2.8, 'S'],
    ['cuadro', 4.1, 5.9, 1.5, 4.3, 'S'],
    ['cuadro', 6.2, 4.2, 1.5, 6.0, 'P'],
    ['cuadro', 8.3, 2.3, 1.5, 7.9, 'Y'],
    ['iso', 8.3, 0.7, 1.5, 1.25, 'Y'],
    ['cuadro', 1.5, 1.2, 4.4, 2.4, 'W', 0, 0.1],
    ['cuadro', 1.85, 1.6, 2.0, 0.4, 'M', 0, 0.5],
    ['cuadro', 1.85, 2.3, 3.4, 0.8, 'Y', 0, 0.2],
  ],
  final: [
    ...simbolo(2, 2, 8, 'P', 'Y'),
    ['circulo', 0.6, 1.2, 0.7, 0.7, 'Y'],
    ['t2', 10.4, 0.7, 0.9, 0.9, 'S'],
    ['q2', 1.3, 10.6, 0.8, 0.8, 'Y'],
    ['t1', 10.2, 9.9, 0.85, 0.85, 'Y'],
    ['cuadro', 0.4, 6.4, 0.55, 0.55, 'S', 18],
  ],
};

export const ORDEN_RECORRIDO = ['marca', 'web', 'mapa', 'mensajes', 'crece', 'final'] as const;
