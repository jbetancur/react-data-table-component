import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import visualizer from 'rollup-plugin-visualizer';
import typescript from 'rollup-plugin-typescript2';

export const plugins = [
	resolve({
		browser: true,
		preferBuiltins: true,
		extensions: ['.ts', '.tsx'],
	}),
	commonjs({
		include: 'node_modules/**',
	}),
	visualizer(),
	typescript(),
];

export default {
	input: './src/index.ts',
	external: ['react', 'react-dom', 'styled-components'],
};
