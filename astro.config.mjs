import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://chymerastudios.com',
  // El CSS va dentro del HTML: en celular se ahorra una ida y vuelta antes del primer pintado.
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
