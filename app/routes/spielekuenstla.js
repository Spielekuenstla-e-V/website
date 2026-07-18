import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SpielekuenstlaRoute extends Route {
  @service content;

  model() {
    return this.content.pageBySlug('spielekuenstla');
  }
}
