// Andok Group: interacciones pequeñas, sin librerías.
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menú del celular
  const menu = $('#menu');
  $$('[data-menu]').forEach(b => b.addEventListener('click', () => {
    const abrir = !menu.classList.contains('abierto');
    menu.classList.toggle('abierto', abrir);
    $$('[data-menu="abrir"]').forEach(x => x.setAttribute('aria-expanded', abrir));
    document.body.style.overflow = abrir ? 'hidden' : '';
    if (abrir) $('.cerrar', menu).focus();
  }));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('abierto')) $('[data-menu="cerrar"]').click(); });

  // Portada: las fotos 2 a 4 solo se piden cuando las miniaturas están a la vista (en celular no se descargan)
  const cargarCapas = () => $$('.hero .capa [data-srcset], .hero .capa [data-src]').forEach(el => {
    if (el.dataset.srcset) { el.srcset = el.dataset.srcset; delete el.dataset.srcset; }
    if (el.dataset.src) { el.src = el.dataset.src; delete el.dataset.src; }
  });
  const mini = $('.miniaturas');
  if (mini && getComputedStyle(mini).display !== 'none') addEventListener('load', () => setTimeout(cargarCapas, 600), { once: true });
  // Portada: miniaturas que cambian la foto
  $$('.miniaturas button').forEach(b => b.addEventListener('click', () => {
    cargarCapas();
    const i = +b.dataset.i;
    $$('.hero .capa').forEach((c, k) => c.classList.toggle('activa', k === i));
    $$('.miniaturas button').forEach((x, k) => x.setAttribute('aria-pressed', k === i));
    const et = $('#hero-et'); if (et) et.textContent = b.dataset.et;
  }));

  // Del plano a la obra: el paso visible enciende su foto
  const pasos = $$('.paso');
  if (pasos.length) {
    const fotos = $$('.historia .medio img');
    const pie = $('.historia .medio .pie');
    const barra = $('.progreso i');
    const activar = i => {
      pasos.forEach((p, k) => p.classList.toggle('activo', k === i));
      fotos.forEach((f, k) => { f.classList.toggle('activa', k === i); f.classList.toggle('vista', k < i); });
      if (pie) pie.textContent = pasos[i].dataset.pie;
      if (barra) barra.style.setProperty('--p', (i + 1) / pasos.length);
    };
    activar(0);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) activar(pasos.indexOf(e.target)); }), { rootMargin: '-45% 0px -45% 0px' });
    pasos.forEach(p => io.observe(p));
  }

  // Comparadores (antes/después, dibujo/obra)
  $$('.comparador input').forEach(r => {
    const c = r.closest('.comparador');
    const set = () => c.style.setProperty('--pos', r.value + '%');
    r.addEventListener('input', set); set();
  });

  // Índice de proyectos: vista previa que sigue al cursor
  const vp = $('.vista-previa');
  if (vp && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const img = $('img', vp);
    $$('.indice a').forEach(a => {
      a.addEventListener('mouseenter', () => { img.src = a.dataset.foto; img.alt = ''; vp.classList.add('on'); });
      a.addEventListener('mouseleave', () => vp.classList.remove('on'));
      a.addEventListener('mousemove', e => { vp.style.left = (e.clientX + 190) + 'px'; vp.style.top = e.clientY + 'px'; });
    });
  }

  // Plano que se dibuja al entrar en pantalla
  const planos = $$('.plano');
  if (planos.length) {
    if (quieto) planos.forEach(p => p.classList.add('visto'));
    else {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { threshold: .35 });
      planos.forEach(p => io.observe(p));
    }
  }

  // Filtros de proyectos
  $$('.filtros button').forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.f;
    $$('.filtros button').forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('.obra').forEach(o => { o.hidden = f !== 'todas' && !o.dataset.tipo.split(' ').includes(f); });
    const n = $$('.obra:not([hidden])').length;
    const out = $('#conteo'); if (out) out.textContent = n === 1 ? '1 proyecto' : n + ' proyectos';
  }));

  // Formulario: arma el mensaje y abre WhatsApp (el sitio no guarda los datos)
  const form = $('form.cotizar');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('.mensaje-form', form);
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const d = new FormData(form);
    const texto = `Hola Andok, soy ${d.get('nombre').trim()}. ${d.get('mensaje').trim()}\nMi celular: ${d.get('celular').trim()}`;
    window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    msg.textContent = 'Listo: se abrió WhatsApp con tu mensaje. Si no se abrió, escríbenos al 322 436 3462.';
  });
})();
