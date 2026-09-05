import { htmlSafe } from '@ember/template';

// Renders a static content page (from content/pages/*.md). Flattened from the
// former empress-blog page.hbs: a centered title header, an optional hero
// image, and the page body. The body HTML is rendered at build time by the
// content Vite plugin (markdown-it), so we only need to mark it as safe here.
//
// Navigation/site chrome is intentionally omitted for now.

function body(page) {
  return htmlSafe(page.html);
}

<template>
  <div class="page-template">
    <header class="site-header">
      <div class="inner">
        <div class="site-header-content">
          <h1 class="site-title">{{@page.title}}</h1>
        </div>
      </div>
    </header>

    <main id="site-main" class="site-main outer">
      <div class="inner">

        <article class="post-full {{unless @page.image 'no-image'}}">

          {{#if @page.image}}
            <figure class="post-full-image">
              <img src={{@page.image}} alt={{@page.title}} />
            </figure>
          {{/if}}

          <section class="post-full-content">
            <div class="post-content">
              {{body @page}}
            </div>
          </section>

        </article>

      </div>
    </main>
  </div>
</template>
