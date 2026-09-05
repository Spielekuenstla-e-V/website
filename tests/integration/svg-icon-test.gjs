import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'spielekuenstla-website/tests/helpers';
import SvgIcon from 'spielekuenstla-website/components/svg-icon';

module('Integration | Component | svg-icon', function (hooks) {
  setupRenderingTest(hooks);

  test('inlines the named SVG markup', async function (assert) {
    await render(<template><SvgIcon @name="discord" /></template>);

    assert.dom('.svg-icon').exists('wrapper rendered');
    assert.dom('.svg-icon svg').exists('svg markup injected inline');
    assert.dom('.svg-icon').hasAttribute('data-icon', 'discord');
  });

  test('passes through a custom class', async function (assert) {
    await render(
      <template><SvgIcon @name="instagram" class="my-icon" /></template>,
    );

    assert.dom('.svg-icon.my-icon svg').exists('custom class applied');
  });

  test('renders nothing for an unknown icon name', async function (assert) {
    await render(<template><SvgIcon @name="does-not-exist" /></template>);

    assert.dom('.svg-icon svg').doesNotExist('no markup for unknown name');
  });
});
