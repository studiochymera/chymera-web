// El local en miniatura de la sección Proceso: un local de barrio en 3D que se arma por partes,
// una por cada paso. 1 Hablamos: la base. 2 Borrador: las paredes en plano, como un dibujo.
// 3 Ajustamos: las paredes se vuelven sólidas y aparece el toldo. 4 Publicamos: se prenden la
// vitrina y el letrero celeste. 5 Te acompañamos: las plantas y la luz de la puerta.
// En computador avanza con el desplazamiento por los pasos; en celular se arma solo una vez
// cuando aparece. Todo se arma con geometría (no hay modelo que descargar).
// Si el equipo no tiene WebGL o la persona pidió menos movimiento, queda la foto del local
// terminado, que se sacó de esta misma escena (armarLocal con el progreso en 5).
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const PASOS = 5;

// Medidas del local.
const ANCHO = 1.8;
const FONDO = 1.3;
const ALTO = 1.9;
const PISO = 0.12;

const suave = (t: number) => 1 - Math.pow(1 - t, 3);
const tramo = (p: number, desde: number) => Math.min(1, Math.max(0, p - desde));

// Sombra suave bajo la base (una sombra de verdad se cortaría en el borde del lienzo).
function crearMancha() {
  const lienzo = document.createElement('canvas');
  lienzo.width = lienzo.height = 128;
  const c = lienzo.getContext('2d')!;
  const degradado = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  degradado.addColorStop(0, 'rgb(4 5 7 / 0.45)');
  degradado.addColorStop(0.6, 'rgb(4 5 7 / 0.15)');
  degradado.addColorStop(1, 'rgb(4 5 7 / 0)');
  c.fillStyle = degradado;
  c.fillRect(0, 0, 128, 128);
  return new CanvasTexture(lienzo);
}

// Lo que se ve por la vitrina: luz cálida que cae de arriba, repisas y algunos objetos.
function crearInterior(repisas: boolean) {
  const lienzo = document.createElement('canvas');
  lienzo.width = 256;
  lienzo.height = 220;
  const c = lienzo.getContext('2d')!;
  const luz = c.createLinearGradient(0, 0, 0, 220);
  luz.addColorStop(0, '#ffd9a3');
  luz.addColorStop(1, '#c98a4e');
  c.fillStyle = luz;
  c.fillRect(0, 0, 256, 220);
  c.fillStyle = 'rgb(60 40 25 / 0.55)';
  if (repisas) {
    for (const y of [70, 130]) {
      c.fillRect(20, y, 150, 6);
      for (let x = 28; x < 160; x += 26) c.fillRect(x, y - 18 - (x % 3) * 4, 14, 18 + (x % 3) * 4);
    }
    c.fillRect(150, 160, 90, 60);
    c.fillStyle = 'rgb(60 40 25 / 0.35)';
    c.beginPath();
    c.arc(200, 25, 14, 0, Math.PI);
    c.fill();
  } else {
    c.fillRect(0, 150, 256, 70);
  }
  const textura = new CanvasTexture(lienzo);
  textura.colorSpace = SRGBColorSpace;
  return textura;
}

export function armarLocal() {
  const escena = new Scene();

  const crema = new MeshStandardMaterial({ color: '#f3ece4', roughness: 0.85 });
  const crema2 = new MeshStandardMaterial({ color: '#e3d8ca', roughness: 0.9 });
  const azul = new MeshStandardMaterial({ color: '#2f4058', roughness: 0.7 });
  const paredes = new MeshStandardMaterial({ color: '#f3ece4', roughness: 0.85, transparent: true, opacity: 0 });
  const vidrio = new MeshStandardMaterial({ color: '#1a2533', roughness: 0.3, emissive: '#ffffff', emissiveMap: crearInterior(true), emissiveIntensity: 0 });
  const ventana = new MeshStandardMaterial({ color: '#1a2533', roughness: 0.3, emissive: '#ffffff', emissiveMap: crearInterior(false), emissiveIntensity: 0 });
  const letrero = new MeshStandardMaterial({ color: '#279bf2', roughness: 0.4, emissive: '#279bf2', emissiveIntensity: 0 });
  const verde = new MeshStandardMaterial({ color: '#7d9a86', roughness: 0.9 });
  const trazo = new LineBasicMaterial({ color: '#279bf2', transparent: true, opacity: 0 });

  const local = new Group();
  const caja = (an: number, al: number, fo: number, material: MeshStandardMaterial, x: number, y: number, z: number, radio = 0.015) => {
    const malla = new Mesh(new RoundedBoxGeometry(an, al, fo, 2, radio), material);
    malla.position.set(x, y, z);
    return malla;
  };

  // 1. Base: un disco de piedra con el borde azul.
  const base = new Group();
  const disco = new Mesh(new CylinderGeometry(1.55, 1.55, PISO, 72), crema2);
  disco.position.y = PISO / 2;
  const borde = new Mesh(new CylinderGeometry(1.57, 1.57, 0.05, 72), azul);
  borde.position.y = 0.025;
  base.add(borde, disco);
  base.add(caja(ANCHO + 0.1, 0.05, FONDO + 0.1, crema, 0, PISO + 0.025, 0));
  local.add(base);

  // 2. Paredes: primero en plano (líneas celestes), luego sólidas.
  const muros = new Group();
  const cuerpo = new Mesh(new BoxGeometry(ANCHO, ALTO, FONDO), paredes);
  cuerpo.position.y = PISO + 0.05 + ALTO / 2;
  const plano = new LineSegments(new EdgesGeometry(cuerpo.geometry), trazo);
  plano.position.copy(cuerpo.position);
  muros.add(cuerpo, plano);
  // En el plano también se dibujan la puerta, la vitrina, las ventanas y el toldo.
  const dibujo = (an: number, al: number, x: number, y: number) => {
    const linea = new LineSegments(new EdgesGeometry(new PlaneGeometry(an, al)), trazo);
    linea.position.set(x, y, FONDO / 2 + 0.01);
    plano.add(linea);
    linea.position.y -= plano.position.y;
  };
  dibujo(0.42, 1.0, 0.55, PISO + 0.05 + 0.5);
  dibujo(1.0, 0.86, -0.3, PISO + 0.05 + 0.58);
  for (let i = 0; i < 3; i++) dibujo(0.34, 0.38, -0.56 + i * 0.56, PISO + 0.05 + 1.63);
  dibujo(1.26, 0.2, -0.05, PISO + 0.05 + 1.05);
  local.add(muros);

  // 3. Detalles que llegan con las paredes sólidas: cornisa, techo, puerta, marcos y toldo.
  const detalles = new Group();
  const frente = FONDO / 2;
  const suelo = PISO + 0.05;
  detalles.add(caja(ANCHO + 0.12, 0.12, FONDO + 0.12, crema2, 0, suelo + ALTO + 0.02, 0));
  detalles.add(caja(ANCHO + 0.04, 0.12, FONDO + 0.04, azul, 0, suelo + ALTO + 0.14, 0));
  // Puerta.
  detalles.add(caja(0.42, 1.0, 0.05, azul, 0.55, suelo + 0.5, frente + 0.01));
  const pomo = new Mesh(new SphereGeometry(0.025, 16, 12), crema2);
  pomo.position.set(0.42, suelo + 0.5, frente + 0.05);
  detalles.add(pomo);
  // Marco de la vitrina y de las ventanas de arriba.
  detalles.add(caja(1.0, 0.86, 0.05, azul, -0.3, suelo + 0.58, frente + 0.005));
  for (let i = 0; i < 3; i++) detalles.add(caja(0.34, 0.38, 0.05, azul, -0.56 + i * 0.56, suelo + 1.63, frente + 0.005));
  // Toldo a rayas, inclinado.
  const toldo = new Group();
  const rayas = 8;
  const anchoRaya = 1.26 / rayas;
  for (let i = 0; i < rayas; i++) {
    const raya = caja(anchoRaya, 0.03, 0.46, i % 2 ? crema : azul, -0.68 + anchoRaya * (i + 0.5), 0, 0.23, 0.008);
    toldo.add(raya);
    const faldon = caja(anchoRaya, 0.09, 0.03, i % 2 ? crema : azul, -0.68 + anchoRaya * (i + 0.5), -0.04, 0.46, 0.008);
    toldo.add(faldon);
  }
  toldo.position.set(0, suelo + 1.12, frente);
  toldo.rotation.x = 0.42;
  detalles.add(toldo);
  // Materiales propios: los detalles aparecen con transparencia sin afectar la base ni las plantas.
  detalles.traverse((o) => {
    if (o instanceof Mesh) o.material = (o.material as MeshStandardMaterial).clone();
  });
  local.add(detalles);

  // 4. Luces: vitrina y ventanas encendidas, letrero celeste.
  const luces = new Group();
  luces.add(caja(0.9, 0.76, 0.02, vidrio, -0.3, suelo + 0.58, frente + 0.04, 0.004));
  for (let i = 0; i < 3; i++) luces.add(caja(0.26, 0.3, 0.02, ventana, -0.56 + i * 0.56, suelo + 1.63, frente + 0.04, 0.004));
  const cartel = caja(0.9, 0.17, 0.06, letrero, -0.3, suelo + 1.3, frente + 0.07, 0.03);
  luces.add(cartel);
  const brillo = new PointLight('#ffc98a', 0, 4, 2);
  brillo.position.set(-0.3, suelo + 0.6, frente + 0.7);
  luces.add(brillo);
  local.add(luces);

  // 5. Plantas en materas a los lados de la puerta y la vitrina.
  const plantas = new Group();
  for (const [x, z] of [
    [-0.98, frente + 0.25],
    [0.98, frente + 0.2],
  ]) {
    const matera = new Mesh(new CylinderGeometry(0.11, 0.09, 0.2, 24), crema);
    matera.position.set(x, suelo + 0.1, z);
    const hojas = new Mesh(new SphereGeometry(0.16, 24, 16), verde);
    hojas.position.set(x, suelo + 0.32, z);
    hojas.scale.y = 1.25;
    plantas.add(matera, hojas);
  }
  local.add(plantas);

  local.rotation.y = -0.55;
  escena.add(local);

  const mancha = new Mesh(new PlaneGeometry(4.2, 4.2), new MeshBasicMaterial({ map: crearMancha(), transparent: true, depthWrite: false }));
  mancha.rotation.x = -Math.PI / 2;
  mancha.position.y = -0.01;
  escena.add(mancha);

  // Luz de estudio sobre el azul de la sección: principal cálida, cielo frío y contraluz celeste.
  escena.add(new HemisphereLight('#e8eef6', '#1d2a3a', 1.1));
  const sol = new DirectionalLight('#fff1e0', 2.2);
  sol.position.set(4, 6, 5);
  const contraluz = new DirectionalLight('#279bf2', 1.4);
  contraluz.position.set(-4, 3, -3);
  escena.add(sol, contraluz);

  const camara = new PerspectiveCamera(26, 1, 0.1, 50);
  camara.position.set(0, 2.9, 7.4);
  camara.lookAt(0, 0.95, 0);

  // Lleva el local al progreso p (de 0 a 5 pasos).
  const avanzar = (p: number) => {
    const t1 = suave(tramo(p, 0));
    base.scale.setScalar(0.6 + 0.4 * t1);
    base.position.y = (1 - t1) * -0.3;
    base.visible = t1 > 0.001;
    mancha.material.opacity = t1;

    const t2 = suave(tramo(p, 1));
    const t3 = suave(tramo(p, 2));
    trazo.opacity = t2 * (1 - t3);
    plano.visible = trazo.opacity > 0.01;
    plano.scale.y = 0.2 + 0.8 * t2;
    plano.position.y = PISO + 0.05 + (ALTO * plano.scale.y) / 2;
    paredes.opacity = t3;
    paredes.depthWrite = t3 > 0.95;
    cuerpo.visible = t3 > 0.001;
    detalles.visible = t3 > 0.001;
    detalles.scale.setScalar(0.9 + 0.1 * t3);
    detalles.position.y = (1 - t3) * 0.25;
    toldo.rotation.x = 0.42 + (1 - t3) * -1.2;
    detalles.traverse((o) => {
      if (o instanceof Mesh) {
        const m = o.material as MeshStandardMaterial;
        m.transparent = t3 < 1;
        m.opacity = t3;
      }
    });

    const t4 = suave(tramo(p, 3));
    luces.visible = t3 > 0.001;
    vidrio.emissiveIntensity = 1.1 * t4;
    ventana.emissiveIntensity = 0.9 * t4;
    letrero.emissiveIntensity = 1.1 * t4;
    letrero.opacity = t3;
    letrero.transparent = t3 < 1;
    brillo.intensity = 2.5 * t4;

    const t5 = suave(tramo(p, 4));
    plantas.visible = t5 > 0.001;
    plantas.children.forEach((o, i) => {
      o.scale.setScalar(Math.max(0.001, t5));
      if (i % 2) o.scale.y *= 1.25;
    });
  };

  return { escena, camara, local, avanzar };
}

export function prepararPintor(lienzo: HTMLCanvasElement, maxDpr: number) {
  const pintor = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: true, powerPreference: 'high-performance' });
  pintor.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  pintor.outputColorSpace = SRGBColorSpace;
  pintor.toneMapping = ACESFilmicToneMapping;
  return pintor;
}

// Le devuelve el turno al navegador entre pasos pesados, para que la página no se congele.
const ceder = () => new Promise<void>((listo) => setTimeout(listo, 0));

// marco: el bloque con la foto del local terminado. escenaHtml: dónde va el lienzo.
// pasos: la lista de pasos, que marca el avance en computador.
export async function montarLocal(marco: HTMLElement, escenaHtml: HTMLElement, pasos: HTMLElement) {
  const tactil = window.matchMedia('(pointer: coarse)').matches;
  const lienzo = document.createElement('canvas');
  lienzo.className = 'local-3d';
  let pintor: WebGLRenderer;
  try {
    pintor = prepararPintor(lienzo, tactil ? 1.5 : 2);
  } catch {
    return;
  }
  const { escena, camara, local, avanzar } = armarLocal();
  await ceder();

  const ajustar = () => {
    const ancho = lienzo.clientWidth;
    const alto = lienzo.clientHeight;
    if (!ancho || !alto) return;
    pintor.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
  };
  escenaHtml.append(lienzo);
  ajustar();
  if (pintor.extensions.has('KHR_parallel_shader_compile')) await pintor.compileAsync(escena, camara);
  new ResizeObserver(ajustar).observe(lienzo);

  const estado = { progreso: 0, puntero: 0, tiempo: 0 };
  avanzar(0);

  // En computador los pasos van al lado y el local avanza con el desplazamiento por ellos.
  // En celular y tableta el local va encima de los pasos y se arma solo, una vez, al aparecer.
  const media = gsap.matchMedia();
  media.add('(min-width: 1024px)', () => {
    const disparo = ScrollTrigger.create({
      trigger: pasos,
      start: 'top 65%',
      end: 'bottom 70%',
      scrub: 0.6,
      onUpdate: (s) => (estado.progreso = s.progress * PASOS),
    });
    return () => disparo.kill();
  });
  media.add('(max-width: 1023px)', () => {
    const disparo = ScrollTrigger.create({
      trigger: escenaHtml,
      start: 'top 75%',
      once: true,
      onEnter: () => gsap.to(estado, { progreso: PASOS, duration: 4.5, ease: 'none' }),
    });
    return () => disparo.kill();
  });

  // Con mouse, el local se asoma apenas hacia el cursor.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const irX = gsap.quickTo(estado, 'puntero', { duration: 1.4, ease: 'power3.out' });
    const seccion = marco.closest('section') ?? marco;
    seccion.addEventListener('pointermove', (e) => irX((e.clientX / window.innerWidth - 0.5) * 0.3));
    seccion.addEventListener('pointerleave', () => irX(0));
  }

  const pintar = (_t: number, delta: number) => {
    estado.tiempo += Math.min(delta, 50) / 1000;
    avanzar(estado.progreso);
    local.rotation.y = -0.55 + estado.puntero + Math.sin(estado.tiempo * 0.3) * 0.04;
    pintor.render(escena, camara);
  };

  // Solo se pinta mientras se ve. La foto (el local terminado) se va cuando el lienzo está listo.
  let activa = false;
  pintar(0, 0);
  marco.dataset.estado = '3d';
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting === activa) return;
    activa = e.isIntersecting;
    if (activa) gsap.ticker.add(pintar);
    else gsap.ticker.remove(pintar);
  }).observe(escenaHtml);
}
