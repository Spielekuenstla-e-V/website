import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'spielekuenstla-website/tests/helpers';

const PAGES = [
  { route: '/page/charter', slug: 'charter' },
  { route: '/page/events', slug: 'events' },
  { route: '/page/legal', slug: 'legal' },
  { route: '/page/spielekuenstla', slug: 'spielekuenstla' },
];

module('Application | static pages', function (hooks) {
  setupApplicationTest(hooks);

  PAGES.forEach(({ route, slug }) => {
    test(`${route} renders the page title and body`, async function (assert) {
      await visit(route);

      const page = this.owner.lookup('service:content').pageBySlug(slug);
      assert.ok(page, `page "${slug}" exists in the content service`);

      assert
        .dom('.page-template .site-title')
        .hasText(page.title, 'renders the page title in the header');
      assert
        .dom('.post-full-content .post-content')
        .exists('renders the rendered markdown body');
      assert
        .dom('.post-full-content .post-content')
        .hasAnyText('body is not empty');
    });
  });

  test('/page/events renders its banner images from the body HTML', async function (assert) {
    await visit('/page/events');

    assert
      .dom('.post-content #meetup')
      .exists('the #meetup banner image is rendered from the markdown body');
  });

  test('a page with an image renders a hero figure', async function (assert) {
    await visit('/page/spielekuenstla');

    assert
      .dom('.post-full-image img')
      .exists('hero image is rendered when the page has one');
  });

  test('page images resolve to existing files under /images or /uploads', async function (assert) {
    for (const { route } of PAGES) {
      await visit(route);
      const srcs = [...document.querySelectorAll('.page-template img')].map(
        (img) => img.getAttribute('src'),
      );

      srcs.forEach((src) => {
        assert.ok(
          /^\/(images|uploads)\//.test(src),
          `${route}: image src "${src}" points at a public asset path`,
        );
      });
    }
  });

  test('spielekuenstla body links to the empress /page/charter route', async function (assert) {
    await visit('/page/spielekuenstla');

    assert
      .dom('.post-content a[href="/page/charter"]')
      .exists('internal charter link uses the /page/ URL scheme');
  });
});
