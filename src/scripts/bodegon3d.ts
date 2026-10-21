// El bodegón en 3D de la portada: un arco, una media esfera, un disco y una escalera, en piedra
// crema y cerámica azul sobre un pedestal, con una sola esfera celeste. Todo se arma aquí con
// geometría (no hay modelo que descargar), así que se ve nítido en cualquier pantalla.
// La esfera rueda despacio sobre la media esfera, la luz sigue un poco al mouse y la pieza se
// puede girar un poco arrastrando; al soltar vuelve a su sitio.
// Se carga aparte y solo después de la intro. Si el equipo no tiene WebGL, queda la foto, que
// se sacó de esta misma escena (armarBodegon) con la luz y la pose de reposo.
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  PMREMGenerator,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Pose de reposo: la foto de respaldo se sacó con estos valores.
const POSE = -0.42;
const LUZ = { x: -5.5, y: 7, z: 2.6 };
// Media esfera y esfera celeste: radios y altura de la cara plana.
const MEDIA = 0.62;
const BOLA = 0.17;

// Textura de piedra hecha a mano: tonos muy cercanos con algunos poros más oscuros.
function crearGrano() {
  const lado = 256;
  const lienzo = document.createElement('canvas');
  lienzo.width = lienzo.height = lado;
  const c = lienzo.getContext('2d')!;
  const datos = c.createImageData(lado, lado);
  for (let i = 0; i < datos.data.length; i += 4) {
    const v = 236 + Math.random() * 19;
    datos.data[i] = datos.data[i + 1] = datos.data[i + 2] = v;
    datos.data[i + 3] = 255;
  }
  c.putImageData(datos, 0, 0);
  c.fillStyle = 'rgb(200 200 200 / 0.55)';
  for (let i = 0; i < 70; i++) {
    c.beginPath();
    c.ellipse(Math.random() * lado, Math.random() * lado, 0.6 + Math.random() * 1.8, 0.4 + Math.random(), Math.random() * 3, 0, Math.PI * 2);
    c.fill();
  }
  const textura = new CanvasTexture(lienzo);
  textura.wrapS = textura.wrapT = RepeatWrapping;
  textura.repeat.set(3, 3);
  textura.colorSpace = SRGBColorSpace;
  textura.anisotropy = 4;
  return textura;
}

export function armarBodegon(sombraGrande = true) {
  const escena = new Scene();

  // Grano de piedra y de cerámica: un poco de textura para que no se vea plástico.
  const grano = crearGrano();
  const piedra = new MeshStandardMaterial({
    color: '#e2d6c6',
    roughness: 0.95,
    map: grano,
    bumpMap: grano,
    bumpScale: 1.2,
  });
  const azul = new MeshStandardMaterial({ color: '#1d2a3a', roughness: 0.78, bumpMap: grano, bumpScale: 0.6 });
  const celeste = new MeshPhysicalMaterial({
    color: '#279bf2',
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });

  const pieza = new Group();
  const poner = (malla: Mesh) => {
    malla.castShadow = true;
    malla.receiveShadow = true;
    pieza.add(malla);
    return malla;
  };

  // Pedestal: la cara de arriba queda en y = 0.
  const pedestal = poner(new Mesh(new RoundedBoxGeometry(3.2, 0.32, 2.1, 4, 0.03), piedra));
  pedestal.position.y = -0.16;

  // Arco: un rectángulo con medio punto, con el hueco del mismo dibujo, y algo de grosor.
  const arco = new Shape();
  const ancho = 0.56;
  const hueco = 0.27;
  const pierna = 1.42;
  arco.moveTo(-ancho, 0);
  arco.lineTo(-ancho, pierna);
  arco.absarc(0, pierna, ancho, Math.PI, 0, true);
  arco.lineTo(ancho, 0);
  arco.lineTo(hueco, 0);
  arco.lineTo(hueco, pierna);
  arco.absarc(0, pierna, hueco, 0, Math.PI, false);
  arco.lineTo(-hueco, 0);
  arco.closePath();
  const arcoMalla = poner(
    new Mesh(
      new ExtrudeGeometry(arco, {
        depth: 0.34,
        bevelEnabled: true,
        bevelSize: 0.015,
        bevelThickness: 0.015,
        bevelSegments: 3,
        curveSegments: 48,
      }),
      azul,
    ),
  );
  arcoMalla.position.set(0.32, 0.015, -0.72);

  // Media esfera con la cara plana arriba.
  const cuenco = new Group();
  const panza = new Mesh(new SphereGeometry(MEDIA, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), azul);
  const tapa = new Mesh(new CircleGeometry(MEDIA, 64), azul);
  tapa.rotation.x = -Math.PI / 2;
  for (const m of [panza, tapa]) {
    m.castShadow = true;
    m.receiveShadow = true;
    cuenco.add(m);
  }
  cuenco.position.set(-0.72, MEDIA, 0.12);
  pieza.add(cuenco);

  // Disco de piedra de pie sobre la media esfera.
  const disco = poner(new Mesh(new CylinderGeometry(0.4, 0.4, 0.1, 72), piedra));
  disco.rotation.set(Math.PI / 2, 0, 0);
  disco.rotation.order = 'YXZ';
  disco.rotation.y = 0.35;
  disco.position.set(-0.86, MEDIA + 0.4, -0.04);

  // Escalera: seis peldaños que suben hacia el arco.
  const peldanos = 6;
  const huella = 0.17;
  const alto = 0.16;
  for (let i = 0; i < peldanos; i++) {
    const h = alto * (i + 1);
    const largo = huella * (peldanos - i);
    const peldano = poner(new Mesh(new RoundedBoxGeometry(largo, h, 0.62, 2, 0.012), piedra));
    peldano.position.set(0.42 + huella * i + largo / 2, h / 2, 0.42);
  }

  // Esfera celeste: el único acento.
  const bola = poner(new Mesh(new SphereGeometry(BOLA, 48, 32), celeste));
  bola.position.set(-0.5, MEDIA + BOLA, 0.2);

  pieza.rotation.y = POSE;
  escena.add(pieza);

  // Sombra del pedestal en el piso: una mancha suave (una sombra de verdad se cortaría en el borde).
  const mancha = document.createElement('canvas');
  mancha.width = mancha.height = 128;
  const m = mancha.getContext('2d')!;
  const degradado = m.createRadialGradient(64, 64, 0, 64, 64, 64);
  degradado.addColorStop(0, 'rgb(29 42 58 / 0.32)');
  degradado.addColorStop(0.55, 'rgb(29 42 58 / 0.14)');
  degradado.addColorStop(1, 'rgb(29 42 58 / 0)');
  m.fillStyle = degradado;
  m.fillRect(0, 0, 128, 128);
  const piso = new Mesh(
    new PlaneGeometry(4.6, 3.3),
    new MeshBasicMaterial({ map: new CanvasTexture(mancha), transparent: true, depthWrite: false }),
  );
  piso.rotation.x = -Math.PI / 2;
  piso.position.set(0.35, -0.319, -0.15);
  pieza.add(piso);

  // Luz de ventana: cálida, alta y a la izquierda, con sombra suave; cielo crema y relleno frío.
  escena.add(new HemisphereLight('#fff8f0', '#cfc3b6', 0.55));
  const sol = new DirectionalLight('#fff1e0', 3.4);
  sol.position.set(LUZ.x, LUZ.y, LUZ.z);
  sol.castShadow = true;
  sol.shadow.mapSize.setScalar(sombraGrande ? 2048 : 1024);
  sol.shadow.camera.left = -3;
  sol.shadow.camera.right = 3;
  sol.shadow.camera.top = 3;
  sol.shadow.camera.bottom = -3;
  sol.shadow.camera.near = 1;
  sol.shadow.camera.far = 20;
  sol.shadow.bias = -0.0004;
  sol.shadow.normalBias = 0.02;
  sol.shadow.radius = 6;
  const relleno = new DirectionalLight('#e3ebf5', 0.35);
  relleno.position.set(5, 2, 3);
  escena.add(sol, relleno);

  const camara = new PerspectiveCamera(24, 1400 / 1064, 0.1, 50);
  camara.position.set(0.1, 1.75, 8.7);
  camara.lookAt(0.1, 0.58, 0);

  return { escena, camara, pieza, bola, sol };
}

export function prepararPintor(lienzo: HTMLCanvasElement, maxDpr: number) {
  const pintor = new WebGLRenderer({ canvas: lienzo, alpha: true, antialias: true, powerPreference: 'high-performance' });
  pintor.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  pintor.outputColorSpace = SRGBColorSpace;
  pintor.toneMapping = ACESFilmicToneMapping;
  pintor.toneMappingExposure = 0.9;
  pintor.shadowMap.enabled = true;
  pintor.shadowMap.type = PCFSoftShadowMap;
  return pintor;
}

export function ambiente(pintor: WebGLRenderer, escena: Scene) {
  const pmrem = new PMREMGenerator(pintor);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.35;
  pmrem.dispose();
}

// Le devuelve el turno al navegador entre pasos pesados, para que la página no se congele.
const ceder = () => new Promise<void>((listo) => setTimeout(listo, 0));

// sala: la figura con la foto y la cartela. escenaHtml: dónde va el lienzo, del mismo tamaño que la foto.
export async function montarBodegon(sala: HTMLElement, escenaHtml: HTMLElement) {
  const tactil = window.matchMedia('(pointer: coarse)').matches;
  const lienzo = document.createElement('canvas');
  lienzo.className = 'pieza-3d';
  let pintor: WebGLRenderer;
  try {
    pintor = prepararPintor(lienzo, tactil ? 1.5 : 2);
  } catch {
    return;
  }
  const { escena, camara, pieza, bola, sol } = armarBodegon(!tactil);
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

  // Giro: lo que suma la persona al arrastrar (vuelve solo a la pose al soltar), el mouse y el scroll.
  // Gira más hacia un lado que hacia el otro: de espaldas la escalera no se lee.
  const estado = { arrastre: 0, puntero: 0, luz: 0, scroll: 0, tiempo: 0 };
  let arrastrando = false;
  let ultimoX = 0;
  const volver = () => gsap.to(estado, { arrastre: 0, duration: 1.6, ease: 'elastic.out(1, 0.6)' });

  lienzo.addEventListener('pointerdown', (e) => {
    arrastrando = true;
    ultimoX = e.clientX;
    gsap.killTweensOf(estado, 'arrastre');
    lienzo.setPointerCapture(e.pointerId);
  });
  lienzo.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    const paso = ((e.clientX - ultimoX) / lienzo.clientWidth) * Math.PI;
    ultimoX = e.clientX;
    estado.arrastre = gsap.utils.clamp(-0.3, 0.8, estado.arrastre + paso);
  });
  const soltar = () => {
    if (!arrastrando) return;
    arrastrando = false;
    volver();
  };
  lienzo.addEventListener('pointerup', soltar);
  lienzo.addEventListener('pointercancel', soltar);

  // Con mouse, la pieza se asoma hacia el cursor y la luz de la ventana se corre un poco.
  const portada = sala.closest('section') ?? sala;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const irX = gsap.quickTo(estado, 'puntero', { duration: 1.4, ease: 'power3.out' });
    const irLuz = gsap.quickTo(estado, 'luz', { duration: 1.8, ease: 'power3.out' });
    portada.addEventListener('pointermove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      irX(x * 0.28);
      irLuz(x);
    });
    portada.addEventListener('pointerleave', () => {
      irX(0);
      irLuz(0);
    });
  }

  ScrollTrigger.create({
    trigger: portada,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (s) => (estado.scroll = s.progress),
  });

  const reposoBola = bola.position.x;
  const pintar = (_t: number, delta: number) => {
    estado.tiempo += Math.min(delta, 50) / 1000;
    pieza.rotation.y = POSE + estado.arrastre + estado.puntero + estado.scroll * 0.3;
    // La esfera va y viene sobre la cara plana, rodando de verdad (gira lo que avanza).
    const corrido = Math.sin(estado.tiempo * 0.55) * 0.2;
    bola.position.x = reposoBola + corrido;
    bola.rotation.z = -corrido / BOLA;
    sol.position.x = LUZ.x + estado.luz * 3;
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
