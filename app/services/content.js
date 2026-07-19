import Service from '@ember/service';
import { DateTime } from 'luxon';
import {
  posts as rawPosts,
  authors as rawAuthors,
  pages as rawPages,
  tags as rawTags,
} from 'virtual:content';

const DEFAULT_START_TIME = '17 Uhr';
const DEFAULT_END_TIME = '23 Uhr';
const DEFAULT_EVENT_NAME = 'Spieletreff';
const DEFAULT_ICS_LOCATION =
  'Lüerdissen "Bleibe", Lüerdisser Weg 91, 32657 Lemgo';
const DEFAULT_LOCATION = 'Lüerdissen "Bleibe"';

/**
 * Build a `data:text/calendar` URL for a single event. Ported verbatim (only
 * reformatted) from the pre-Vite index controller on `master`. The resulting
 * href is used as a downloadable `.ics` file in the "Nächste Termine" list.
 */
function generateICalendarAttributes({
  name,
  startDate,
  endDate,
  currentDate,
  description,
  location,
  url,
}) {
  return encodeURI(
    `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
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
    DESCRIPTION:${(description ?? '').replace(/,/g, '\\,')},
    LOCATION:${location.replace(/,/g, '\\,')}
    URL:${url},
    END:VEVENT
    END:VCALENDAR
  `.replace(/ {2}/g, ''),
  );
}

/**
 * Read-only content layer backed by the `virtual:content` Vite module
 * (see lib/vite-content-plugin.mjs). Markdown is already parsed and rendered
 * to HTML at build time; this service only resolves relationships between
 * posts, authors and tags and exposes convenient lookups.
 *
 * This intentionally does NOT use ember-data / warp-drive: the data is fully
 * static and known at build time, so a store would add ceremony without
 * benefit. If a real backend is added later (e.g. a live game list), revisit.
 */
export default class ContentService extends Service {
  #authorsById;
  #tagsBySlug;
  #posts;
  #pagesBySlug;

  constructor() {
    super(...arguments);

    this.#authorsById = new Map(rawAuthors.map((a) => [a.id, { ...a }]));
    this.#tagsBySlug = new Map(rawTags.map((t) => [t.slug, { ...t }]));
    this.#pagesBySlug = new Map(rawPages.map((p) => [p.slug, { ...p }]));

    this.#posts = rawPosts
      .map((post) => this.#hydratePost(post))
      .sort((a, b) => b.date - a.date);
  }

  #hydratePost(post) {
    const date = post.date ? new Date(post.date) : null;
    const authors = (post.authors ?? [])
      .map((id) => this.#authorsById.get(id))
      .filter(Boolean);
    const tags = (post.tags ?? [])
      .map((slug) => this.#tagsBySlug.get(slug))
      .filter(Boolean);

    return {
      ...post,
      date,
      authors,
      tags,
      primaryAuthor: authors[0] ?? null,
      primaryTag: tags[0] ?? null,
    };
  }

  /** All posts, newest first. */
  get posts() {
    return this.#posts;
  }

  /** Posts flagged `featured: true`, newest first. */
  get featuredPosts() {
    return this.#posts.filter((post) => post.featured);
  }

  get authors() {
    return [...this.#authorsById.values()];
  }

  get tags() {
    return [...this.#tagsBySlug.values()];
  }

  get pages() {
    return [...this.#pagesBySlug.values()];
  }

  postById(id) {
    return this.#posts.find((post) => post.id === id) ?? null;
  }

  /**
   * A post plus its chronological neighbours, for the post detail page.
   * `#posts` is sorted newest-first, so the "next" (newer) post is the one
   * before it in the array and the "previous" (older) post is the one after.
   */
  postWithSiblings(id) {
    const index = this.#posts.findIndex((post) => post.id === id);
    if (index === -1) {
      return null;
    }

    return {
      post: this.#posts[index],
      nextPost: this.#posts[index - 1] ?? null,
      prevPost: this.#posts[index + 1] ?? null,
    };
  }

  authorById(id) {
    return this.#authorsById.get(id) ?? null;
  }

  tagBySlug(slug) {
    return this.#tagsBySlug.get(slug) ?? null;
  }

  pageBySlug(slug) {
    return this.#pagesBySlug.get(slug) ?? null;
  }

  /** Posts authored by a given author id, newest first. */
  postsByAuthor(id) {
    return this.#posts.filter((post) =>
      post.authors.some((author) => author.id === id),
    );
  }

  /** Posts carrying a given tag slug, newest first. */
  postsByTag(slug) {
    return this.#posts.filter((post) =>
      post.tags.some((tag) => tag.slug === slug),
    );
  }

  /**
   * The next `limit` upcoming events (default 3), as view-models for the
   * "Nächste Termine" list. Ported from the pre-Vite index controller:
   *
   *  - posts stay listed until the day after their date has passed,
   *  - recaps (`meta.event === 'Zusammenfassung'`) are excluded,
   *  - each entry carries a downloadable `.ics` data URL.
   *
   * `now` is injectable so tests can pin "today".
   */
  upcomingEvents(limit = 3, now = new Date()) {
    const currentDate = DateTime.fromJSDate(now);
    const ascending = [...this.#posts].sort((a, b) => a.date - b.date);

    return ascending.reduce((events, post) => {
      if (events.length >= limit || !post.date) {
        return events;
      }

      const linkRemovalDate = DateTime.fromJSDate(post.date)
        .set({ hour: 0, minute: 0, second: 0 })
        .plus({ days: 1 });

      const isUpcoming = currentDate.toMillis() <= linkRemovalDate.toMillis();
      const isRecap = post.meta?.event === 'Zusammenfassung';

      if (!isUpcoming || isRecap) {
        return events;
      }

      const startTime = post.meta?.startTime ?? DEFAULT_START_TIME;
      const endTime = post.meta?.endTime ? ` - ${post.meta.endTime}` : '';
      const name = post.meta?.event ?? DEFAULT_EVENT_NAME;

      const [endHour, endMinute] = (post.meta?.endTime ?? DEFAULT_END_TIME)
        .split(' ')[0]
        .split(':');
      const endDateTimeObject = endMinute
        ? { hour: Number(endHour), minute: Number(endMinute) }
        : { hour: Number(endHour) };

      const postDate = DateTime.fromJSDate(post.date);
      const icsLink = generateICalendarAttributes({
        name,
        startDate: postDate,
        endDate: postDate.set(endDateTimeObject),
        currentDate,
        description: post.primaryTag?.content,
        location: post.meta?.location ?? DEFAULT_ICS_LOCATION,
        url: `/${post.id}`,
      });

      events.push({
        id: post.id,
        date: postDate.setLocale('de').toFormat('EEEE, dd.MM.'),
        name,
        location: post.meta?.location ?? DEFAULT_LOCATION,
        time: `${startTime}${endTime}`,
        icsTitle: encodeURI(name),
        icsLink,
      });

      return events;
    }, []);
  }
}
