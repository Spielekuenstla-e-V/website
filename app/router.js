import EmberRouter from '@embroider/router';
import config from 'spielekuenstla-website/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Static content pages live under /page/:page_id (empress-blog URL scheme).
  this.route('page', { path: '/page/:page_id' });
  // Author profiles live under /author/:author_id (empress-blog URL scheme).
  this.route('author', { path: '/author/:author_id' });
  // Tag archives live under /tag/:tag_id (empress-blog URL scheme).
  this.route('tag', { path: '/tag/:tag_id' });
  // Blog posts live at the root, e.g. /20230811_treff (empress-blog URL scheme).
  // Declared last so the more specific routes above take precedence.
  this.route('post', { path: '/:post_id' });
});
