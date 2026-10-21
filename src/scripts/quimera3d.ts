// La quimera en 3D: cuando termina de trazarse en la portada, aparece de perfil y aplanada, como el
// logo, toma volumen y queda girando despacio, siguiendo al mouse y al desplazamiento.
// La figura es una escultura de la quimera del logo hecha con Higgsfield (public/modelos/quimera.glb,
// comprimida con meshopt).
// Se carga aparte y solo después del trazo, para no frenar el primer pintado. Si el equipo no tiene
// WebGL o algo falla, se queda la quimera en línea, que ya está en la página.
import {
  ACESFilmicToneMapping,
  Box3,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// El lienzo mide 1,5 veces la caja de la quimera (ver .quimera-3d en Portada.astro).
const MARGEN = 1.5;

// Arma la figura por partes y le devuelve el turno al navegador entre una y otra,
// para que la página no se congele si la persona toca algo mientras tanto.
const ceder = () => new Promise<void>((listo) => setTimeout(listo, 0));

// origen: la quimera en línea, que se queda si algo falla. destino: dónde va el lienzo
// (encima del trazo en computador, detrás del celular en pantallas pequeñas).
export async function montarQuimera(origen: HTMLElement, destino: HTMLElement) {
  // El modelo se pide antes que nada, mientras se prepara el resto.
  const cargador = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const modelo = cargador.loadAsync(new URL('modelos/quimera.glb', document.baseURI).href);

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

  let escultura: Group;
  try {
    escultura = (await modelo).scene;
  } catch {
    pintor.dispose();
    return;
  }
  await ceder();

  // Cerámica satinada en azul de marca: el brillo justo para leer el volumen sin marcar las facetas
  // de la malla. El contraluz celeste le dibuja los bordes sobre el fondo azul.
  const material = new MeshPhysicalMaterial({
    color: '#1d2a3a',
    metalness: 0.35,
    roughness: 0.4,
    clearcoat: 0.6,
    clearcoatRoughness: 0.28,
    envMapIntensity: 0.65,
  });
  escultura.traverse((o) => {
    if (o instanceof Mesh) o.material = material;
  });
  // El modelo mira hacia +z; un cuarto de vuelta lo deja de perfil mirando a la derecha, como el logo.
  const perfil = new Group();
  perfil.rotation.y = Math.PI / 2;
  perfil.add(escultura);
  const caja = new Box3().setFromObject(perfil);
  escultura.position.sub(caja.getCenter(escultura.position.clone()).applyAxisAngle(perfil.up, -Math.PI / 2));
  // figura aplana la escultura hacia la cámara para la entrada. Mide 2 de ancho, como el trazo.
  const k = 2 / (caja.max.x - caja.min.x);
  const figura = new Group();
  figura.add(perfil);
  figura.scale.set(k, k, k * 0.02);
  const giro = new Group();
  giro.add(figura);
  escena.add(giro);

  const principal = new DirectionalLight('#fdf8f4', 1.2);
  principal.position.set(3, 4, 5);
  const contraluz = new DirectionalLight('#279bf2', 6);
  contraluz.position.set(-4, 1.5, -3);
  escena.add(principal, contraluz);

  // Cámara de lente larga: de frente, la figura plana queda sobre el trazo.
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
