import { readdirSync, readFileSync } from 'node:fs';
import { join, basename, extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import showdown from 'showdown';

/**
 * Vite plugin that turns the markdown content folders
 * (`content/posts/`, `content/authors/`, `content/pages/`, `content/tags/`)
 * into a single virtual module.
 *
 * Import it in the app with:
 *
 *   import { posts, authors, pages, tags } from 'virtual:content';
 *
 * Front-matter is parsed with gray-matter and the markdown body is rendered
 * to HTML at build time with showdown, so the app never needs a runtime
 * markdown renderer. showdown is used (rather than e.g. markdown-it) to match
 * the renderer the site used before the Vite migration: the authored content
 * embeds raw, indented HTML blocks (see content/pages/spielekuenstla.md), and
 * showdown preserves those verbatim whereas markdown-it reinterprets indented
 * HTML as code blocks. Relationships (post <-> author <-> tag) are left as id
 * strings here and resolved in the Ember `content` service.
 *
 * The record `id` is the file name without extension (empress-blog convention),
 * except for authors which carry an explicit `id` in their front-matter.
 */

const VIRTUAL_ID = 'virtual:content';
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID;

const converter = new showdown.Converter();

function renderMarkdown(markdown) {
  return converter.makeHtml(markdown);
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const FOLDERS = [
  'content/posts',
  'content/authors',
  'content/pages',
  'content/tags',
];

function readCollection(folder) {
  const dir = join(projectRoot, folder);
  let files;
  try {
    files = readdirSync(dir);
  } catch {
    return [];
  }

  return files
    .filter((file) => extname(file) === '.md')
    .map((file) => {
      const slug = basename(file, '.md');
      const raw = readFileSync(join(dir, file), 'utf8');
      const { data, content } = matter(raw);

      return {
        // author records provide their own id, everyone else uses the slug
        id: typeof data.id === 'string' && data.id.length ? data.id : slug,
        slug,
        ...data,
        content: content.trim(),
        html: content.trim() ? renderMarkdown(content) : '',
      };
    });
}

function loadContent() {
  const [posts, authors, pages, tags] = FOLDERS.map(readCollection);
  return { posts, authors, pages, tags };
}

function serialize(data) {
  return `export const posts = ${JSON.stringify(data.posts)};
export const authors = ${JSON.stringify(data.authors)};
export const pages = ${JSON.stringify(data.pages)};
export const tags = ${JSON.stringify(data.tags)};
export default { posts, authors, pages, tags };
`;
}

export default function contentPlugin() {
  return {
    name: 'spielekuenstla-content',

    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_VIRTUAL_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_ID) {
        return serialize(loadContent());
      }
    },

    // Re-render + reload the app when any markdown file changes in dev.
    configureServer(server) {
      const watchGlobs = FOLDERS.map((folder) =>
        join(projectRoot, folder, '**/*.md'),
      );
      server.watcher.add(watchGlobs);

      const invalidate = (file) => {
        if (!file.endsWith('.md')) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      };

      server.watcher.on('add', invalidate);
      server.watcher.on('change', invalidate);
      server.watcher.on('unlink', invalidate);
    },
  };
}
