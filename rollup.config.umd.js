import { minify } from 'uglify-es';
import uglify from 'rollup-plugin-uglify';

import config, { plugins } from './rollup.config.common';

export default Object.assign(config, {
  output: {
    name: 'REACT-DATA-TABLE-COMPONENT',
    file: 'dist/index.prod.umd.js',
    format: 'umd',
  },
  plugins: plugins.concat([
    uglify({}, minify),
  ]),
});
