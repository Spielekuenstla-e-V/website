import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PageRoute extends Route {
  @service content;

  model(params) {
    return this.content.pageBySlug(params.page_id);
  }
}
