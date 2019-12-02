import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';

export const plugins = [
  resolve({
    browser: true,
    preferBuiltins: true,
    extensions: ['.mjs', '.js', '.jsx'],
  }),
  commonjs({
    include: 'node_modules/**',
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  copy({
    targets: [
      { src: 'index.d.ts', dest: 'dist' },
    ],
  }),
];

export default {
  input: './src/index.js',
  external: [
    'react',
    'react-dom',
    'styled-components',
  ],
};
