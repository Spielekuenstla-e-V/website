import { pageTitle } from 'ember-page-title';
import { htmlSafe } from '@ember/template';
import PostCard from 'spielekuenstla-website/components/post-card';
import SvgIcon from 'spielekuenstla-website/components/svg-icon';
import '../styles/author.css';

// Author profile page, flattened from the former empress-blog author.hbs plus
// the Ghost/Casper "Author Template" styles. Shows the author header (avatar,
// name, bio, meta) followed by a feed of that author's posts (<PostCard>).

function bio(html) {
  return htmlSafe(html ?? '');
}

function postCount(posts) {
  const count = posts?.length ?? 0;
  if (count === 0) {
    return 'Keine Beiträge';
  }
  return count === 1 ? '1 Beitrag' : `${count} Beiträge`;
}

<template>
  {{#let @model.author as |author|}}
    {{pageTitle author.name}}

    <header class="site-header outer author-template-header">
      <div class="inner">
        <div class="site-header-content">
          {{#if author.image}}
            <img
              class="author-profile-image"
              src={{author.image}}
              alt={{author.name}}
            />
          {{else}}
            <span class="avatar-wrapper">
              <SvgIcon @name="logo-spielekuenstla-headline" />
            </span>
          {{/if}}

          <h1 class="site-title">{{author.name}}</h1>

          {{#if author.content}}
            <h2 class="author-bio">{{bio author.html}}</h2>
          {{/if}}

          <div class="author-meta">
            {{#if author.location}}
              <div class="author-location">{{author.location}}</div>
              <span class="bull">&bull;</span>
            {{/if}}
            <div class="author-stats">{{postCount @model.posts}}</div>
            {{#if author.website}}
              <span class="bull">&bull;</span>
              <a
                class="social-link social-link-wb"
                href={{author.website}}
                target="_blank"
                rel="noopener noreferrer"
              >Website</a>
            {{/if}}
            {{#if author.twitter}}
              <span class="bull">&bull;</span>
              <a
                class="social-link social-link-tw"
                href="https://twitter.com/{{author.twitter}}"
                target="_blank"
                rel="noopener noreferrer"
              >Twitter</a>
            {{/if}}
            {{#if author.facebook}}
              <span class="bull">&bull;</span>
              <a
                class="social-link social-link-fb"
                href="https://www.facebook.com/{{author.facebook}}"
                target="_blank"
                rel="noopener noreferrer"
              >Facebook</a>
            {{/if}}
          </div>
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
