import { minify } from 'uglify-es';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

import config, { plugins } from './rollup.config.common';

export default Object.assign(config, {
  output: {
    file: pkg.main,
    format: 'cjs',
  },
  plugins: plugins.concat([
    uglify({}, minify),
  ]),
});
