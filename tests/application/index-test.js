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
    assert
      .dom('.post-feed')
      .exists('the post feed container is rendered');
    assert
      .dom('.post-card')
      .exists({ count: expected }, 'one card per featured post');
    assert
      .dom('.post-card-title')
      .exists('cards render a title');
  });

  test('marks the first card as large', async function (assert) {
    await visit('/');

    assert
      .dom('.post-feed .post-card:first-child')
      .hasClass('post-card-large', 'first card gets the large modifier');
  });
});
