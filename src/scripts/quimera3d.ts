// La quimera del logo en 3D: cuando termina de trazarse en la portada, el dibujo toma volumen
// y queda girando despacio, siguiendo al mouse y al desplazamiento.
// Se carga aparte y solo después del trazo, para no frenar el primer pintado. Si el equipo no tiene
// WebGL o algo falla, se queda la quimera en línea, que ya está en la página.
import {
  ACESFilmicToneMapping,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// El lienzo mide 1,5 veces la caja de la quimera (ver .quimera-3d en Portada.astro).
const MARGEN = 1.5;

// Arma la figura por partes y le devuelve el turno al navegador entre una y otra,
// para que la página no se congele si la persona toca algo mientras tanto.
const ceder = () => new Promise<void>((listo) => setTimeout(listo, 0));

// origen: la quimera en línea, de donde sale la forma. destino: dónde va el lienzo
// (encima del trazo en computador, detrás del celular en pantallas pequeñas).
export async function montarQuimera(origen: HTMLElement, destino: HTMLElement) {
  const trazo = origen.querySelector<SVGSVGElement>('svg');
  const ruta = trazo?.querySelector('path')?.getAttribute('d');
  if (!trazo || !ruta) return;
  const caja = trazo.viewBox.baseVal;

  const lienzo = document.createElement('canvas');
  lienzo.className = 'quimera-3d';
  let pintor: WebGLRenderer;
  try {
    pintor = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return;
  }
  const tactil = window.matchMedia('(pointer: coarse)').matches;
  pintor.setPixelRatio(Math.min(window.devicePixelRatio, tactil ? 1.5 : 2));
  pintor.outputColorSpace = SRGBColorSpace;
  pintor.toneMapping = ACESFilmicToneMapping;

  const escena = new Scene();
  const pmrem = new PMREMGenerator(pintor);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  await ceder();

  // La figura: el mismo trazo del logo, extruido con bisel para que los bordes atrapen la luz.
  const datos = new SVGLoader().parse(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${caja.x} ${caja.y} ${caja.width} ${caja.height}"><path fill-rule="evenodd" d="${ruta}"/></svg>`,
  );
  const formas = datos.paths.flatMap((p) => SVGLoader.createShapes(p));
  await ceder();
  const fondo = caja.width * 0.07;
  const extruida = new ExtrudeGeometry(formas, {
    depth: fondo,
    bevelEnabled: true,
    bevelThickness: fondo * 0.18,
    bevelSize: caja.width * 0.005,
    bevelSegments: tactil ? 2 : 3,
    curveSegments: tactil ? 4 : 6,
  });
  extruida.translate(-(caja.x + caja.width / 2), -(caja.y + caja.height / 2), -fondo / 2);
  await ceder();
  // Curvas lisas y aristas vivas: suaviza la luz en las paredes curvas sin redondear los filos.
  const geometria = toCreasedNormals(extruida, Math.PI / 5);
  extruida.dispose();
  await ceder();

  // Azul de marca lacado: se ve oscuro y el contraluz celeste le dibuja los bordes.
  const material = new MeshPhysicalMaterial({
    color: '#1d2a3a',
    metalness: 0.6,
    roughness: 0.34,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.55,
  });
  const figura = new Mesh(geometria, material);
  // El SVG cuenta y hacia abajo; en 3D va hacia arriba. La figura mide 2 de ancho.
  const k = 2 / caja.width;
  figura.scale.set(k, -k, k * 0.02);
  const giro = new Group();
  giro.add(figura);
  escena.add(giro);

  const principal = new DirectionalLight('#fdf8f4', 1.2);
  principal.position.set(3, 4, 5);
  const contraluz = new DirectionalLight('#279bf2', 6);
  contraluz.position.set(-4, 1.5, -3);
  escena.add(principal, contraluz);

  // Cámara de lente larga: de frente, la figura plana calza exacto sobre el trazo.
  const camara = new PerspectiveCamera(18, 1, 0.1, 50);
  const ajustar = () => {
    const ancho = lienzo.clientWidth;
    const alto = lienzo.clientHeight;
    if (!ancho || !alto) return;
    pintor.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    const altoVisible = (2 * MARGEN * alto) / ancho;
    camara.position.z = altoVisible / 2 / Math.tan((camara.fov * Math.PI) / 360);
    camara.updateProjectionMatrix();
  };
  destino.append(lienzo);
  ajustar();
  // Donde el navegador lo permite, los sombreadores se preparan sin frenar la página.
  if (pintor.extensions.has('KHR_parallel_shader_compile')) await pintor.compileAsync(escena, camara);
  new ResizeObserver(ajustar).observe(lienzo);

  // Estado de la figura: la entrada la lleva de plano a volumen; el mouse y el scroll suman giro.
  const estado = { volumen: 0.02, giroY: 0, giroX: 0, scroll: 0 };
  const puntero = { x: 0, y: 0 };
  let reloj = 0;

  const pintar = (_t: number, delta: number) => {
    reloj += delta / 1000;
    figura.scale.z = k * estado.volumen;
    const vaiven = estado.volumen;
    giro.rotation.y = estado.giroY + Math.sin(reloj * 0.35) * 0.1 * vaiven + puntero.x * 0.35 + estado.scroll * 0.9;
    giro.rotation.x = estado.giroX + Math.sin(reloj * 0.5) * 0.04 * vaiven + puntero.y * 0.2;
    giro.position.y = Math.sin(reloj * 0.6) * 0.025 * vaiven;
    pintor.render(escena, camara);
  };

  const portada = destino.closest('section') ?? destino;
  // Pose final: en computador la cabeza se aleja para no salirse de la pantalla; detrás del celular
  // se acerca para asomarse por el lado.
  const pose = destino === origen ? { giroY: 0.38, giroX: 0.1 } : { giroY: -0.3, giroX: 0.12 };

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const irX = gsap.quickTo(puntero, 'x', { duration: 1.4, ease: 'power3.out' });
    const irY = gsap.quickTo(puntero, 'y', { duration: 1.4, ease: 'power3.out' });
    portada.addEventListener('pointermove', (e) => {
      irX((e.clientX / window.innerWidth - 0.5) * 2);
      irY((e.clientY / window.innerHeight - 0.5) * 2);
    });
    portada.addEventListener('pointerleave', () => {
      irX(0);
      irY(0);
    });
  }

  ScrollTrigger.create({
    trigger: portada,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (s) => (estado.scroll = s.progress),
  });

  // Solo se pinta mientras se ve. La primera vez que se ve, el dibujo plano aparece y toma volumen.
  let activa = false;
  let entro = false;
  pintar(0, 0);
  new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting === activa) return;
      activa = e.isIntersecting;
      if (!activa) return gsap.ticker.remove(pintar);
      gsap.ticker.add(pintar);
      if (entro) return;
      entro = true;
      destino.dataset.estado = '3d';
      origen.dataset.estado = '3d';
      gsap.to(estado, { volumen: 1, ...pose, duration: 2.4, ease: 'expo.inOut', delay: 0.3 });
    },
    { threshold: 0.25 },
  ).observe(destino);
}
