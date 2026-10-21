// Las pantallas en 3D de la portada: tres páginas web flotando en abanico, dos de vidrio
// esmerilado y una de cerámica azul en el medio, con un solo botón celeste. Todo se arma aquí con
// geometría (no hay modelo que descargar), así que se ve nítido en cualquier pantalla.
// Son un acento que pasa: flotan despacio, se asoman hacia el mouse y, al bajar por la página,
// se abren y giran un poco mientras salen.
// Se carga aparte y solo después de la intro. Si el equipo no tiene WebGL, queda la foto, que
// se sacó de esta misma escena (armarPantallas) en la pose de reposo.
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Pose de reposo del abanico: la foto de respaldo se sacó con estos valores.
const POSE = { y: 0.55, x: 0.06 };
// Medidas de cada pantalla (ancho, alto, grosor).
const ANCHO = 1.5;
const ALTO = 2.0;
const GROSOR = 0.09;
// Dónde va cada pantalla en el abanico: de adelante a la izquierda hacia atrás a la derecha.
const LUGARES = [
  { x: -1.3, y: -0.14, z: 0.35 },
  { x: 0, y: 0.04, z: 0 },
  { x: 1.3, y: 0.22, z: -0.35 },
];

// Una pantalla: la placa y, encima, el dibujo de una página (menú, portada, textos, botón y tres tarjetas).
function crearPantalla(placa: Material, relieve: Material, boton: Material) {
  const pantalla = new Group();
  const caja = (an: number, al: number, gr: number, radio: number, material: Material, x: number, y: number) => {
    const malla = new Mesh(new RoundedBoxGeometry(an, al, gr, 3, radio), material);
    malla.position.set(x, y, GROSOR / 2 + gr / 2 - 0.004);
    pantalla.add(malla);
    return malla;
  };

  pantalla.add(new Mesh(new RoundedBoxGeometry(ANCHO, ALTO, GROSOR, 4, 0.06), placa));

  const izq = -ANCHO / 2;
  const arriba = ALTO / 2;
  // Logo y menú.
  const logo = new Mesh(new CylinderGeometry(0.055, 0.055, 0.02, 32), relieve);
  logo.rotation.x = Math.PI / 2;
  logo.position.set(izq + 0.17, arriba - 0.16, GROSOR / 2 + 0.006);
  pantalla.add(logo);
  for (let i = 0; i < 3; i++) caja(0.13, 0.035, 0.014, 0.012, relieve, ANCHO / 2 - 0.42 + i * 0.16, arriba - 0.16, );
  // Portada de la página: un bloque con titular, texto y botón.
  caja(1.3, 0.78, 0.018, 0.04, relieve, 0, arriba - 0.71);
  caja(0.72, 0.075, 0.016, 0.03, relieve, izq + 0.5, arriba - 0.52).position.z += 0.014;
  caja(0.56, 0.05, 0.016, 0.022, relieve, izq + 0.42, arriba - 0.63).position.z += 0.014;
  caja(0.46, 0.05, 0.016, 0.022, relieve, izq + 0.37, arriba - 0.72).position.z += 0.014;
  caja(0.34, 0.11, 0.03, 0.05, boton, izq + 0.31, arriba - 0.9).position.z += 0.014;
  // Tres tarjetas abajo.
  for (let i = 0; i < 3; i++) {
    const x = -0.43 + i * 0.43;
    caja(0.38, 0.5, 0.018, 0.035, relieve, x, -ALTO / 2 + 0.36);
  }
  return pantalla;
}

// Mancha de sombra: un degradado suave (una sombra de verdad se cortaría en el borde del lienzo).
function crearMancha() {
  const lienzo = document.createElement('canvas');
  lienzo.width = lienzo.height = 128;
  const c = lienzo.getContext('2d')!;
  const degradado = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  degradado.addColorStop(0, 'rgb(29 42 58 / 0.26)');
  degradado.addColorStop(0.5, 'rgb(29 42 58 / 0.1)');
  degradado.addColorStop(1, 'rgb(29 42 58 / 0)');
  c.fillStyle = degradado;
  c.fillRect(0, 0, 128, 128);
  return new CanvasTexture(lienzo);
}

export function armarPantallas() {
  const escena = new Scene();
  // Fondo crema de la página: el vidrio necesita algo detrás para verse vidrio.
  escena.background = new Color('#fdf8f4');

  // Vidrio esmerilado: deja ver, borroso, lo que está detrás.
  const vidrio = new MeshPhysicalMaterial({
    color: '#ffffff',
    emissive: '#ffffff',
    emissiveIntensity: 0.16,
    transmission: 0.92,
    thickness: 0.35,
    roughness: 0.26,
    ior: 1.45,
    envMapIntensity: 1.6,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    attenuationColor: '#f3f5f8',
    attenuationDistance: 2.5,
  });
  const vidrioRelieve = new MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.35, transparent: true, opacity: 0.55, clearcoat: 0.6 });
  const vidrioBoton = new MeshPhysicalMaterial({ color: '#e4e1dc', roughness: 0.4 });
  const azul = new MeshPhysicalMaterial({ color: '#1d2a3a', roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.35 });
  const azulRelieve = new MeshStandardMaterial({ color: '#2a3a50', roughness: 0.6 });
  const celeste = new MeshPhysicalMaterial({ color: '#279bf2', roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });

  const abanico = new Group();
  const pantallas = [
    crearPantalla(vidrio, vidrioRelieve, vidrioBoton),
    crearPantalla(azul, azulRelieve, celeste),
    crearPantalla(vidrio, vidrioRelieve, vidrioBoton),
  ];
  pantallas.forEach((p, i) => {
    p.position.set(LUGARES[i].x, LUGARES[i].y, LUGARES[i].z);
    abanico.add(p);
  });
  abanico.rotation.set(POSE.x, POSE.y, 0);
  escena.add(abanico);

  // Sombra en el piso, debajo del abanico.
  const piso = new Mesh(
    new PlaneGeometry(4.4, 1.6),
    new MeshBasicMaterial({ map: crearMancha(), transparent: true, depthWrite: false }),
  );
  piso.rotation.x = -Math.PI / 2;
  piso.position.y = -1.55;
  escena.add(piso);

  // Luz de estudio: principal cálida arriba a la izquierda, relleno frío y un contraluz suave.
  escena.add(new HemisphereLight('#fffaf3', '#d8cfc4', 0.9));
  // La principal es un foco cercano: cae suave de una esquina a otra de cada pantalla, como en estudio.
  const luz = new PointLight('#fff3e6', 60, 0, 2);
  luz.position.set(-3.2, 3.2, 4.2);
  const relleno = new DirectionalLight('#e1e9f4', 0.6);
  relleno.position.set(5, 1, 3);
  const contraluz = new DirectionalLight('#ffffff', 1.2);
  contraluz.position.set(2, 3, -5);
  escena.add(luz, relleno, contraluz);

  const camara = new PerspectiveCamera(26, 1400 / 1064, 0.1, 50);
  camara.position.set(0, 0.2, 7.1);
  camara.lookAt(0, -0.22, 0);

  return { escena, camara, abanico, pantallas, luz };
}

export function prepararPintor(lienzo: HTMLCanvasElement, maxDpr: number) {
  const pintor = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: true, powerPreference: 'high-performance' });
  pintor.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  pintor.outputColorSpace = SRGBColorSpace;
  pintor.toneMapping = ACESFilmicToneMapping;
  pintor.toneMappingExposure = 0.95;
  return pintor;
}

export function ambiente(pintor: WebGLRenderer, escena: Scene) {
  const pmrem = new PMREMGenerator(pintor);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.9;
  pmrem.dispose();
}

// Le devuelve el turno al navegador entre pasos pesados, para que la página no se congele.
const ceder = () => new Promise<void>((listo) => setTimeout(listo, 0));

// sala: el bloque con la foto. escenaHtml: dónde va el lienzo, del mismo tamaño que la foto.
export async function montarPantallas(sala: HTMLElement, escenaHtml: HTMLElement) {
  const tactil = window.matchMedia('(pointer: coarse)').matches;
  const lienzo = document.createElement('canvas');
  lienzo.className = 'pieza-3d';
  let pintor: WebGLRenderer;
  try {
    pintor = prepararPintor(lienzo, tactil ? 1.5 : 2);
  } catch {
    return;
  }
  const { escena, camara, abanico, pantallas, luz } = armarPantallas();
  ambiente(pintor, escena);
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
  // Donde el navegador lo permite, los sombreadores se preparan sin frenar la página.
  if (pintor.extensions.has('KHR_parallel_shader_compile')) await pintor.compileAsync(escena, camara);
  new ResizeObserver(ajustar).observe(lienzo);

  // Giro: el mouse y el desplazamiento.
  const estado = { punteroX: 0, punteroY: 0, scroll: 0, tiempo: 0 };

  // Con mouse, el abanico se asoma hacia el cursor y la luz lo sigue un poco.
  const portada = sala.closest('section') ?? sala;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const irX = gsap.quickTo(estado, 'punteroX', { duration: 1.4, ease: 'power3.out' });
    const irY = gsap.quickTo(estado, 'punteroY', { duration: 1.4, ease: 'power3.out' });
    portada.addEventListener('pointermove', (e) => {
      irX(e.clientX / window.innerWidth - 0.5);
      irY(e.clientY / window.innerHeight - 0.5);
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

  const reposoLuz = luz.position.x;
  const pintar = (_t: number, delta: number) => {
    estado.tiempo += Math.min(delta, 50) / 1000;
    abanico.rotation.y = POSE.y + estado.punteroX * 0.3 + estado.scroll * 0.35;
    abanico.rotation.x = POSE.x + estado.punteroY * 0.12;
    // Cada pantalla flota a su ritmo; con el desplazamiento el abanico se abre.
    pantallas.forEach((p, i) => {
      const lugar = LUGARES[i];
      const abre = 1 + estado.scroll * 0.6;
      p.position.x = lugar.x * abre;
      p.position.z = lugar.z * abre;
      p.position.y = lugar.y + Math.sin(estado.tiempo * 0.6 + i * 2.1) * 0.05;
    });
    luz.position.x = reposoLuz + estado.punteroX * 4;
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
