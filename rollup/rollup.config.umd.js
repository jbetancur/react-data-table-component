import { terser } from 'rollup-plugin-terser';
import config, { plugins } from './rollup.config.common';

export default Object.assign(config, {
	output: [
		{
			name: 'ReactDataTable',
			file: 'dist/react-data-table-component.umd.js',
			format: 'umd',
			globals: {
				react: 'React',
				'react-dom': 'ReactDOM',
				'styled-components': 'styled',
				'lodash.orderby': 'orderby',
				deepmerge: 'deepmerge',
			},
			exports: 'named',
		},
	],
	plugins: plugins.concat([terser()]),
});
