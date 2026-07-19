import { LinkTo } from '@ember/routing';

// Author byline for the post detail page. Consolidated from the former
// empress-blog byline-single.hbs and byline-multiple.hbs partials into a
// single component that adapts to one or many authors. Author names link to
// the author profile page (/author/:id).

function isMultiple(authors) {
  return (authors?.length ?? 0) > 1;
}

function firstAuthor(authors) {
  return authors?.[0];
}

<template>
  {{#if (isMultiple @authors)}}
    <section class="post-full-authors">
      <div class="post-full-authors-content">
        <p>Dieser Beitrag ist eine Zusammenarbeit von</p>
      </div>

      <ul class="author-list">
        {{#each @authors as |author|}}
          <li class="author-list-item">
            <div class="author-card">
              <div class="basic-info">
                {{#if author.image}}
                  <img
                    class="author-profile-image"
                    src={{author.image}}
                    alt={{author.name}}
                  />
                {{else}}
                  <div class="author-profile-image avatar-wrapper">
                    {{author.name}}
                  </div>
                {{/if}}
                <h2>
                  <LinkTo @route="author" @model={{author.id}}>
                    {{author.name}}
                  </LinkTo>
                </h2>
              </div>
              {{#if author.content}}
                <div class="bio">
                  <p>{{author.content}}</p>
                </div>
              {{/if}}
            </div>

            {{#if author.image}}
              <span class="moving-avatar">
                <img
                  class="author-profile-image"
                  src={{author.image}}
                  alt={{author.name}}
                />
              </span>
            {{else}}
              <span
                class="moving-avatar author-profile-image avatar-wrapper"
              >{{author.name}}</span>
            {{/if}}
          </li>
        {{/each}}
      </ul>
    </section>
  {{else if @authors.length}}
    {{#let (firstAuthor @authors) as |author|}}
      <section class="author-card">
        {{#if author.image}}
          <img
            class="author-profile-image"
            src={{author.image}}
            alt={{author.name}}
          />
        {{else}}
          <span class="avatar-wrapper">{{author.name}}</span>
        {{/if}}
        <section class="author-card-content">
          <h4 class="author-card-name">
            <LinkTo @route="author" @model={{author.id}}>{{author.name}}</LinkTo>
          </h4>
          {{#if author.content}}
            <p>{{author.content}}</p>
          {{/if}}
        </section>
      </section>
      <div class="post-full-footer-right">
        <LinkTo
          @route="author"
          @model={{author.id}}
          class="author-card-button"
        >Mehr lesen</LinkTo>
      </div>
    {{/let}}
  {{/if}}
</template>
