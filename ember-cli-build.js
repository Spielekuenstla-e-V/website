'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const autoprefixer = require('autoprefixer');
const colorFunction = require('postcss-color-function');
const cssnano = require('cssnano');
const customProperties = require('postcss-custom-properties');
const easyImport = require('postcss-easy-import');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    fingerprint: {
      extensions: ['js', 'css', 'map'],
    },
    postcssOptions: {
      compile: {
        enable: true,
        plugins: [
          { module: easyImport },
          { module: customProperties, options: { preserve: false } },
          { module: colorFunction },
          { module: autoprefixer, options: { overrideBrowserslist: ['last 2 versions'] } },
          { module: cssnano },
        ],
      },
    },
    'responsive-image': {
      images: [{
        include: 'images/**/*',
        removeSource: false,
        quality: 80,
        widths: [2000, 1000, 600, 300],
      }],
    },
  });

  return app.toTree();
};
