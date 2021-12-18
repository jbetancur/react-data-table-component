module.exports = {
	parserOptions: {
		sourceType: 'module',
		allowImportExportEverywhere: false,
		ecmaFeatures: {
			globalReturn: false,
		},
		babelOptions: {
			configFile: './eslintrc-js.js',
		},
	},
	extends: ['plugin:jsx-a11y/recommended'],
	plugins: ['jest', 'react-hooks', 'jsx-a11y'],
	rules: {
		'max-len': 0,
		'react/forbid-prop-types': 0,
		'import/no-extraneous-dependencies': 0,
		'no-confusing-arrow': ['error', { allowParens: true }],
		'arrow-parens': ['error', 'as-needed'],
		'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
		'import/prefer-default-export': 0,
		'object-curly-newline': ['error', { consistent: true }],
		'implicit-arrow-linebreak': 0,
		'operator-linebreak': 0,
		'linebreak-style': 0,
		'arrow-body-style': 0,
		'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
		'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
		'react/jsx-props-no-spreading': 0,
		'react/display-name': 0,
	},
	env: {
		'jest/globals': true,
		browser: true,
	},
};
