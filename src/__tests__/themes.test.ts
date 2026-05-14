import { createTheme, defaultThemes, resolveTheme, resolveThemeObject, themeToVars } from '../themes';

describe('createTheme', () => {
	test('returns the default theme when looked up by an unknown name', () => {
		expect(defaultThemes['no-such-theme'] ?? defaultThemes.default).toEqual(defaultThemes.default);
	});

	test('registers a named theme that composes the default theme', () => {
		const newTheme = createTheme('registered-theme', {
			text: { primary: '#aaa', secondary: '#bbb', disabled: '#ccc' },
		});

		expect(defaultThemes['registered-theme']).toEqual(newTheme);
		expect(newTheme.text.primary).toBe('#aaa');
		// Untouched properties should come from the base theme
		expect(newTheme.background).toEqual(defaultThemes.default.background);
	});

	test('returns an inline theme without registering it when called with overrides only', () => {
		const inline = createTheme({ primary: '#ff0000' });

		expect(inline.primary).toBe('#ff0000');
		expect(defaultThemes['#ff0000']).toBeUndefined();
	});

	test('inherits from a named base theme when inherit is provided', () => {
		createTheme('parent-theme', { primary: '#123456' });
		const child = createTheme('child-theme', {}, 'parent-theme');

		expect(child.primary).toBe('#123456');
	});
});

describe('resolveThemeObject', () => {
	test('returns the default theme when given undefined', () => {
		expect(resolveThemeObject(undefined)).toEqual(defaultThemes.default);
	});

	test('looks up a registered theme by name', () => {
		createTheme('resolved-theme', { primary: '#abcdef' });
		expect(resolveThemeObject('resolved-theme').primary).toBe('#abcdef');
	});

	test('falls back to default for a CSS variable map', () => {
		expect(resolveThemeObject({ '--rdt-color-primary': 'red' })).toEqual(defaultThemes.default);
	});

	test('merges a partial Theme object with the default theme', () => {
		const result = resolveThemeObject({ primary: '#custom' });
		expect(result.primary).toBe('#custom');
		// Non-overridden properties come from the default
		expect(result.text).toEqual(defaultThemes.default.text);
	});
});

describe('themeToVars', () => {
	test('includes --rdt-color-header-bg when background.header is set', () => {
		const theme = createTheme({ background: { default: '#fff', header: '#eee' } });
		const vars = themeToVars(theme);
		expect(vars['--rdt-color-header-bg']).toBe('#eee');
	});

	test('omits --rdt-color-header-bg when background.header is absent', () => {
		const vars = themeToVars(defaultThemes.default);
		expect('--rdt-color-header-bg' in vars).toBe(false);
	});

	test('includes spacing CSS variables when spacing is defined', () => {
		const theme = createTheme({
			spacing: { rowHeight: '40px', headerHeight: '52px', cellPaddingX: '8px', iconSize: '18px' },
		});
		const vars = themeToVars(theme);
		expect(vars['--rdt-row-height']).toBe('40px');
		expect(vars['--rdt-header-height']).toBe('52px');
		expect(vars['--rdt-cell-padding-x']).toBe('8px');
		expect(vars['--rdt-icon-size']).toBe('18px');
	});

	test('includes typography CSS variables when typography is defined', () => {
		const theme = createTheme({
			typography: { fontSize: '14px', fontSizeHeader: '12px', fontFamily: 'Arial' },
		});
		const vars = themeToVars(theme);
		expect(vars['--rdt-font-size']).toBe('14px');
		expect(vars['--rdt-font-size-header']).toBe('12px');
		expect(vars['--rdt-font-family']).toBe('Arial');
	});

	test('includes shape and checkbox CSS variables when defined', () => {
		const theme = createTheme({
			shape: { borderRadius: '4px' },
			checkbox: { size: '20px', borderRadius: '2px' },
		});
		const vars = themeToVars(theme);
		expect(vars['--rdt-border-radius']).toBe('4px');
		expect(vars['--rdt-checkbox-size']).toBe('20px');
		expect(vars['--rdt-checkbox-radius']).toBe('2px');
	});

	test('sets --rdt-color-scheme to explicit colorScheme when provided', () => {
		const theme = createTheme({ colorScheme: 'dark' });
		const vars = themeToVars(theme);
		expect(vars['--rdt-color-scheme']).toBe('dark');
	});
});

describe('createTheme:inherit', () => {
	test('named createTheme inherits from a specific named base when inherit is provided', () => {
		createTheme('spacing-base', { spacing: { rowHeight: '50px' } });
		const child = createTheme('spacing-child', {}, 'spacing-base');
		expect(child.spacing?.rowHeight).toBe('50px');
	});

	test('inline createTheme inherits from a named base when second arg is a string', () => {
		createTheme('inline-base', { primary: '#base' });
		const inline = createTheme({ primary: '#override' }, 'inline-base');
		expect(inline.primary).toBe('#override');
	});

	test('named createTheme with no overrides arg uses empty object fallback', () => {
		// Covers the `overridesOrInherit ?? {}` right branch when overrides is omitted
		const theme = createTheme('no-overrides-theme');
		expect(theme.text).toEqual(defaultThemes.default.text);
	});

	test('inline createTheme falls back to default when named base does not exist', () => {
		// Covers the `defaultThemes[inheritName] ?? defaultThemes.default` right branch
		const theme = createTheme({}, 'nonexistent-base-xyz');
		expect(theme.text).toEqual(defaultThemes.default.text);
	});
});

describe('resolveTheme', () => {
	test('returns the CSS variable map directly when one is passed in', () => {
		const vars = { '--rdt-color-primary': 'red' };
		expect(resolveTheme(vars)).toEqual(vars);
	});

	test('converts a Theme into a CSS variable map', () => {
		const vars = resolveTheme('default');
		expect(vars['--rdt-color-text-primary']).toBe(defaultThemes.default.text.primary);
	});

	test('applies darkMode overrides when resolvedMode is dark', () => {
		createTheme('dark-aware', {
			primary: '#light',
			text: { primary: '#light-text', secondary: '#l2', disabled: '#l3' },
			darkMode: { primary: '#dark', text: { primary: '#dark-text' } },
		});

		const lightVars = resolveTheme('dark-aware', 'light');
		const darkVars = resolveTheme('dark-aware', 'dark');

		expect(lightVars['--rdt-color-primary']).toBe('#light');
		expect(darkVars['--rdt-color-primary']).toBe('#dark');
		expect(darkVars['--rdt-color-text-primary']).toBe('#dark-text');
		expect(darkVars['--rdt-color-scheme']).toBe('dark');
	});
});
