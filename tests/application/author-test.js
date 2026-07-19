import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'spielekuenstla-website/tests/helpers';

module('Application | author page', function (hooks) {
  setupApplicationTest(hooks);

  test('renders the author header (avatar, name, bio, post count)', async function (assert) {
    await visit('/author/jay');

    const content = this.owner.lookup('service:content');
    const author = content.authorById('jay');
    const posts = content.postsByAuthor('jay');

    assert.dom('.site-title').hasText(author.name, 'author name in header');
    assert
      .dom('.site-header-content .author-profile-image')
      .hasAttribute('src', author.image, 'avatar from front-matter');
    assert.dom('.author-bio').hasAnyText('bio rendered');
    assert
      .dom('.author-stats')
      .containsText(`${posts.length}`, 'shows the post count');
  });

  test('renders a feed of the author’s posts', async function (assert) {
    await visit('/author/jay');

    const posts = this.owner.lookup('service:content').postsByAuthor('jay');

    assert
      .dom('.post-feed .post-card')
      .exists({ count: posts.length }, 'one card per authored post');
  });

  test('author without an image falls back to a name avatar', async function (assert) {
    await visit('/author/anke');

    assert
      .dom('.site-header-content .avatar-wrapper')
      .exists('avatar wrapper placeholder shown');
    assert
      .dom('.site-header-content .author-profile-image')
      .doesNotExist('no image element for imageless author');
  });

  test('post byline links to the author page', async function (assert) {
    await visit('/20230811_treff');

    await click('.post-full-footer .author-card-name a');
    assert.strictEqual(currentURL(), '/author/dose', 'byline -> author page');
  });

  test('homepage post-card avatar links to the author page', async function (assert) {
    await visit('/');

    await click('.post-feed .post-card .author-list-item a');
    assert.ok(
      currentURL().startsWith('/author/'),
      `card avatar opens an author page (got ${currentURL()})`,
    );
  });

  test('/author/* does not collide with post or page routes', async function (assert) {
    await visit('/author/jay');
    assert.dom('.author-bio').exists('/author/jay resolves to the author page');

    await visit('/20230811_treff');
    assert
      .dom('.post-full-title')
      .exists('root post URL still resolves to a post');
  });
});
