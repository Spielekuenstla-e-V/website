import Service from '@ember/service';
import {
  posts as rawPosts,
  authors as rawAuthors,
  pages as rawPages,
  tags as rawTags,
} from 'virtual:content';

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
}
