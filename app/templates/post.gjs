import { pageTitle } from 'ember-page-title';
import { LinkTo } from '@ember/routing';
import { htmlSafe } from '@ember/template';
import PostByline from 'spielekuenstla-website/components/post-byline';
import '../styles/post.css';

// Post detail page, flattened from the former empress-blog post.hbs plus its
// byline partials and the Ghost/Casper "Single Post" styles. The author-info
// byline is delegated to <PostByline>. The related-posts ("read next") card
// and email subscribe form from the original theme are omitted (no mailing-
// list backend); previous/next navigation is kept as simple links. The
// primary tag links to its /tag/:tag_id archive.

function body(html) {
  return htmlSafe(html ?? '');
}

function hasSiblings(model) {
  return Boolean(model.prevPost || model.nextPost);
}

<template>
  {{pageTitle @model.post.title}}

  {{#let @model.post as |post|}}
    <main id="site-main" class="site-main outer">
      <div class="inner">

        <article class="post-full {{unless post.image 'no-image'}}">

          <header class="post-full-header">
            <section class="post-full-meta">
              <time class="post-full-meta-date" datetime={{@model.isoDate}}>
                {{@model.displayDate}}
              </time>
              {{#if post.primaryTag}}
                <span class="date-divider">/</span>
                <LinkTo
                  @route="tag"
                  @model={{post.primaryTag.slug}}
                  class="post-full-meta-tag"
                >
                  {{if
                    post.primaryTag.name
                    post.primaryTag.name
                    post.primaryTag.slug
                  }}
                </LinkTo>
              {{/if}}
              <span class="date-divider">/</span>
              <span class="post-full-meta-readtime">{{@model.readingTime}}</span>
            </section>
            <h1 class="post-full-title">{{post.title}}</h1>
          </header>

          {{#if post.image}}
            <figure class="post-full-image">
              <img src={{post.image}} alt={{post.title}} />
            </figure>
          {{/if}}

          <section class="post-full-content">
            <div class="post-content">
              {{body post.html}}
            </div>
          </section>

          <footer class="post-full-footer">
            <PostByline @authors={{post.authors}} />
          </footer>

        </article>

      </div>
    </main>

    {{#if (hasSiblings @model)}}
      <aside class="read-next outer">
        <div class="inner">
          <nav class="post-nav" aria-label="Weitere Beiträge">
            {{#if @model.prevPost}}
              <LinkTo
                @route="post"
                @model={{@model.prevPost.id}}
                class="post-nav-prev"
              >
                <span class="post-nav-label">← Älterer Beitrag</span>
                <span class="post-nav-title">{{@model.prevPost.title}}</span>
              </LinkTo>
            {{/if}}
            {{#if @model.nextPost}}
              <LinkTo
                @route="post"
                @model={{@model.nextPost.id}}
                class="post-nav-next"
              >
                <span class="post-nav-label">Neuerer Beitrag →</span>
                <span class="post-nav-title">{{@model.nextPost.title}}</span>
              </LinkTo>
            {{/if}}
          </nav>
        </div>
      </aside>
    {{/if}}
  {{/let}}
</template>
