import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service content;

  model() {
    return {
      featuredPosts: this.content.featuredPosts,
      events: this.content.upcomingEvents(5),
    };
  }
}
