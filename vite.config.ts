import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    root: 'src',
    base: './', // Define caminhos relativos para os arquivos (CSS/JS) para funcionar em qualquer subpasta ou servidor de hospedagem
    build: {
      outDir: '../', // Compila os arquivos de produção diretamente na raiz do projeto (cPanel/Hostinger pronto para uso)
      emptyOutDir: false, // IMPORTANTE: mantém a pasta de desenvolvimento (src, package.json, etc) intacta
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
