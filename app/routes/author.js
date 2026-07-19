import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthorRoute extends Route {
  @service content;

  model(params) {
    const author = this.content.authorById(params.author_id);
    if (!author) {
      return null;
    }

    return {
      author,
      posts: this.content.postsByAuthor(author.id),
    };
  }
}
