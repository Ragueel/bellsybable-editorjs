import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      name: 'BellsybableBlock',
      entry: ['src/main.ts', 'src/style.css'],
    }
  },
  plugins: [
    cssInjectedByJsPlugin(),
  ]
});
