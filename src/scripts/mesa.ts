// Motor de la mesa de piezas: cada pieza es un resorte que persigue su lugar en la composición actual.
// Cambiar de composición = darle a cada pieza un destino nuevo, con un pequeño retraso por pieza para
// que se arme en ola. Las piezas que se mueven rápido se "levantan" (sombra más larga y van encima).
// Sin este script se ve el SVG que dibuja Astro con la composición inicial; con movimiento reducido
// las piezas cambian de lugar sin animación.
import { estado, trazarEn, rgbACss, portadaLogo, portadaSuelta, RECORRIDO, type Entrada, type Estado } from '../lib/piezas';

const N_VAL = 20; // x y w h rot · 8 esquinas · 4 radios · 3 color
const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function aPlano(e: Estado, dest: Float32Array, o = 0) {
  dest[o] = e.x;
  dest[o + 1] = e.y;
  dest[o + 2] = e.w;
  dest[o + 3] = e.h;
  dest[o + 4] = e.rot;
  for (let i = 0; i < 8; i++) dest[o + 5 + i] = e.c[i];
  for (let i = 0; i < 4; i++) dest[o + 13 + i] = e.r[i];
  for (let i = 0; i < 3; i++) dest[o + 17 + i] = e.rgb[i];
}

function dePlano(a: Float32Array, o: number, dx = 0, dy = 0, drot = 0, escala = 1): Estado {
  const w = a[o + 2] * escala,
    h = a[o + 3] * escala;
  return {
    x: a[o] + dx - (w - a[o + 2]) / 2,
    y: a[o + 1] + dy - (h - a[o + 3]) / 2,
    w,
    h,
    rot: a[o + 4] + drot,
    c: Array.from(a.subarray(o + 5, o + 13)),
    r: Array.from(a.subarray(o + 13, o + 17)),
    rgb: Array.from(a.subarray(o + 17, o + 20)),
  };
}

class Mesa {
  el: HTMLElement;
  lienzo: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  n: number;
  pos: Float32Array;
  vel: Float32Array;
  dest: Float32Array;
  pendiente: { cuando: number; valores: Float32Array }[] = [];
  // Empujón del puntero, por pieza: x, y, giro y su velocidad.
  emp: Float32Array;
  empV: Float32Array;
  puntero: { x: number; y: number; activo: boolean } = { x: 0, y: 0, activo: false };
  flotar = false;
  oscuro: boolean;
  escala = 1;
  dpr = 1;
  visible = true;
  corriendo = false;
  ultimo = 0;
  reloj = 0;
  lev: Float32Array; // cuánto está levantada cada pieza (0 a 1)

  constructor(el: HTMLElement, n: number, inicial: Entrada[]) {
    this.el = el;
    this.n = n;
    this.oscuro = el.dataset.fondo === 'oscuro';
    this.lienzo = document.createElement('canvas');
    this.lienzo.className = 'mesa-lienzo';
    this.lienzo.setAttribute('aria-hidden', 'true');
    el.querySelector('.mesa-escena')!.appendChild(this.lienzo);
    this.ctx = this.lienzo.getContext('2d')!;
    this.pos = new Float32Array(n * N_VAL);
    this.vel = new Float32Array(n * N_VAL);
    this.dest = new Float32Array(n * N_VAL);
    this.emp = new Float32Array(n * 3);
    this.empV = new Float32Array(n * 3);
    this.lev = new Float32Array(n);
    // Las piezas que aún no se usan esperan en el centro, encogidas.
    for (let i = 0; i < n; i++) {
      const o = i * N_VAL;
      this.dest[o] = 6;
      this.dest[o + 1] = 6;
      this.dest.set([0, 0, 1, 0, 1, 1, 0, 1], o + 5);
      this.dest.set(this.oscuro ? [245, 245, 240] : [20, 33, 61], o + 17);
    }
    this.colocar(inicial, true);

    new ResizeObserver(() => this.medir()).observe(el);
    new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.despertar();
    }).observe(el);
    this.medir();
  }

  medir() {
    const r = this.lienzo.parentElement!.getBoundingClientRect();
    // En pantallas táctiles basta con 1,5: se ve igual de nítido y pinta mucho menos.
    this.dpr = Math.min(window.devicePixelRatio || 1, fino ? 2 : 1.5);
    this.lienzo.width = Math.round(r.width * this.dpr);
    this.lienzo.height = Math.round(r.height * this.dpr);
    this.escala = r.width / 12;
    this.dibujar();
    this.el.classList.add('mesa-viva');
  }

  // Lleva cada pieza a la composición. Con `ya`, sin animación.
  colocar(comp: Entrada[], ya = false, ola = 38) {
    const ahora = performance.now();
    const orden = comp.map((e, i) => ({ i, d: Math.hypot(e[1] + e[3] / 2 - 6, e[2] + e[4] / 2 - 6) })).sort((a, b) => a.d - b.d);
    const rango = new Map(orden.map((o, k) => [o.i, k]));
    this.pendiente = [];
    for (let i = 0; i < this.n; i++) {
      const o = i * N_VAL;
      const v = new Float32Array(N_VAL);
      if (comp[i]) {
        aPlano(estado(comp[i]), v);
      } else {
        // La pieza sobra: se encoge en su sitio.
        v.set(this.dest.subarray(o, o + N_VAL));
        v[0] += v[2] / 2;
        v[1] += v[3] / 2;
        v[2] = 0;
        v[3] = 0;
      }
      if (ya || quieto) {
        this.dest.set(v, o);
        this.pos.set(v, o);
        this.vel.fill(0, o, o + N_VAL);
      } else {
        const espera = comp[i] ? (rango.get(i) ?? 0) * ola : 0;
        this.pendiente.push({ cuando: ahora + espera, valores: Object.assign(v, { i }) as Float32Array & { i: number } });
      }
    }
    if (ya || quieto) this.dibujar();
    else this.despertar();
  }

  despertar() {
    if (this.corriendo || !this.visible) return;
    this.corriendo = true;
    this.ultimo = performance.now();
    requestAnimationFrame((t) => this.paso(t));
  }

  paso(t: number) {
    const dt = Math.min(0.034, (t - this.ultimo) / 1000);
    this.ultimo = t;
    this.reloj += dt;
    // Destinos que ya tocan.
    this.pendiente = this.pendiente.filter((p) => {
      if (p.cuando > t) return true;
      this.dest.set(p.valores, (p.valores as Float32Array & { i: number }).i * N_VAL);
      return false;
    });
    let energia = this.integrar(dt);
    energia += this.empujar(dt);
    this.dibujar();
    const sigue = this.visible && (energia > 0.0005 || this.pendiente.length > 0 || this.flotar || this.puntero.activo);
    if (sigue) requestAnimationFrame((tt) => this.paso(tt));
    else this.corriendo = false;
  }

  integrar(dt: number) {
    let energia = 0;
    const sub = 2,
      h = dt / sub;
    for (let s = 0; s < sub; s++) {
      for (let i = 0; i < this.n; i++) {
        const o = i * N_VAL;
        for (let k = 0; k < N_VAL; k++) {
          // Posición y tamaño con un poco de rebote; forma y color más firmes.
          const rigidez = k < 5 ? 150 : 210;
          const amort = k < 5 ? 17 : 29;
          const j = o + k;
          const a = rigidez * (this.dest[j] - this.pos[j]) - amort * this.vel[j];
          this.vel[j] += a * h;
          this.pos[j] += this.vel[j] * h;
        }
      }
    }
    for (let i = 0; i < this.n; i++) {
      const o = i * N_VAL;
      const rapidez = Math.hypot(this.vel[o], this.vel[o + 1]) + Math.abs(this.vel[o + 4]) / 60;
      const objetivo = Math.min(1, rapidez / 9);
      this.lev[i] += (objetivo - this.lev[i]) * Math.min(1, dt * 10);
      for (let k = 0; k < N_VAL; k++) {
        const e = this.dest[o + k] - this.pos[o + k];
        energia += e * e * (k < 5 ? 1 : k < 17 ? 4 : 0.0001) + this.vel[o + k] * this.vel[o + k] * 0.001;
      }
    }
    return energia;
  }

  empujar(dt: number) {
    let energia = 0;
    for (let i = 0; i < this.n; i++) {
      const o = i * N_VAL,
        e = i * 3;
      let fx = 0,
        fy = 0,
        fr = 0;
      if (this.puntero.activo) {
        const cx = this.pos[o] + this.pos[o + 2] / 2,
          cy = this.pos[o + 1] + this.pos[o + 3] / 2;
        const dx = cx - this.puntero.x,
          dy = cy - this.puntero.y;
        const d = Math.hypot(dx, dy);
        const radio = 2.6 + Math.max(this.pos[o + 2], this.pos[o + 3]) * 0.35;
        if (d < radio && d > 0.001) {
          const fuerza = (1 - d / radio) ** 2 * 60;
          fx = (dx / d) * fuerza;
          fy = (dy / d) * fuerza;
          fr = (dx > 0 ? 1 : -1) * fuerza * 3;
        }
      }
      for (let k = 0; k < 3; k++) {
        const f = k === 0 ? fx : k === 1 ? fy : fr;
        const a = f - 90 * this.emp[e + k] - 13 * this.empV[e + k];
        this.empV[e + k] += a * dt;
        this.emp[e + k] += this.empV[e + k] * dt;
        energia += this.emp[e + k] * this.emp[e + k] * (k === 2 ? 0.0001 : 1);
      }
    }
    return energia;
  }

  dibujar() {
    const { ctx, escala: s, dpr } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.lienzo.width, this.lienzo.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const orden = Array.from({ length: this.n }, (_, i) => i).sort((a, b) => this.lev[a] - this.lev[b]);
    const estados = orden.map((i) => {
      const o = i * N_VAL,
        e = i * 3;
      let dx = this.emp[e],
        dy = this.emp[e + 1];
      const dr = this.emp[e + 2];
      if (this.flotar && i >= 3) {
        dx += Math.sin(this.reloj * (0.5 + (i % 5) * 0.13) + i * 1.7) * 0.16;
        dy += Math.cos(this.reloj * (0.4 + (i % 4) * 0.11) + i * 2.3) * 0.2;
      }
      return {
        i,
        e: dePlano(
          this.pos,
          o,
          dx,
          dy,
          dr + (this.flotar && i >= 3 ? Math.sin(this.reloj * 0.6 + i) * 6 : 0),
          1 + this.lev[i] * 0.06,
        ),
      };
    });
    // Sombras primero, para que ninguna caiga encima de otra pieza quieta.
    for (const { i, e } of estados) {
      const l = this.lev[i];
      const off = (0.1 + l * 0.32) * s;
      if (!trazarEn(ctx, e, s, off, off * 1.2)) continue;
      ctx.fillStyle = this.oscuro ? `rgba(4,8,20,${0.32 + l * 0.18})` : `rgba(14,20,36,${0.09 + l * 0.12})`;
      ctx.fill();
    }
    for (const { e } of estados) {
      if (!trazarEn(ctx, e, s)) continue;
      ctx.fillStyle = rgbACss(e.rgb);
      ctx.fill();
    }
  }
}

// Todo arranca cuando la página ya cargó y el navegador está libre: mientras tanto se ve el SVG.
function cuandoLibre(fn: () => void) {
  const ir = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200));
  if (document.readyState === 'complete') ir();
  else window.addEventListener('load', ir, { once: true });
}

cuandoLibre(iniciarPortada);
cuandoLibre(iniciarRecorrido);

// ---------------------------------------------------------------------------------------------
// Portada: las piezas llegan regadas y se arman en el símbolo. Se pueden empujar con el puntero y
// el botón las desarma y las vuelve a armar.
function iniciarPortada() {
  document.querySelectorAll<HTMLElement>('[data-mesa="portada"]').forEach((el) => {
    const logo = portadaLogo();
    const suelta = portadaSuelta();
    const mesa = new Mesa(el, logo.length, suelta);
    let armada = false;
    const boton = el.querySelector<HTMLButtonElement>('[data-mesa-boton]');
    const armar = (si: boolean) => {
      armada = si;
      // Las piezas pequeñas flotan solo en computador; en celular se quedan quietas al armarse (batería).
      mesa.flotar = si && !quieto && fino;
      mesa.colocar(si ? logo : portadaSuelta(Math.floor(Math.random() * 1e6)), false, si ? 55 : 14);
      if (boton) {
        boton.textContent = si ? boton.dataset.desarmar! : boton.dataset.armar!;
        boton.setAttribute('aria-pressed', String(!si));
      }
    };
    // Un respiro antes de armarse, para que se vea que eran piezas sueltas.
    setTimeout(() => armar(true), quieto ? 0 : 450);
    boton?.addEventListener('click', () => armar(!armada));

    if (!quieto && fino) {
      const escena = el.querySelector<HTMLElement>('.mesa-escena')!;
      escena.addEventListener('pointermove', (ev) => {
        const r = escena.getBoundingClientRect();
        mesa.puntero = { x: ((ev.clientX - r.left) / r.width) * 12, y: ((ev.clientY - r.top) / r.height) * 12, activo: true };
        mesa.despertar();
      });
      escena.addEventListener('pointerleave', () => {
        mesa.puntero.activo = false;
      });
    }
  });
}

// ---------------------------------------------------------------------------------------------
// Recorrido: cada paso del texto cambia la composición cuando cruza la mitad de la pantalla.
function iniciarRecorrido() {
  document.querySelectorAll<HTMLElement>('[data-mesa="recorrido"]').forEach((el) => {
    const seccion = el.closest<HTMLElement>('[data-recorrido]')!;
    const pasos = Array.from(seccion.querySelectorAll<HTMLElement>('[data-paso]'));
    const n = Math.max(...Object.values(RECORRIDO).map((c) => c.length));
    const primero = pasos[0]?.dataset.paso ?? 'marca';
    const mesa = new Mesa(el, n, RECORRIDO[primero]);
    const marcas = Array.from(seccion.querySelectorAll<HTMLElement>('[data-marca-paso]'));
    let actual = primero;
    const ir = (nombre: string) => {
      if (nombre === actual || !RECORRIDO[nombre]) return;
      actual = nombre;
      mesa.colocar(RECORRIDO[nombre], false, 30);
      pasos.forEach((p) => p.toggleAttribute('data-activo', p.dataset.paso === nombre));
      marcas.forEach((m) => m.toggleAttribute('data-activo', m.dataset.marcaPaso === nombre));
    };
    seccion.classList.add('vivo');
    pasos[0]?.setAttribute('data-activo', '');
    marcas[0]?.setAttribute('data-activo', '');
    const io = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && ir((e.target as HTMLElement).dataset.paso!)),
      // En celular la mesa ocupa la parte de arriba: el paso cambia cuando su texto llega al último tercio.
      { rootMargin: window.matchMedia('(min-width: 1024px)').matches ? '-48% 0px -48% 0px' : '-58% 0px -41% 0px' },
    );
    pasos.forEach((p) => io.observe(p));
  });
}
