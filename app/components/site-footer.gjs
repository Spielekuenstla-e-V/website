import { LinkTo } from '@ember/routing';

// Site footer. Flattened from the former empress-blog application.hbs footer.
// The INFO column links to the restored page routes; the "Angebote" (events)
// link — which was commented out on master — is now wired up since that page
// has been restored.
//
// MISSING / EMPTY LINKS (left empty for now, reported to the user):
//   * Facebook — never configured on master (blog.facebook was unset)
//   * Twitter/X — never configured on master (blog.twitter was unset)
// The email subscribe form and RSS feed from the original theme are dropped
// (no mailing list / feed backend yet).

function currentYear() {
  return new Date().getFullYear();
}

<template>
  <footer class="site-footer outer">
    <div class="site-footer-content inner">
      <nav class="site-footer-nav" aria-label="Info">
        <h3>INFO</h3>
        <ul class="nav-link-list">
          <li><LinkTo @route="events">Angebote</LinkTo></li>
          <li><LinkTo @route="spielekuenstla">Verein</LinkTo></li>
          <li><LinkTo @route="charter">Gründungssatzung</LinkTo></li>
          <li><a href="mailto:info@spielekuenstla.de">Kontakt</a></li>
          <li><LinkTo @route="legal">Impressum</LinkTo></li>
        </ul>
      </nav>

      <nav class="site-footer-nav" aria-label="Social Media">
        <h3>SOCIAL MEDIA</h3>
        <ul class="nav-link-list">
          <li>
            <a
              href="https://rezensionen-fuer-millionen.blogspot.com/2018/10/spielend-fur-toleranz.html"
              target="_blank"
              rel="noopener noreferrer"
            >Spielend für Toleranz</a>
          </li>
          <li>
            <a
              href="https://discord.gg/7vd8c9Ev7t"
              title="Trete dem Spielekünstla Discord bei"
              target="_blank"
              rel="noopener noreferrer"
            >Discord</a>
          </li>
          <li>
            <a
              href="https://instagram.com/spielekuenstla"
              title="Besuche Spielekünstla auf Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >Instagram</a>
          </li>
        </ul>
      </nav>
    </div>
    <section class="inner">
      Spielekünstla e.V. &copy; {{currentYear}}
    </section>
  </footer>
</template>
