// Desplazamiento suave de la página (Lenis), solo si la persona no pidió reducir el movimiento.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    autoRaf: true,
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    anchors: { offset: -72 },
  });
  // Las anclas y el botón "Saltar al contenido" siguen funcionando con teclado.
  document.documentElement.classList.add('lenis');
  void lenis;
}
