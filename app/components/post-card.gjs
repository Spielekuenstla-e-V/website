import { LinkTo } from '@ember/routing';
import SvgIcon from 'spielekuenstla-website/components/svg-icon';
import 'spielekuenstla-website/styles/components/post-card.css';

// Reusable post card, flattened from the former empress-blog post-card.hbs.
// Used by the homepage feed and the author page. Pass @large to render the
// wide "featured" variant (the first card on the homepage).

function excerpt(text, words = 33) {
  if (!text) {
    return '';
  }

  const plain = text
    .replace(/<[^>]*>/g, ' ') // strip any inline HTML
    .replace(/[#*_>`]/g, '') // strip common markdown markers
    .replace(/\s+/g, ' ')
    .trim();

  const parts = plain.split(' ');
  if (parts.length <= words) {
    return plain;
  }

  return parts.slice(0, words).join(' ') + '…';
}

<template>
  <article
    class="post-card
      {{unless @post.image 'no-image'}}
      {{if @large 'post-card-large'}}"
  >
    {{#if @post.image}}
      <LinkTo @route="post" @model={{@post.id}} class="post-card-image-link">
        <img class="post-card-image" src={{@post.image}} alt={{@post.title}} />
      </LinkTo>
    {{/if}}

    <div class="post-card-content">

      <LinkTo @route="post" @model={{@post.id}} class="post-card-content-link">
        <header class="post-card-header">
          {{#if @post.primaryTag}}
            <span class="post-card-tags">
              {{if
                @post.primaryTag.name
                @post.primaryTag.name
                @post.primaryTag.slug
              }}
            </span>
          {{/if}}
          <h2 class="post-card-title">{{@post.title}}</h2>
        </header>

        <section class="post-card-excerpt">
          <p>{{excerpt @post.content}}</p>
        </section>
      </LinkTo>

      <footer class="post-card-meta">
        <ul class="author-list">
          {{#each @post.authors as |author|}}
            <li class="author-list-item">
              <div class="author-name-tooltip">{{author.name}}</div>
              <LinkTo
                @route="author"
                @model={{author.id}}
                class="static-avatar {{unless author.image 'avatar-wrapper'}}"
              >
                {{#if author.image}}
                  <img
                    class="author-profile-image"
                    src={{author.image}}
                    alt={{author.name}}
                  />
                {{else}}
                  <SvgIcon
                    @name="logo-spielekuenstla-headline"
                    class="author-fallback-icon"
                  />
                {{/if}}
              </LinkTo>
            </li>
          {{/each}}
        </ul>
      </footer>

    </div>
  </article>
</template>
