import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://chymerastudios.com',
  vite: { plugins: [tailwindcss()] },
});
