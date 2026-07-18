import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import content from './lib/vite-content-plugin.mjs';

export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    // extra plugins here
    content(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
