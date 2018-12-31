import { uglify } from 'rollup-plugin-uglify';

import config, { plugins } from './rollup.config.common';

export default Object.assign(config, {
  output: [
    {
      name: 'ReactFlexybox',
      file: 'dist/react-data-table-component.umd.js',
      format: 'umd',
      globals: {
        react: 'React',
        'styled-components': 'styled',
      },
    },
  ],
  plugins: plugins.concat([
    uglify({}),
  ]),
});
