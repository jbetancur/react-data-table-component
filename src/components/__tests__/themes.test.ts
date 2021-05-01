import { createTheme, defaultThemes } from '../themes';

describe('createTheme', () => {
	test('it should return the default theme if customTheme is not provided', () => {
		const newTheme = createTheme('whoa');

		expect(newTheme).toEqual(defaultThemes.default);
	});

	test('it should create a new theme that is composed with the default theme', () => {
		const newTheme = createTheme('wow', {
			text: {
				primary: '#',
				secondary: '#',
				disabled: '#',
			},
		});

		expect(defaultThemes.wow).toEqual(newTheme);
	});
});
