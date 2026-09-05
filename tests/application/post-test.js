import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'spielekuenstla-website/tests/helpers';

module('Application | post detail', function (hooks) {
  setupApplicationTest(hooks);

  test('renders title, meta, hero image and rendered body', async function (assert) {
    await visit('/20230811_treff');

    const post = this.owner.lookup('service:content').postById('20230811_treff');

    assert.dom('.post-full-title').hasText(post.title, 'post title');
    assert.dom('.post-full-meta-date').exists('renders a date');
    assert
      .dom('.post-full-meta-date')
      .hasAttribute('datetime', '2023-08-11', 'ISO date attribute');
    assert
      .dom('.post-full-meta-readtime')
      .containsText('min read', 'reading time shown');
    assert
      .dom('.post-full-image img')
      .hasAttribute('src', post.image, 'hero image from front-matter');
    assert
      .dom('.post-full-content .post-content')
      .hasAnyText('rendered markdown body is present');
  });

  test('single-author post shows the single byline', async function (assert) {
    await visit('/20230811_treff');

    assert
      .dom('.post-full-footer .author-card .author-card-name')
      .exists('single author card rendered');
    assert
      .dom('.post-full-footer .post-full-authors')
      .doesNotExist('no multiple-author layout');
  });

  test('multi-author post shows the collaboration byline', async function (assert) {
    await visit('/20231013_zusammenfassung');

    assert
      .dom('.post-full-authors')
      .exists('multiple-author layout rendered');
    assert
      .dom('.post-full-authors .author-list-item')
      .exists({ count: 2 }, 'one entry per author');
  });

  test('previous/next navigation links to sibling posts', async function (assert) {
    await visit('/20230811_treff');

    const { nextPost, prevPost } = this.owner
      .lookup('service:content')
      .postWithSiblings('20230811_treff');

    // This post sits in the middle of the timeline, so both neighbours exist.
    assert.ok(prevPost, 'has an older sibling');
    assert.ok(nextPost, 'has a newer sibling');
    assert.dom('.post-nav').exists('navigation block rendered');

    await click('.post-nav-prev');
    assert.strictEqual(
      currentURL(),
      `/${prevPost.id}`,
      'older post link navigates',
    );

    await visit('/20230811_treff');
    await click('.post-nav-next');
    assert.strictEqual(
      currentURL(),
      `/${nextPost.id}`,
      'newer post link navigates',
    );
  });

  test('post lives at the root and does not shadow /page/* routes', async function (assert) {
    await visit('/20230811_treff');
    assert
      .dom('.post-full-title')
      .exists('root URL resolves to the post detail page');

    await visit('/page/charter');
    assert
      .dom('.page-template .site-title')
      .exists('/page/* still resolves to the static page, not a post');
  });

  test('homepage post cards link to the post detail page', async function (assert) {
    await visit('/');

    const firstFeatured = this.owner.lookup('service:content').featuredPosts[0];

    await click('.post-feed .post-card .post-card-content-link');
    assert.strictEqual(
      currentURL(),
      `/${firstFeatured.id}`,
      'clicking a card opens its post',
    );
  });
});
