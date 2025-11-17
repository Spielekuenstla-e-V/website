import showdown from 'showdown';
import { htmlSafe } from '@ember/template';

const converter = new showdown.Converter();

export default function markdownToHtml(text = '') {
  return htmlSafe(converter.makeHtml(text));
}
