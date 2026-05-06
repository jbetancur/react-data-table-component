import { createStyles } from '../styles';

describe('createStyles', () => {
	test('it should return an empty object if customStyles is not provided', () => {
		const newStyles = createStyles();

		expect(newStyles).toEqual({});
	});

	test('it should return customStyles as-is when provided', () => {
		const custom = { rows: { style: { color: 'red' } } };
		const newStyles = createStyles(custom);

		expect(newStyles).toEqual(custom);
	});
});
