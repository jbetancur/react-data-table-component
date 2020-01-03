module.exports = {
    parser: 'babel-eslint',
    extends: ['airbnb', 'plugin:jsx-a11y/recommended'],
    plugins: ['jest', 'react-hooks', 'jsx-a11y'],
    rules: {
        'max-len': 0,
        'react/forbid-prop-types': 0,
        'import/no-extraneous-dependencies': 0,
        'no-confusing-arrow': ['error', {'allowParens': true}],
        'arrow-parens': ['error', 'as-needed'],
        'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
        'import/prefer-default-export': 0,
        'object-curly-newline': ['error', { 'consistent': true }],
        'implicit-arrow-linebreak': 0,
        'operator-linebreak': 0,
        'linebreak-style': 0,
        'arrow-body-style': 0,
        'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
        'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
        'react/jsx-props-no-spreading': 0
    },
    env: {
        'jest/globals': true,
        'browser': true
    },
    settings: {
        'import/resolver': {
            'babel-module': {}
        }
    },
    overrides: [
      {
        files: ['**/*.ts', '**/*.tsx'],
        env: { 'browser': true, 'es6': true, 'node': true },
        extends: [
          'eslint:recommended',
          'plugin:react/recommended',
          'plugin:@typescript-eslint/eslint-recommended',
          'plugin:@typescript-eslint/recommended'
        ],
        globals: { 'Atomics': 'readonly', 'SharedArrayBuffer': 'readonly' },
        parser: '@typescript-eslint/parser',
        parserOptions: {
          ecmaFeatures: { 'jsx': true },
          ecmaVersion: 2018,
          sourceType: 'module',
        },
        plugins: ['react', '@typescript-eslint'],
        rules: {
          indent: ['error', 2, { 'SwitchCase': 1 }],
          'linebreak-style': ['error', 'unix'],
          quotes: ['error', 'single'],
          'comma-dangle': ['error', 'always-multiline'],
          '@typescript-eslint/no-explicit-any': 0,
          '@typescript-eslint/interface-name-prefix': 0,
        },
        settings: { 'react': { 'version': 'detect' } }
      }
    ]
}
