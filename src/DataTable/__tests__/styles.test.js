import { createStyles, defaultStyles } from '../styles';

describe('createStyles', () => {
  test('it should return the default styles if customStyles is not provided', () => {
    const newStyles = createStyles();

    expect(newStyles.default).toEqual(defaultStyles.default);
  });

  test('it should return the default styles if a non existent theme is not provided', () => {
    const newStyles = createStyles({}, 'poopyTheme');

    expect(newStyles.default).toEqual(defaultStyles.default);
  });
});
