import { pageTitle } from 'ember-page-title';
import PostCard from 'spielekuenstla-website/components/post-card';
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
                    <SvgIcon @name="calendar-add" class="calendar-add-icon" />
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
          <PostCard @post={{post}} @large={{isFirst index}} />
        {{/each}}

      </div>

    </div>
  </main>
</template>
