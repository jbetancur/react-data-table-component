module.exports = {
	parser: '@typescript-eslint/parser',
	// Specifies the ESLint parser
	plugins: ['jest', '@typescript-eslint'],
	extends: [
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:react-hooks/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:storybook/recommended',
	],
	parserOptions: {
		ecmaVersion: 2018,
		// Allows for the parsing of modern ECMAScript features
		sourceType: 'module',
		// Allows for the use of imports
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
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				ignoreRestSiblings: true,
			},
		],
		// '@typescript-eslint/ban-ts-comment': [{ 'ts-ignore': 'allow-with-description', minimumDescriptionLength: 10 }],
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
			},
		], // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
	},
	overrides: [
		{
			files: ['**/*.js', '**/*.jsx'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'react/display-name': 'off',
			},
		},
	],
};
