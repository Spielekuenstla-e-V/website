import EmberRouter from '@embroider/router';
import config from 'spielekuenstla-website/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Static content pages live under /page/:page_id (empress-blog URL scheme).
  this.route('page', { path: '/page/:page_id' });
});
