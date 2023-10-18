import EmberRouter from '@ember/routing/router';
import config from 'spielekuenstla-website/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('post', { path: ':id' });
  this.route('page', { path: '/page/:id' });
  this.route('author', { path: '/author/:id'});
  this.route('tag', { path: '/tag/:id' });
  this.route('legal');
});
