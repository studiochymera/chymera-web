// La quimera en 3D de la portada: una escultura de la quimera del logo (hecha con Higgsfield,
// public/modelos/quimera.glb, comprimida con meshopt) en cerámica azul mate, sobre la sala crema.
// Arranca en la misma pose y con la misma luz que la foto que la reemplaza, gira despacio sola,
// con el mouse o el dedo (arrastrando de lado) y un poco con el desplazamiento.
// Se carga aparte y solo después de la intro, para no frenar el primer pintado. Si el equipo no
// tiene WebGL o algo falla, se queda la foto, que ya está en la página.
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
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Pose de la foto (src/assets/marca/quimera-escultura.png): la foto se sacó con estos mismos valores.
const POSE = 1.0;
// Vuelta sola: una vuelta completa cada ~80 s.
const VUELTA = 0.08;

// Le devuelve el turno al navegador entre pasos pesados, para que la página no se congele.
const ceder = () => new Promise<void>((listo) => setTimeout(listo, 0));

// sala: la figura con la foto y la cartela. escena: dónde va el lienzo, del mismo tamaño que la foto.
export async function montarQuimera(sala: HTMLElement, escenaHtml: HTMLElement) {
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

  // Cerámica azul de marca, mate: así se lee el volumen sin marcar las facetas de la malla.
  const material = new MeshPhysicalMaterial({
    color: '#1d2a3a',
    metalness: 0.1,
    roughness: 0.55,
    clearcoat: 0.25,
    clearcoatRoughness: 0.45,
    envMapIntensity: 0.7,
  });
  escultura.traverse((o) => {
    if (o instanceof Mesh) o.material = material;
  });
  // Centrada en el origen y de 2 unidades en su lado más largo.
  const caja = new Box3().setFromObject(escultura);
  const medida = caja.getSize(new Vector3());
  escultura.position.sub(caja.getCenter(new Vector3()));
  const giro = new Group();
  giro.add(escultura);
  giro.scale.setScalar(2 / Math.max(medida.x, medida.z));
  giro.rotation.y = POSE;
  escena.add(giro);

  // Luz de estudio: principal cálida arriba a la izquierda, relleno frío y un contraluz celeste.
  const principal = new DirectionalLight('#fff4e8', 2.2);
  principal.position.set(-3, 4, 4);
  const relleno = new DirectionalLight('#dfe8f5', 0.6);
  relleno.position.set(4, 1, 2);
  const contraluz = new DirectionalLight('#279bf2', 2.5);
  contraluz.position.set(3, 2, -4);
  escena.add(principal, relleno, contraluz);

  const camara = new PerspectiveCamera(22, 1400 / 1064, 0.1, 50);
  camara.position.set(0, 0.45, 5.6);
  camara.lookAt(0, -0.05, 0);

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
  // Donde el navegador lo permite, los sombreadores se preparan sin frenar la página.
  if (pintor.extensions.has('KHR_parallel_shader_compile')) await pintor.compileAsync(escena, camara);
  new ResizeObserver(ajustar).observe(lienzo);

  // Giro: la vuelta sola, lo que suma la persona al arrastrar (con inercia) y el desplazamiento.
  const estado = { arrastre: 0, inercia: 0, scroll: 0, vuelta: 0, puntero: 0 };
  let arrastrando = false;
  let ultimoX = 0;

  lienzo.addEventListener('pointerdown', (e) => {
    arrastrando = true;
    ultimoX = e.clientX;
    estado.inercia = 0;
    lienzo.setPointerCapture(e.pointerId);
  });
  lienzo.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    const paso = ((e.clientX - ultimoX) / lienzo.clientWidth) * Math.PI * 1.6;
    ultimoX = e.clientX;
    estado.arrastre += paso;
    estado.inercia = paso;
  });
  const soltar = () => (arrastrando = false);
  lienzo.addEventListener('pointerup', soltar);
  lienzo.addEventListener('pointercancel', soltar);

  // Con mouse, la pieza se asoma apenas hacia el cursor.
  const portada = sala.closest('section') ?? sala;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const irX = gsap.quickTo(estado, 'puntero', { duration: 1.4, ease: 'power3.out' });
    portada.addEventListener('pointermove', (e) => irX((e.clientX / window.innerWidth - 0.5) * 0.3));
    portada.addEventListener('pointerleave', () => irX(0));
  }

  ScrollTrigger.create({
    trigger: portada,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (s) => (estado.scroll = s.progress),
  });

  const pintar = (_t: number, delta: number) => {
    const segundos = Math.min(delta, 50) / 1000;
    if (!arrastrando) {
      estado.vuelta += VUELTA * segundos;
      estado.arrastre += estado.inercia;
      estado.inercia *= 0.92;
    }
    giro.rotation.y = POSE + estado.vuelta + estado.arrastre + estado.puntero + estado.scroll * 1.2;
    pintor.render(escena, camara);
  };

  // Solo se pinta mientras se ve. El primer cuadro es igual a la foto: el cambio no se nota.
  let activa = false;
  pintar(0, 0);
  sala.dataset.estado = '3d';
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting === activa) return;
    activa = e.isIntersecting;
    if (activa) gsap.ticker.add(pintar);
    else gsap.ticker.remove(pintar);
  }).observe(escenaHtml);
}
