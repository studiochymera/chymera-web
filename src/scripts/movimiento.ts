// Movimiento de la portada de Chymera: desplazamiento suave, títulos por líneas y escenas de scroll.
// Todo se arma solo si la persona no pidió reducir el movimiento. Sin este script la página se ve
// completa y quieta: aquí solo se agrega movimiento, nunca se esconde contenido de antemano.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!sinMovimiento) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.documentElement.classList.add('con-movimiento');

  const salida = 'expo.out';
  const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Desplazamiento suave, sincronizado con ScrollTrigger. Los enlaces #ancla también se deslizan.
  const lenis = new Lenis({ anchors: { offset: -72 }, autoRaf: false, lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Títulos de sección: cada línea sube desde detrás de su máscara.
  document.querySelectorAll<HTMLElement>('[data-lineas]').forEach((titulo) => {
    SplitText.create(titulo, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.2,
          ease: salida,
          stagger: 0.09,
          scrollTrigger: { trigger: titulo, start: 'top 88%', once: true },
        }),
    });
  });

  // Grupos que entran en cascada (beneficios, sectores, precios).
  document.querySelectorAll<HTMLElement>('[data-sube]').forEach((grupo) => {
    gsap.from(grupo.children, {
      y: 48,
      opacity: 0,
      duration: 1,
      ease: salida,
      stagger: 0.09,
      scrollTrigger: { trigger: grupo, start: 'top 85%', once: true },
    });
  });

  // Filas de servicios: la línea superior se dibuja y el contenido llega detrás.
  document.querySelectorAll<HTMLElement>('[data-servicio]').forEach((fila) => {
    gsap.from(fila.querySelectorAll(':scope > :not(.servicio-vista)'), {
      y: 32,
      opacity: 0,
      duration: 1,
      ease: salida,
      stagger: 0.08,
      scrollTrigger: { trigger: fila, start: 'top 88%', once: true },
    });
  });

  const mm = gsap.matchMedia();

  // Portada: al bajar, el texto se queda atrás, el celular sube y la quimera crece.
  // La vitrina solo se mueve en computador: en celular la quimera se ubica respecto a la portada,
  // y un transform en la vitrina la volvería su caja de referencia y la haría saltar.
  const portada = document.querySelector<HTMLElement>('.portada');
  if (portada) {
    const scrub = { trigger: portada, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('[data-portada-texto]', { yPercent: 18, ease: 'none', scrollTrigger: scrub });
    gsap.to('[data-portada-quimera]', { scale: 1.18, rotate: -4, ease: 'none', scrollTrigger: scrub });
    mm.add('(min-width: 1024px)', () => {
      gsap.to('[data-vitrina]', { yPercent: -10, ease: 'none', scrollTrigger: scrub });
    });
  }

  // Franja: cada fila corre en sentido contrario mientras se hace scroll.
  const franja = document.querySelector<HTMLElement>('[data-franja]');
  if (franja) {
    franja.querySelectorAll<HTMLElement>('[data-franja-fila]').forEach((fila, i) => {
      gsap.fromTo(
        fila,
        { xPercent: i === 0 ? 0 : -24 },
        {
          xPercent: i === 0 ? -24 : 0,
          ease: 'none',
          scrollTrigger: { trigger: franja, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      );
    });
  }

  // Portafolio: en computador la sección se queda fija y las demos corren de lado.
  const portafolio = document.querySelector<HTMLElement>('[data-portafolio]');
  const pista = document.querySelector<HTMLElement>('[data-pista]');
  if (portafolio && pista) {
    mm.add('(min-width: 1024px)', () => {
      portafolio.classList.add('en-horizontal');
      const distancia = () => pista.scrollWidth - pista.parentElement!.clientWidth;
      const recorrido = gsap.to(pista, {
        x: () => -distancia(),
        ease: 'none',
        scrollTrigger: {
          trigger: portafolio,
          start: 'top top',
          end: () => `+=${distancia()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      gsap.to('[data-pista-avance]', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: portafolio, start: 'top top', end: () => `+=${distancia()}`, scrub: true, invalidateOnRefresh: true },
      });
      // Dentro de cada demo, el celular sube un poco mientras pasa.
      pista.querySelectorAll<HTMLElement>('.demo-captura').forEach((captura) => {
        gsap.fromTo(
          captura,
          { yPercent: 10 },
          {
            yPercent: -4,
            ease: 'none',
            scrollTrigger: { trigger: captura, containerAnimation: recorrido, start: 'left right', end: 'right left', scrub: true },
          },
        );
      });
      // Con teclado: al enfocar un enlace de una demo que está fuera de vista, la página baja
      // hasta el punto del recorrido en que esa demo queda en el centro.
      const alEnfocar = (e: FocusEvent) => {
        const tarjeta = (e.target as HTMLElement).closest<HTMLElement>('.demo, .kit');
        const escena = recorrido.scrollTrigger;
        if (!tarjeta || !escena) return;
        const izquierda = tarjeta.getBoundingClientRect().left - pista.getBoundingClientRect().left;
        const centrada = izquierda - (pista.parentElement!.clientWidth - tarjeta.offsetWidth) / 2;
        lenis.scrollTo(escena.start + gsap.utils.clamp(0, distancia(), centrada), { immediate: true });
      };
      pista.addEventListener('focusin', alEnfocar);
      return () => {
        portafolio.classList.remove('en-horizontal');
        pista.removeEventListener('focusin', alEnfocar);
      };
    });

    mm.add('(max-width: 1023.98px)', () => {
      gsap.utils.toArray<HTMLElement>('.demo-marco, .kit').forEach((marco) => {
        gsap.from(marco, {
          clipPath: 'inset(12% 8% 12% 8% round 1rem)',
          duration: 1.2,
          ease: salida,
          scrollTrigger: { trigger: marco, start: 'top 90%', once: true },
        });
      });
    });
  }

  // Proceso: la línea avanza con el scroll y cada paso se enciende cuando la línea llega.
  const proceso = document.querySelector<HTMLElement>('[data-proceso]');
  if (proceso) {
    const pasos = [...proceso.querySelectorAll<HTMLElement>(':scope > li')];
    const tramos = pasos.length - 1;
    ScrollTrigger.create({
      trigger: proceso,
      start: 'top 75%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate: ({ progress }) => {
        const avance = progress * tramos;
        pasos.forEach((paso, i) => {
          paso.style.setProperty('--p', String(gsap.utils.clamp(0, 1, avance - i)));
          paso.classList.toggle('activo', avance >= i - 0.02);
        });
      },
    });
  }

  // Cierre: la quimera se dibuja mientras se llega al final, como la intro pero al revés.
  const trazoCierre = document.querySelector<SVGPathElement>('[data-contacto-trazo]');
  if (trazoCierre) {
    gsap.fromTo(
      trazoCierre,
      { strokeDashoffset: 1, fillOpacity: 0 },
      {
        strokeDashoffset: 0,
        fillOpacity: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: '[data-contacto]', start: 'top 85%', end: 'bottom bottom', scrub: 1 },
      },
    );
  }

  if (conMouse) {
    // Botones magnéticos: siguen un poco al cursor y vuelven con resorte.
    document.querySelectorAll<HTMLElement>('main .boton-claro, main .boton-azul, main .boton-borde').forEach((boton) => {
      const x = gsap.quickTo(boton, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(boton, 'y', { duration: 0.5, ease: 'power3.out' });
      boton.addEventListener('pointermove', (e) => {
        const r = boton.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.25);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      });
      boton.addEventListener('pointerleave', () => {
        gsap.to(boton, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
      });
    });

    // Cursor con etiqueta ("Ver demo", "Ver kit").
    const cursor = document.querySelector<HTMLElement>('[data-cursor-sigue]');
    const etiqueta = cursor?.querySelector<HTMLElement>('[data-cursor-texto]');
    if (cursor && etiqueta) {
      const cx = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
      const cy = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
      window.addEventListener('pointermove', (e) => {
        cx(e.clientX);
        cy(e.clientY);
      });
      document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((zona) => {
        zona.addEventListener('pointerenter', () => {
          etiqueta.textContent = zona.dataset.cursor!;
          cursor.classList.add('visible');
        });
        zona.addEventListener('pointerleave', () => cursor.classList.remove('visible'));
      });
    }

    // Servicios: una vista flotante sigue al cursor dentro de la fila y se inclina con la velocidad.
    document.querySelectorAll<HTMLElement>('[data-servicio]').forEach((fila) => {
      const vista = fila.querySelector<HTMLElement>('.servicio-vista');
      if (!vista) return;
      const vx = gsap.quickTo(vista, 'x', { duration: 0.6, ease: 'power3.out' });
      const vy = gsap.quickTo(vista, 'y', { duration: 0.6, ease: 'power3.out' });
      const giro = gsap.quickTo(vista, 'rotation', { duration: 0.8, ease: 'power3.out' });
      let ultimaX = 0;
      fila.addEventListener('pointerenter', (e) => {
        const r = fila.getBoundingClientRect();
        gsap.set(vista, { x: e.clientX - r.left - vista.offsetWidth / 2, y: e.clientY - r.top - vista.offsetHeight / 2 });
        gsap.to(vista, { opacity: 1, scale: 1, duration: 0.5, ease: salida, overwrite: 'auto' });
        ultimaX = e.clientX;
      });
      fila.addEventListener('pointermove', (e) => {
        const r = fila.getBoundingClientRect();
        vx(e.clientX - r.left - vista.offsetWidth / 2);
        vy(e.clientY - r.top - vista.offsetHeight / 2);
        giro(gsap.utils.clamp(-12, 12, (e.clientX - ultimaX) * 0.6));
        ultimaX = e.clientX;
      });
      fila.addEventListener('pointerleave', () => {
        gsap.to(vista, { opacity: 0, scale: 0.85, rotation: 0, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
      });
      gsap.set(vista, { scale: 0.85 });
    });
  }

  // Las imágenes diferidas cambian alturas: recalcular las escenas cuando todo cargó.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
