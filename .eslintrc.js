module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	extends: [
		'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
		'plugin:react-hooks/recommended',
	],
	parserOptions: {
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		ecmaFeatures: {
			jsx: true, // Allows for the parsing of JSX
		},
	},
	settings: {
		react: {
			version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
		},
	},
	rules: {
		'react/prop-types': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
		// '@typescript-eslint/ban-ts-comment': [{ 'ts-ignore': 'allow-with-description', minimumDescriptionLength: 10 }],
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
			},
		],
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
	},
	overrides: [
		{
			files: ['**/*.js', '**/*.jsx'],
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
			},
		},
	],
};
