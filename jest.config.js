module.exports = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	testEnvironment: 'jsdom',
	collectCoverageFrom: [
		'src/**/*.{js,jsx,ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/internal/*',
		'!src/index.ts',
		'!src/**/(index|*.stories).js',
		'!src/DataTable/propTypes.js',
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	coverageReporters: ['json', 'lcov', 'text', 'clover'],
	setupFiles: ['react-app-polyfill/jsdom'],
	setupFilesAfterEnv: ['jest-styled-components'],
	testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
	watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
	testPathIgnorePatterns: ['/node_modules/', 'dist'],
	moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/__mocks__/file.mock.js',
		'\\.(css|less)$': '<rootDir>/__mocks__/style.mock.js',
	},
};
