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

    await visit('/charter');
    assert.dom('.site-nav-header').exists('header on a static page');
    assert.dom('.site-footer').exists('footer on a static page');
  });

  test('header navigation links to the restored pages', async function (assert) {
    await visit('/');

    assert.dom('.site-nav .nav li').exists({ count: 4 }, 'four nav items');

    await click('.site-nav .nav-verein a');
    assert.strictEqual(currentURL(), '/spielekuenstla', 'Verein -> page');

    await visit('/');
    await click('.site-nav .nav-angebote a');
    assert.strictEqual(currentURL(), '/events', 'Angebote -> events');

    await visit('/');
    await click('.site-nav .nav-satzung a');
    assert.strictEqual(currentURL(), '/charter', 'Gründungssatzung -> charter');
  });

  test('footer INFO links point to the restored pages', async function (assert) {
    await visit('/');

    const targets = {
      events: '/events',
      spielekuenstla: '/spielekuenstla',
      charter: '/charter',
      legal: '/legal',
    };

    for (const [slug, url] of Object.entries(targets)) {
      await visit('/');
      await click(`.site-footer-nav[aria-label="Info"] a[href="${url}"]`);
      assert.strictEqual(currentURL(), url, `footer link -> ${slug}`);
    }
  });

  test('missing social links are present but empty', async function (assert) {
    await visit('/');

    const empties = [
      ...document.querySelectorAll(
        '.site-footer-nav[aria-label="Social Media"] a',
      ),
    ].filter((a) => a.getAttribute('href') === '');

    assert.strictEqual(
      empties.length,
      2,
      'Facebook and Twitter are placeholders with empty href',
    );
  });
});
