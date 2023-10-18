/* eslint-disable ember/no-classic-classes, prettier/prettier, ember/require-computed-property-dependencies, ember/no-get */
import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { service } from '@ember/service';
import { DateTime } from 'luxon';

/**
 * @param {Object} param0
 * @param {string} param0.name
 * @param {DateTime} param0.startDate
 * @param {DateTime} param0.endDate
 * @param {DateTime} param0.currentDate
 * @param {string} param0.description
 * @param {string} param0.location
 * @param {string} param0.url
 * @return {string}
 */
function generateICalendarAttributes({ name, startDate, endDate, currentDate, description, location, url }) {
  return encodeURI(`data:text/calendar;charset=utf8,BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//spielekuenstla.de//Calendar 1.0//EN
    CALSCALE:GREGORIAN
    BEGIN:VTIMEZONE
    TZID:Europe/Berlin
    LAST-MODIFIED:20230407T050750Z
    TZURL:https://www.tzurl.org/zoneinfo-outlook/Europe/Berlin
    X-LIC-LOCATION:Europe/Berlin
    BEGIN:DAYLIGHT
    TZNAME:CEST
    TZOFFSETFROM:+0100
    TZOFFSETTO:+0200
    DTSTART:19700329T020000
    RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
    END:DAYLIGHT
    BEGIN:STANDARD
    TZNAME:CET
    TZOFFSETFROM:+0200
    TZOFFSETTO:+0100
    DTSTART:19701025T030000
    RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
    END:STANDARD
    END:VTIMEZONE
    BEGIN:VEVENT
    DTSTAMP:${currentDate.toFormat('yyyyMMdd')}T${currentDate.toFormat('HHmmss')}Z,
    UID:${url},
    DTSTART;TZID=Europe/Berlin:${startDate.toFormat('yyyyMMdd')}T${startDate.toFormat('HHmmss')}
    DTEND;TZID=Europe/Berlin:${endDate.toFormat('yyyyMMdd')}T${endDate.toFormat('HHmmss')}
    SUMMARY:${name},
    DESCRIPTION:${description.replace(/,/g, '\,')},
    LOCATION:${location.replace(/,/g, '\,')}
    URL:${url},
    END:VEVENT
    END:VCALENDAR
  `.replace(/  /g, ''));
}

export default class IndexController extends Controller.extend({
  blog: service(),
  url: service(),

  queryParams: Object.freeze(['page']),
  page: '/content/content-0.json',

  coverImageStyle: computed('blog.coverImage', function() {
    return htmlSafe(`background-image: url(${get(this, 'url.prefix')}${get(this, 'blog.coverImage')})`);
  }),

  pageNumber: computed('page', function() {
    let page = parseInt(this.page.match(/content\/content-(.*).json/)[1]);
    return page + 1;
  }),

  numerOfPages: computed('model.links.last', function() {
    let pages = parseInt(this.model.links.last.match(/content\/content-(.*).json/)[1]);
    return pages + 1;
  }),
}) {
  @service router;

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
        const name = post.meta?.event ?? 'Spieletreff';
        const [ endHour, endMinute ] = (post.meta?.endTime ?? '23 Uhr').split(' ')[0].split(':');
        const endDateTimeObject = endMinute
          ? { hour: Number(endHour), minute: Number(endMinute) }
          : { hour: Number(endHour) };

        const icsLink = generateICalendarAttributes({
          name,
          startDate: postDate,
          endDate: DateTime.fromJSDate(post.date).set(endDateTimeObject),
          currentDate,
          description: post.primaryTag.content,
          location: post.meta?.location ?? 'Lüerdissen "Bleibe", Lüerdisser Weg 91, 32657 Lemgo',
          url: this.router.urlFor('post', post.id),
        });

        mem.push({
          date: postDate.toFormat('EEEE, dd.MM.', { locale: 'de' }),
          name,
          location: post.meta?.location ?? 'Lüerdissen "Bleibe"',
          time: `${startTime}${endTime}`,
          icsTitle: encodeURI(name),
          icsLink,
        });
      }
      return mem;
    }, []);
  }

  get featuredPosts() {
    return this.allPostsInAscendingOrder.filter(({ featured }) => featured).reverse();
  }
}
