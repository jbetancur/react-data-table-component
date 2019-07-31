import config, { plugins } from './rollup.config.common';
import pkg from '../package.json';

export default Object.assign(config, {
  output: {
    name: 'ReactDataTable',
    file: `dist/${pkg.name}.dev.js`,
    format: 'cjs',
  },
  plugins: plugins.concat([
    // add additional plugins here
  ]),
});
