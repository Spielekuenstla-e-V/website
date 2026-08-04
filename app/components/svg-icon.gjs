import { htmlSafe } from '@ember/template';

// SVG icon component. `ember-svg-jar` is not compatible with the Embroider +
// Vite build (its classic ember-cli-htmlbars hook breaks), so this reproduces
// the same ergonomics using Vite's native raw glob import: every file under
// /svgs is inlined as a string at build time and rendered by name.
//
//   <SvgIcon @name="discord" class="social-icon" />
//
// HTML attributes (class, title, ...) are forwarded to the wrapping <span> via
// ...attributes; the raw <svg> markup is injected inside it.

const icons = import.meta.glob('/svgs/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const byName = Object.fromEntries(
  Object.entries(icons).map(([path, source]) => [
    path.replace(/^.*\/([^/]+)\.svg$/, '$1'),
    source,
  ]),
);

function markup(name) {
  return htmlSafe(byName[name] ?? '');
}

<template>
  <span class="svg-icon" data-icon={{@name}} ...attributes>
    {{markup @name}}
  </span>
</template>
