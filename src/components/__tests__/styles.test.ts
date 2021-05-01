import { createStyles, defaultStyles } from '../styles';
import { defaultThemes } from '../themes';

describe('createStyles', () => {
	test('it should return the default styles if customStyles is not provided', () => {
		const newStyles = createStyles();

		expect(newStyles).toEqual(defaultStyles(defaultThemes.default));
	});

	test('it should return the default styles if a non existent theme is not provided', () => {
		const newStyles = createStyles({}, 'poopyTheme');

		expect(newStyles).toEqual(defaultStyles(defaultThemes.default));
	});
});
