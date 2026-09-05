import SvgIcon from 'spielekuenstla-website/components/svg-icon';
import 'spielekuenstla-website/styles/components/event-list.css';

<template>
  <div class="outer">
    <div class="inner">
      <h2>Nächste Termine:</h2>

      <ul id="event-list" class="event-list">
        {{#each @events as |event|}}
          <li class="event-list-item">
            <a
              class="event-list-item-link"
              href={{event.icsLink}}
              download="{{event.icsTitle}}.ics"
              title="Kalendereintrag speichern"
            >
              <SvgIcon @name="calendar-add" class="calendar-add-icon" />
              {{event.date}} <strong>| {{event.name}}</strong>
            </a>
            @ {{event.location}} ({{event.time}})
          </li>
        {{/each}}
      </ul>
    </div>
  </div>
</template>
