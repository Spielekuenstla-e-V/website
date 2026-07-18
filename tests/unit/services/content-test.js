import { module, test } from 'qunit';
import { setupTest } from 'spielekuenstla-website/tests/helpers';

module('Unit | Service | content', function (hooks) {
  setupTest(hooks);

  test('loads posts, authors, pages and tags from virtual:content', function (assert) {
    const content = this.owner.lookup('service:content');

    assert.ok(content.posts.length > 100, 'posts are loaded');
    assert.ok(content.authors.length > 0, 'authors are loaded');
    assert.ok(content.pages.length > 0, 'pages are loaded');
    assert.ok(content.tags.length > 0, 'tags are loaded');
  });

  test('posts are sorted newest first', function (assert) {
    const content = this.owner.lookup('service:content');
    const dates = content.posts
      .map((post) => post.date)
      .filter((date) => date instanceof Date);

    for (let i = 1; i < dates.length; i++) {
      assert.ok(
        dates[i - 1] >= dates[i],
        'each post is not older than the next',
      );
    }
  });

  test('renders markdown body to HTML at build time', function (assert) {
    const content = this.owner.lookup('service:content');
    const withBody = content.posts.find((post) => post.content.length > 0);

    assert.ok(withBody, 'found a post with a body');
    assert.ok(
      withBody.html.includes('<'),
      'body was rendered to HTML (contains a tag)',
    );
  });

  test('resolves author and tag relationships', function (assert) {
    const content = this.owner.lookup('service:content');
    const treff = content.postById('20230811_treff');

    assert.ok(treff, 'found the Spielekünstla-Treff post');
    assert.strictEqual(
      treff.primaryAuthor?.id,
      'dose',
      'primary author resolved to a record',
    );
    assert.strictEqual(
      treff.primaryTag?.slug,
      'spieleabend',
      'primary tag resolved to a record',
    );
  });

  test('featuredPosts only contains featured posts', function (assert) {
    const content = this.owner.lookup('service:content');

    assert.ok(content.featuredPosts.length > 0, 'has featured posts');
    assert.ok(
      content.featuredPosts.every((post) => post.featured),
      'every featured post is flagged featured',
    );
  });
});
