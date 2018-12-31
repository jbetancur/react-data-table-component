import { terser } from 'rollup-plugin-terser';
import pkg from '../package.json';

import config, { plugins } from './rollup.config.common';

export default Object.assign(config, {
  output: [
    {
      file: pkg.module,
      format: 'es',
    }
  ],
  plugins: plugins.concat([
    terser(),
  ]),
});
