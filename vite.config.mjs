import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import content from './lib/vite-content-plugin.mjs';
import { emberSsg } from 'vite-ember-ssr/vite-plugin';

async function loadContent() {
  const plugin = content();
  const code = plugin.load(plugin.resolveId('virtual:content'));
  const mod = await import('data:text/javascript,' + encodeURIComponent(code));
  return mod.default;
}

function routesFor({ posts, authors, pages, tags }) {
  return [
    'index',
    ...pages.map((p) => `page/${p.slug}`),
    ...authors.map((a) => `author/${a.id}`),
    ...tags.map((t) => `tag/${t.slug}`),
    ...posts.map((p) => `${p.id}`),
  ];
}

export default defineConfig(async ({ command, mode }) => {
  const contentData = await loadContent();
  const routes = routesFor(contentData);

  return {
    plugins: [
      ember(),
      // extra plugins here
      content(),
      babel({
        babelHelpers: 'runtime',
        extensions,
      }),
      emberSsg({
        ssrEntry: 'app/app-ssr.js',
        routes,
      }),
    ],
  }
});
