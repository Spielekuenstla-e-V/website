import { pageTitle } from 'ember-page-title';
import '../styles/index.css';

// Flat homepage template stitched together from the former empress-blog
// index.hbs + the Ghost/Casper post-card partial. Header, footer, navigation
// and the "Nächste Termine" event list are intentionally omitted for now and
// will be reintroduced later. Post data comes from the `content` service via
// the index route model (featured posts).

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

function isFirst(index) {
  return index === 0;
}

<template>
  {{pageTitle "Spielekünstla"}}

  <main id="site-main" class="site-main outer">
    <div class="inner">

      <div class="post-feed">

        {{#each @model as |post index|}}

          <article
            class="post-card
              {{unless post.image 'no-image'}}
              {{if (isFirst index) 'post-card-large'}}"
          >

            {{#if post.image}}
              <div class="post-card-image-link">
                <img
                  class="post-card-image"
                  src={{post.image}}
                  alt={{post.title}}
                />
              </div>
            {{/if}}

            <div class="post-card-content">

              <div class="post-card-content-link">

                <header class="post-card-header">
                  {{#if post.primaryTag}}
                    <span class="post-card-tags">
                      {{if post.primaryTag.name post.primaryTag.name post.primaryTag.slug}}
                    </span>
                  {{/if}}
                  <h2 class="post-card-title">{{post.title}}</h2>
                </header>

                <section class="post-card-excerpt">
                  <p>{{excerpt post.content}}</p>
                </section>

              </div>

              <footer class="post-card-meta">
                <ul class="author-list">
                  {{#each post.authors as |author|}}
                    <li class="author-list-item">
                      <div class="author-name-tooltip">{{author.name}}</div>
                      {{#if author.image}}
                        <span class="static-avatar">
                          <img
                            class="author-profile-image"
                            src={{author.image}}
                            alt={{author.name}}
                          />
                        </span>
                      {{else}}
                        <span class="static-avatar avatar-wrapper">{{author.name}}</span>
                      {{/if}}
                    </li>
                  {{/each}}
                </ul>
              </footer>

            </div>{{! /.post-card-content }}

          </article>

        {{/each}}

      </div>

    </div>
  </main>
</template>
