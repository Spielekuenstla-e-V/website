import { pageTitle } from 'ember-page-title';
import PostCard from 'spielekuenstla-website/components/post-card';
import EventList from 'spielekuenstla-website/components/event-list';
import SvgIcon from 'spielekuenstla-website/components/svg-icon';
import '../styles/index.css';

// Flat homepage template stitched together from the former empress-blog
// index.hbs + the Ghost/Casper post-card partial (now the <PostCard>
// component). Post + event data comes from the `content` service via the
// index route model (see app/routes/index.js).

function isFirst(index) {
  return index === 0;
}

<template>
  {{pageTitle "Spielekünstla"}}

  <main id="site-main" class="site-main outer">
    <div class="inner">

      <div class="post-feed">

        <EventList @events={{@model.events}} />

        {{#each @model.featuredPosts as |post index|}}
          <PostCard @post={{post}} @large={{isFirst index}} />
        {{/each}}

      </div>

    </div>
  </main>
</template>
