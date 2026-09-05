import { pageTitle } from 'ember-page-title';
import { htmlSafe } from '@ember/template';
import PostCard from 'spielekuenstla-website/components/post-card';
import '../styles/tag.css';

// Tag archive page, flattened from the former empress-blog tag.hbs. Shows a
// header (tag name + description) followed by a feed of posts carrying that
// tag (<PostCard>). Description falls back to a post count when the tag has no
// body text.

function description(tag) {
  return htmlSafe(tag.html ?? '');
}

function postCount(posts) {
  const count = posts?.length ?? 0;
  if (count === 0) {
    return 'Keine Beiträge';
  }
  return count === 1 ? '1 Beitrag' : `${count} Beiträge`;
}

<template>
  {{#let @model.tag as |tag|}}
    {{pageTitle tag.name}}

    <header class="site-header outer tag-template-header">
      <div class="inner">
        <div class="site-header-content">
          <h1 class="site-title">{{if tag.name tag.name tag.slug}}</h1>
          <h2 class="site-description">
            {{#if tag.content}}
              {{description tag}}
            {{else}}
              {{postCount @model.posts}}
            {{/if}}
          </h2>
        </div>
      </div>
    </header>
  {{/let}}

  <main id="site-main" class="site-main outer">
    <div class="inner">
      <div class="post-feed">
        {{#each @model.posts as |post|}}
          <PostCard @post={{post}} />
        {{/each}}
      </div>
    </div>
  </main>
</template>
