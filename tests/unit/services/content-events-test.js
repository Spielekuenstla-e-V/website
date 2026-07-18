import { module, test } from 'qunit';
import { setupTest } from 'spielekuenstla-website/tests/helpers';

// Pin "today" to before the very first event so the dataset is deterministic.
const NOW = new Date('2023-07-01T12:00:00+01:00');

module('Unit | Service | content (events)', function (hooks) {
  setupTest(hooks);

  test('upcomingEvents returns at most `limit` events', function (assert) {
    const content = this.owner.lookup('service:content');

    assert.strictEqual(
      content.upcomingEvents(3, NOW).length,
      3,
      'defaults to three events',
    );
    assert.strictEqual(
      content.upcomingEvents(1, NOW).length,
      1,
      'honours a custom limit',
    );
  });

  test('excludes recaps (meta.event === "Zusammenfassung")', function (assert) {
    const content = this.owner.lookup('service:content');
    const events = content.upcomingEvents(3, NOW);

    assert.deepEqual(
      events.map((event) => event.id),
      ['20230714_celebration', '20230811_treff', '20230908_treff'],
      'the 08.09. recap is skipped in favour of the next real treff',
    );
  });

  test('falls back to default name and time when meta is missing', function (assert) {
    const content = this.owner.lookup('service:content');
    const [first] = content.upcomingEvents(3, NOW);

    assert.strictEqual(first.name, 'Spieletreff', 'default event name');
    assert.strictEqual(first.time, '17 Uhr', 'default start time');
    assert.ok(
      first.date.includes('14.07.'),
      'date formatted as German day + dd.MM.',
    );
  });

  test('builds a downloadable .ics data URL', function (assert) {
    const content = this.owner.lookup('service:content');
    const [first] = content.upcomingEvents(3, NOW);

    assert.ok(
      first.icsLink.startsWith('data:text/calendar'),
      'href is a calendar data URL',
    );
    assert.ok(
      decodeURI(first.icsLink).includes('BEGIN:VCALENDAR'),
      'contains a VCALENDAR body',
    );
    assert.ok(
      decodeURI(first.icsLink).includes('SUMMARY:Spieletreff'),
      'summary carries the event name',
    );
  });

  test('past events are dropped', function (assert) {
    const content = this.owner.lookup('service:content');
    const future = new Date('2100-01-01T00:00:00+01:00');

    assert.strictEqual(
      content.upcomingEvents(3, future).length,
      0,
      'nothing is upcoming in the far future',
    );
  });
});
