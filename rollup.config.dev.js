import config, { plugins } from './rollup.config.common';

export default Object.assign(config, {
  output: {
    file: 'dist/index.dev.js',
    format: 'cjs',
  },
  plugins: plugins.concat([
    // add additional plugins here
  ]),
});
