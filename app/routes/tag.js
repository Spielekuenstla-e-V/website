import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class TagRoute extends Route {
  @service content;

  model(params) {
    const tag = this.content.tagBySlug(params.tag_id);
    if (!tag) {
      return null;
    }

    return {
      tag,
      posts: this.content.postsByTag(tag.slug),
    };
  }
}
