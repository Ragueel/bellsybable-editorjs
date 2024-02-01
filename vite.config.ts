import { resolve } from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';


export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      name: 'bellsybable-block',
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index'
    },
  },
  plugins: [
    cssInjectedByJsPlugin(),
    dts({ rollupTypes: true }),
  ]
});
