import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { DateTime } from 'luxon';

// Rough words-per-minute used for the reading-time estimate (Ghost/Casper
// used ~275; keep it simple and deterministic).
const WORDS_PER_MINUTE = 275;

function readingTimeMinutes(html) {
  const words = (html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export default class PostRoute extends Route {
  @service content;

  model(params) {
    const result = this.content.postWithSiblings(params.post_id);
    if (!result) {
      return null;
    }

    const { post } = result;
    const date = post.date ? DateTime.fromJSDate(post.date).setLocale('de') : null;

    return {
      ...result,
      isoDate: date ? date.toFormat('yyyy-MM-dd') : '',
      displayDate: date ? date.toFormat('d. MMMM yyyy') : '',
      readingTime: `${readingTimeMinutes(post.html)} min read`,
    };
  }
}
