/**
 * SSR entry point for the Ember application.
 *
 * Uses the same strict resolver as the client app but with autoboot
 * disabled so the server can control boot timing via app.visit().
 */
import EmberApp from 'ember-strict-application-resolver';
import PageTitleService from 'ember-page-title/services/page-title';
import config from './config/environment.js';
import Router from './router.js';

class App extends EmberApp {
  modulePrefix = config.modulePrefix;
  modules = {
    './router': Router,
    './services/page-title': PageTitleService,
    ...import.meta.glob('./{routes,templates}/**/*.{js,gjs}', { eager: true }),
    ...import.meta.glob('./services/*.js', { eager: true }),
    ...import.meta.glob('./controllers/*.js', { eager: true }),
  };
}

/**
 * Factory function for SSR. Creates a fresh Application instance
 * with autoboot disabled so the server can control the boot sequence
 * via app.visit(url, options).
 */
export function createSsrApp() {
  return App.create({
    ...config.APP,
    autoboot: false,
  });
}
