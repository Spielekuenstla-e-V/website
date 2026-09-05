import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'spielekuenstla-website/tests/helpers';

module('Application | tag page', function (hooks) {
  setupApplicationTest(hooks);

  test('renders the tag header with name and description', async function (assert) {
    await visit('/tag/spieleabend');

    const tag = this.owner.lookup('service:content').tagBySlug('spieleabend');

    assert.dom('.site-title').hasText(tag.name, 'tag name in header');
    assert.dom('.site-description').hasAnyText('description rendered');
  });

  test('renders a feed of the tag’s posts', async function (assert) {
    await visit('/tag/spieleabend');

    const posts = this.owner.lookup('service:content').postsByTag('spieleabend');

    assert.ok(posts.length > 0, 'tag has posts');
    assert
      .dom('.post-feed .post-card')
      .exists({ count: posts.length }, 'one card per tagged post');
  });

  test('tag without a description falls back to a post count', async function (assert) {
    await visit('/tag/new');

    assert
      .dom('.site-description')
      .hasAnyText('post-count fallback is shown');
  });

  test('post detail meta tag links to the tag page', async function (assert) {
    await visit('/20230811_treff');

    const tag = this.owner
      .lookup('service:content')
      .postById('20230811_treff').primaryTag;

    await click('.post-full-meta-tag');
    assert.strictEqual(
      currentURL(),
      `/tag/${tag.slug}`,
      'primary tag link opens the tag archive',
    );
  });

  test('/tag/* does not collide with post, author or page routes', async function (assert) {
    await visit('/tag/spieleabend');
    assert
      .dom('.tag-template-header')
      .exists('/tag/spieleabend resolves to the tag page');

    await visit('/20230811_treff');
    assert
      .dom('.post-full-title')
      .exists('root post URL still resolves to a post');
  });
});
