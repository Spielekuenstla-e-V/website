import { createServer } from 'node:http';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sirv from 'sirv';
import puppeteer from 'puppeteer';
import contentPlugin from './vite-content-plugin.mjs';

/**
 * Static site generation, recreating what prember did before the Vite
 * migration.
 *
 * prember pre-rendered every route to static HTML using FastBoot because
 * empress-blog fetched content at runtime. Our content is fully known at build
 * time (virtual:content), so instead of an SSR sandbox we simply:
 *
 *   1. serve the client build (dist/) with an SPA fallback,
 *   2. drive the real app in headless Chromium,
 *   3. visit every route and snapshot the rendered HTML,
 *   4. write dist/<route>/index.html.
 *
 * The result is a set of fully-rendered static pages that also hydrate into
 * the live SPA on load (progressive enhancement), matching the old behaviour.
 */

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(projectRoot, 'dist');

// Serialized and executed inside the headless browser page, so `document` is
// the page's DOM, not a Node global.
/* global document */
function snapshotHtml() {
  return document.documentElement.outerHTML;
}

// Optionally use a system Chromium/Chrome via an env override; otherwise let
// puppeteer use its own bundled browser (installed on `npm install`), which is
// what runs on CI / Netlify.
function resolveBrowser() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_BIN,
  ].filter(Boolean);

  return candidates.find((path) => existsSync(path));
}

// Load the content collections the same way the app does, to enumerate routes.
async function loadContent() {
  const plugin = contentPlugin();
  const code = plugin.load(plugin.resolveId('virtual:content'));
  const mod = await import('data:text/javascript,' + encodeURIComponent(code));
  return mod.default;
}

function routesFor({ posts, authors, pages, tags }) {
  return [
    '/',
    ...pages.map((p) => `/page/${p.slug}`),
    ...authors.map((a) => `/author/${a.id}`),
    ...tags.map((t) => `/tag/${t.slug}`),
    ...posts.map((p) => `/${p.id}`),
  ];
}

// Static file server for dist/ with SPA fallback to index.html, so deep routes
// boot the app just like the Netlify redirect does in production.
function startServer() {
  const serve = sirv(distDir, { dev: false, single: true, etag: false });
  const server = createServer((req, res) => serve(req, res));
  return new Promise((resolvePromise) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolvePromise({ server, port });
    });
  });
}

// dist path for a route: "/" -> dist/index.html, "/x/y" -> dist/x/y/index.html
function outputPathFor(route) {
  if (route === '/') {
    return join(distDir, 'index.html');
  }
  return join(distDir, route.replace(/^\/+/, ''), 'index.html');
}

async function main() {
  if (!existsSync(join(distDir, 'index.html'))) {
    throw new Error('dist/index.html not found. Run `vite build` first.');
  }

  const content = await loadContent();
  const routes = routesFor(content);

  const { server, port } = await startServer();
  const executablePath = resolveBrowser();
  const browser = await puppeteer.launch({
    ...(executablePath ? { executablePath } : {}),
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
    ],
  });

  const baseHtml = await readFile(join(distDir, 'index.html'), 'utf8');
  const doctype = baseHtml
    .trimStart()
    .slice(0, 15)
    .toLowerCase()
    .startsWith('<!doctype')
    ? '<!DOCTYPE html>\n'
    : '';

  let done = 0;
  try {
    const page = await browser.newPage();

    for (const route of routes) {
      await page.goto(`http://127.0.0.1:${port}${route}`, {
        waitUntil: 'networkidle0',
      });

      // Wait until the Ember app has rendered actual content.
      await page.waitForSelector('#site-main, .site-footer', {
        timeout: 15000,
      });

      // `snapshotHtml` runs inside the browser page context, not Node.
      const html = await page.evaluate(snapshotHtml);

      const outPath = outputPathFor(route);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, doctype + html, 'utf8');

      done += 1;
      if (done % 25 === 0 || done === routes.length) {
        process.stdout.write(`  prerendered ${done}/${routes.length}\n`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  process.stdout.write(`Prerendered ${done} routes into dist/.\n`);
}

main().catch((error) => {
  process.stderr.write(`Prerender failed: ${error.stack || error}\n`);
  process.exitCode = 1;
});
