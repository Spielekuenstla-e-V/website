import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'spielekuenstla-website/tests/helpers';

// "Chrome" here = site chrome (header + footer), not the browser.
module('Application | site chrome', function (hooks) {
  setupApplicationTest(hooks);

  test('header and footer render on every route', async function (assert) {
    await visit('/');
    assert.dom('.site-nav-header').exists('header on the homepage');
    assert.dom('.site-footer').exists('footer on the homepage');

    await visit('/page/charter');
    assert.dom('.site-nav-header').exists('header on a static page');
    assert.dom('.site-footer').exists('footer on a static page');
  });

  test('header navigation links to the page routes', async function (assert) {
    await visit('/');

    assert.dom('.site-nav .nav li').exists({ count: 4 }, 'four nav items');

    await click('.site-nav .nav-verein a');
    assert.strictEqual(currentURL(), '/page/spielekuenstla', 'Verein -> page');

    await visit('/');
    await click('.site-nav .nav-angebote a');
    assert.strictEqual(currentURL(), '/page/events', 'Angebote -> events');

    await visit('/');
    await click('.site-nav .nav-satzung a');
    assert.strictEqual(
      currentURL(),
      '/page/charter',
      'Gründungssatzung -> charter',
    );
  });

  test('footer INFO links point to the page routes', async function (assert) {
    await visit('/');

    const targets = {
      events: '/page/events',
      spielekuenstla: '/page/spielekuenstla',
      charter: '/page/charter',
      legal: '/page/legal',
    };

    for (const [slug, url] of Object.entries(targets)) {
      await visit('/');
      await click(`.site-footer-nav[aria-label="Info"] a[href="${url}"]`);
      assert.strictEqual(currentURL(), url, `footer link -> ${slug}`);
    }
  });

  test('footer social links only include configured networks', async function (assert) {
    await visit('/');

    const links = [
      ...document.querySelectorAll(
        '.site-footer-nav[aria-label="Social Media"] a',
      ),
    ];

    assert.ok(
      links.every((a) => (a.getAttribute('href') ?? '') !== ''),
      'no empty placeholder links remain',
    );
    assert
      .dom('.site-footer-nav[aria-label="Social Media"]')
      .doesNotContainText('Facebook', 'Facebook link removed');
    assert
      .dom('.site-footer-nav[aria-label="Social Media"]')
      .doesNotContainText('Twitter', 'Twitter link removed');
  });
});
