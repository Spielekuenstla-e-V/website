import Controller from '@ember/controller';
import { DateTime } from 'luxon';

export default class IndexController extends Controller {
  currentCalendarDate = new Date();

  get allPostsInAscendingOrder() {
    return this.model.sortBy('date', 'asc');
  }

  get nearestEvents() {
    const currentDate = DateTime.fromJSDate(this.currentCalendarDate);
    return this.allPostsInAscendingOrder.reduce((mem, post) => {
      const postDate = DateTime.fromJSDate(post.date);
      if (currentDate <= postDate && post.meta?.event !== 'Zusammenfassung' && mem.length < 3) {
        const startTime = post.meta?.startTime ?? '17 Uhr';
        const endTime = post.meta?.endTime ? ` - ${post.meta?.endTime}` : '';
        mem.push({
          date: postDate.toFormat('EEEE, dd.MM.', { locale: 'de' }),
          name: post.meta?.event ?? 'Spieletreff',
          location: post.meta?.location ?? 'Lüerdissen "Bleibe"',
          time: `${startTime}${endTime}`,
        });
      }
      return mem;
    }, []);
  }

  get featuredPosts() {
    return this.allPostsInAscendingOrder.filter(({ featured }) => featured).reverse();
  }
}
