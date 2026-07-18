import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'spielekuenstla-website/tests/helpers';

const PAGES = [
  { route: '/charter', slug: 'charter' },
  { route: '/events', slug: 'events' },
  { route: '/legal', slug: 'legal' },
  { route: '/spielekuenstla', slug: 'spielekuenstla' },
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

  test('/events renders its banner images from the body HTML', async function (assert) {
    await visit('/events');

    assert
      .dom('.post-content #meetup')
      .exists('the #meetup banner image is rendered from the markdown body');
  });

  test('a page with an image renders a hero figure', async function (assert) {
    await visit('/spielekuenstla');

    assert
      .dom('.post-full-image img')
      .exists('hero image is rendered when the page has one');
  });
});
