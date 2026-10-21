// Movimiento de la portada de Chymera: desplazamiento suave, celdas que se arman al llegar
// y maquetas en falso 3D que se inclinan hacia el mouse.
// Todo se arma solo si la persona no pidió reducir el movimiento. Sin este script la página se ve
// completa y quieta: aquí solo se agrega movimiento, nunca se esconde contenido de antemano.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!sinMovimiento) {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('con-movimiento');

  const salida = 'expo.out';

  // Desplazamiento suave con la curva de inercia de Lenis, en el mismo bucle que GSAP.
  const lenis = new Lenis({
    autoRaf: false,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    anchors: { offset: -72 },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Cada bento se arma al llegar: las celdas suben en cascada y luego lo de adentro cuenta su parte.
  document.querySelectorAll<HTMLElement>('[data-bento]').forEach((bento) => {
    const linea = gsap.timeline({
      defaults: { ease: salida },
      scrollTrigger: { trigger: bento, start: 'top 82%', once: true },
    });
    linea.from(bento.children, { y: 64, opacity: 0, duration: 1.1, stagger: 0.1 });

    // Las tres demos salen del mismo punto y se abren en abanico.
    const abanico = bento.querySelectorAll('[data-abanico]');
    if (abanico.length) linea.from(abanico, { x: 0, y: 80, rotation: 0, duration: 1.2, stagger: 0.06 }, 0.25);

    // Tu negocio sube al primer lugar de la búsqueda.
    const destacado = bento.querySelector('[data-destacado]');
    if (destacado) linea.from(destacado, { y: 36, opacity: 0, scale: 0.96, duration: 0.9 }, 0.45);

    // El mensaje de WhatsApp llega.
    const burbuja = bento.querySelector('[data-burbuja]');
    if (burbuja) linea.from(burbuja, { y: 18, opacity: 0, scale: 0.9, duration: 0.8 }, 0.6);
  });

  // Falso 3D: la maqueta gira hasta 10° hacia el mouse y un brillo sigue al cursor. Solo con mouse.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('[data-inclinar]').forEach((zona) => {
      const objeto = zona.querySelector<HTMLElement>('[data-inclinar-objeto]');
      if (!objeto) return;
      const maximo = 10;
      gsap.set(objeto, { transformPerspective: 1100 });
      const giroX = gsap.quickTo(objeto, 'rotationX', { duration: 0.7, ease: 'power3.out' });
      const giroY = gsap.quickTo(objeto, 'rotationY', { duration: 0.7, ease: 'power3.out' });
      zona.addEventListener('pointermove', (e) => {
        const r = zona.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        giroY((x - 0.5) * 2 * maximo);
        giroX((0.5 - y) * 2 * maximo);
        objeto.style.setProperty('--brillo-x', `${x * 100}%`);
        objeto.style.setProperty('--brillo-y', `${y * 100}%`);
      });
      zona.addEventListener('pointerleave', () => {
        giroX(0);
        giroY(0);
      });
    });
  }

  // Las imágenes diferidas cambian alturas: recalcular las escenas cuando todo cargó.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
