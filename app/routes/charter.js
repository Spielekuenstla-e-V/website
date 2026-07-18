import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CharterRoute extends Route {
  @service content;

  model() {
    return this.content.pageBySlug('charter');
  }
}
