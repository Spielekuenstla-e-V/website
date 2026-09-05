import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'spielekuenstla-website/tests/helpers';

module('Application | index', function (hooks) {
  setupApplicationTest(hooks);

  test('renders a post feed of featured posts', async function (assert) {
    await visit('/');

    const content = this.owner.lookup('service:content');
    const expected = content.featuredPosts.length;

    assert.ok(expected > 0, 'there are featured posts to render');
    assert.dom('.post-feed').exists('the post feed container is rendered');
    assert
      .dom('.post-card')
      .exists({ count: expected }, 'one card per featured post');
    assert.dom('.post-card-title').exists('cards render a title');
  });

  test('marks the first card as large', async function (assert) {
    await visit('/');

    assert
      .dom('.post-card-large')
      .exists({ count: 1 }, 'exactly one card gets the large modifier');

    const cards = [...document.querySelectorAll('.post-feed .post-card')];
    assert.ok(
      cards[0].classList.contains('post-card-large'),
      'the first rendered card is the large one',
    );
  });

  test('renders the "Nächste Termine" event list with .ics links', async function (assert) {
    await visit('/');

    const content = this.owner.lookup('service:content');
    const expected = content.upcomingEvents(5).length;

    if (expected === 0) {
      assert.dom('#event-list li').doesNotExist('no upcoming events to show');
      return;
    }

    assert
      .dom('#event-list li')
      .exists({ count: expected }, 'one entry per upcoming event');
    assert
      .dom('#event-list li:first-child a')
      .hasAttribute(
        'href',
        /^data:text\/calendar/,
        'each entry links to a calendar data URL',
      );
    assert
      .dom('#event-list li:first-child a')
      .hasAttribute('download', /\.ics$/, 'download attribute names an .ics');
  });
});
