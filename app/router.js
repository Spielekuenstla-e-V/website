import EmberRouter from '@embroider/router';
import config from 'spielekuenstla-website/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('charter');
  this.route('events');
  this.route('legal');
  this.route('spielekuenstla');
});
