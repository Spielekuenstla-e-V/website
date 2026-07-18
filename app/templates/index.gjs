import { pageTitle } from 'ember-page-title';
import '../styles/index.css';

// Flat homepage template stitched together from the former empress-blog
// index.hbs + the Ghost/Casper post-card partial. Header, footer and
// navigation are intentionally omitted for now and will be reintroduced later.
// Post + event data comes from the `content` service via the index route
// model (see app/routes/index.js).

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

        <div class="outer">
          <div class="inner">
            <h2>Nächste Termine:</h2>

            <ul id="event-list">
              {{#each @model.events as |event|}}
                <li>
                  <a
                    href={{event.icsLink}}
                    download="{{event.icsTitle}}.ics"
                    title="Kalendereintrag speichern"
                  >
                    <svg
                      class="calendar-add-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                    ><path
                        d="M184 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H96c-35.3 0-64 28.7-64 64v16 48V448c0 35.3 28.7 64 64 64H416c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H376V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H184V24zM80 192H432V448c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16V192zm176 40c-13.3 0-24 10.7-24 24v48H184c-13.3 0-24 10.7-24 24s10.7 24 24 24h48v48c0 13.3 10.7 24 24 24s24-10.7 24-24V352h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H280V256c0-13.3-10.7-24-24-24z"
                      /></svg>
                    {{event.date}}
                  </a>
                  |
                  <strong>{{event.name}}</strong>
                  @
                  {{event.location}}
                  ({{event.time}})
                </li>
              {{/each}}
            </ul>
          </div>
        </div>

        {{#each @model.featuredPosts as |post index|}}

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
