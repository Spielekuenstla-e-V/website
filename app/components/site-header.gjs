import { LinkTo } from '@ember/routing';

// Site header with primary navigation. Flattened from the former empress-blog
// header.hbs + site-nav.hbs. The navigation links point at the restored page
// routes. Social links reproduce the ones that were actually configured on
// master (Discord + Instagram); Facebook/Twitter were never configured and are
// omitted. See MISSING-LINKS note in the footer component.

<template>
  <header class="site-nav-header outer">
    <div class="inner">
      <nav class="site-nav" aria-label="Hauptnavigation">
        <div class="site-nav-left">
          <LinkTo @route="index" class="site-nav-logo">Spielekünstla</LinkTo>

          <ul class="nav" role="menu">
            <li class="nav-neuigkeiten" role="menuitem">
              <LinkTo @route="index">Neuigkeiten</LinkTo>
            </li>
            <li class="nav-verein" role="menuitem">
              <LinkTo @route="spielekuenstla">Verein</LinkTo>
            </li>
            <li class="nav-angebote" role="menuitem">
              <LinkTo @route="events">Angebote</LinkTo>
            </li>
            <li class="nav-satzung" role="menuitem">
              <LinkTo @route="charter">Gründungssatzung</LinkTo>
            </li>
          </ul>

          <div class="social-links">
            <a
              class="social-link"
              href="https://discord.gg/7vd8c9Ev7t"
              title="Trete dem Spielekünstla Discord bei"
              target="_blank"
              rel="noopener noreferrer"
            >Discord</a>
            <a
              class="social-link"
              href="https://instagram.com/spielekuenstla"
              title="Besuche Spielekünstla auf Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >Instagram</a>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
