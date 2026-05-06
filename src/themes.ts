import { mergeDeep } from './util';
import { Theme, ThemeProp } from './types';

type ThemeMapping = {
	[propertyName: string]: Theme;
};

const defaultTheme = {
	text: {
		primary: 'rgba(0, 0, 0, 0.87)',
		secondary: 'rgba(0, 0, 0, 0.54)',
		disabled: 'rgba(0, 0, 0, 0.38)',
	},
	background: {
		default: '#FFFFFF',
	},
	context: {
		background: '#e3f2fd',
		text: 'rgba(0, 0, 0, 0.87)',
	},
	divider: {
		default: 'rgba(0,0,0,.12)',
	},
	button: {
		default: 'rgba(0,0,0,.54)',
		focus: 'rgba(0,0,0,.12)',
		hover: 'rgba(0,0,0,.12)',
		disabled: 'rgba(0, 0, 0, .18)',
	},
	selected: {
		default: '#e3f2fd',
		text: 'rgba(0, 0, 0, 0.87)',
	},
	highlightOnHover: {
		default: '#EEEEEE',
		text: 'rgba(0, 0, 0, 0.87)',
	},
	striped: {
		default: '#FAFAFA',
		text: 'rgba(0, 0, 0, 0.87)',
	},
};

export const defaultThemes: ThemeMapping = {
	default: defaultTheme,
	light: defaultTheme,
	dark: {
		colorScheme: 'dark' as const,
		text: {
			primary: '#FFFFFF',
			secondary: 'rgba(255, 255, 255, 0.7)',
			disabled: 'rgba(0,0,0,.12)',
		},
		background: {
			default: '#424242',
		},
		context: {
			background: '#E91E63',
			text: '#FFFFFF',
		},
		divider: {
			default: 'rgba(81, 81, 81, 1)',
		},
		button: {
			default: '#FFFFFF',
			focus: 'rgba(255, 255, 255, .54)',
			hover: 'rgba(255, 255, 255, .12)',
			disabled: 'rgba(255, 255, 255, .18)',
		},
		selected: {
			default: 'rgba(0, 0, 0, .7)',
			text: '#FFFFFF',
		},
		highlightOnHover: {
			default: 'rgba(0, 0, 0, .7)',
			text: '#FFFFFF',
		},
		striped: {
			default: 'rgba(0, 0, 0, .87)',
			text: '#FFFFFF',
		},
	},

	// ── Material Design (Google) ────────────────────────────────────────────────
	material: {
		text: {
			primary: 'rgba(0, 0, 0, 0.87)',
			secondary: 'rgba(0, 0, 0, 0.6)',
			disabled: 'rgba(0, 0, 0, 0.38)',
		},
		background: { default: '#FFFFFF' },
		context: { background: '#1976d2', text: '#FFFFFF' },
		divider: { default: 'rgba(0, 0, 0, 0.12)' },
		button: {
			default: '#1976d2',
			focus: 'rgba(25, 118, 210, 0.12)',
			hover: 'rgba(25, 118, 210, 0.08)',
			disabled: 'rgba(0, 0, 0, 0.26)',
		},
		selected: { default: '#e3f2fd', text: 'rgba(0, 0, 0, 0.87)' },
		highlightOnHover: { default: '#F5F5F5', text: 'rgba(0, 0, 0, 0.87)' },
		striped: { default: '#FAFAFA', text: 'rgba(0, 0, 0, 0.87)' },
	},

	// Material Dark
	'material-dark': {
		colorScheme: 'dark' as const,
		text: { primary: '#E3E3E3', secondary: 'rgba(255,255,255,0.7)', disabled: 'rgba(255,255,255,0.3)' },
		background: { default: '#121212' },
		context: { background: '#1565c0', text: '#FFFFFF' },
		divider: { default: 'rgba(255,255,255,0.12)' },
		button: {
			default: '#90CAF9',
			focus: 'rgba(144,202,249,0.12)',
			hover: 'rgba(144,202,249,0.08)',
			disabled: 'rgba(255,255,255,0.3)',
		},
		selected: { default: '#1a237e', text: '#90CAF9' },
		highlightOnHover: { default: '#1E1E1E', text: '#E3E3E3' },
		striped: { default: '#1A1A1A', text: '#E3E3E3' },
	},

	// ── Quartz — polished, rounded, AG Grid-inspired ────────────────────────────
	quartz: {
		text: { primary: '#181D1F', secondary: '#5A6872', disabled: '#BDC3C8' },
		background: { default: '#FFFFFF' },
		context: { background: '#0170FE', text: '#FFFFFF' },
		divider: { default: '#E5E7EA' },
		button: { default: '#0170FE', focus: 'rgba(1,112,254,0.12)', hover: 'rgba(1,112,254,0.08)', disabled: '#BDC3C8' },
		selected: { default: '#E8F1FD', text: '#181D1F' },
		highlightOnHover: { default: '#F7F8FA', text: '#181D1F' },
		striped: { default: '#FAFBFC', text: '#181D1F' },
	},

	// Quartz Dark
	'quartz-dark': {
		colorScheme: 'dark' as const,
		text: { primary: '#F8F8F8', secondary: '#8C9BAB', disabled: '#4A5568' },
		background: { default: '#1E2329' },
		context: { background: '#0170FE', text: '#FFFFFF' },
		divider: { default: '#2D3748' },
		button: { default: '#60A5FA', focus: 'rgba(96,165,250,0.12)', hover: 'rgba(96,165,250,0.08)', disabled: '#4A5568' },
		selected: { default: '#1A3A5C', text: '#F8F8F8' },
		highlightOnHover: { default: '#252C36', text: '#F8F8F8' },
		striped: { default: '#232A32', text: '#F8F8F8' },
	},

	// ── Alpine — clean, modern, spacious ────────────────────────────────────────
	alpine: {
		text: { primary: '#181D1F', secondary: '#5A6872', disabled: '#BDC3C8' },
		background: { default: '#FFFFFF' },
		context: { background: '#2196F3', text: '#FFFFFF' },
		divider: { default: '#BDC3C8' },
		button: { default: '#2196F3', focus: 'rgba(33,150,243,0.12)', hover: 'rgba(33,150,243,0.08)', disabled: '#BDC3C8' },
		selected: { default: '#DBEAFE', text: '#181D1F' },
		highlightOnHover: { default: '#EFF7FE', text: '#181D1F' },
		striped: { default: '#F9FAFB', text: '#181D1F' },
	},

	// Alpine Dark
	'alpine-dark': {
		colorScheme: 'dark' as const,
		text: { primary: '#F8F8F8', secondary: '#8C9BAB', disabled: '#4A5568' },
		background: { default: '#1E2430' },
		context: { background: '#2196F3', text: '#FFFFFF' },
		divider: { default: '#374151' },
		button: { default: '#38BDF8', focus: 'rgba(56,189,248,0.12)', hover: 'rgba(56,189,248,0.08)', disabled: '#4A5568' },
		selected: { default: '#1E3A5F', text: '#F8F8F8' },
		highlightOnHover: { default: '#252F40', text: '#F8F8F8' },
		striped: { default: '#232D3E', text: '#F8F8F8' },
	},

	// ── Midnight — high-contrast dark ───────────────────────────────────────────
	midnight: {
		colorScheme: 'dark' as const,
		text: { primary: '#C9D1D9', secondary: '#8B949E', disabled: '#3D444D' },
		background: { default: '#0D1117' },
		context: { background: '#388BFD', text: '#FFFFFF' },
		divider: { default: '#21262D' },
		button: { default: '#388BFD', focus: 'rgba(56,139,253,0.15)', hover: 'rgba(56,139,253,0.1)', disabled: '#3D444D' },
		selected: { default: '#1C2A3A', text: '#C9D1D9' },
		highlightOnHover: { default: '#161B22', text: '#C9D1D9' },
		striped: { default: '#0D1117', text: '#C9D1D9' },
	},

	// ── Solarized Dark (classic) ─────────────────────────────────────────────────
	solarized: {
		colorScheme: 'dark' as const,
		text: { primary: '#839496', secondary: '#657b83', disabled: '#586e75' },
		background: { default: '#002b36' },
		context: { background: '#cb4b16', text: '#FFFFFF' },
		divider: { default: '#073642' },
		button: { default: '#2aa198', focus: 'rgba(42,161,152,0.15)', hover: 'rgba(42,161,152,0.1)', disabled: '#586e75' },
		selected: { default: '#073642', text: '#268bd2' },
		highlightOnHover: { default: '#073642', text: '#93a1a1' },
		striped: { default: '#00212b', text: '#839496' },
	},
};

export function themeToVars(theme: Theme): Record<string, string> {
	return {
		'--rdt-color-scheme': theme.colorScheme ?? 'light',
		'--rdt-color-text-primary': theme.text.primary,
		'--rdt-color-text-secondary': theme.text.secondary,
		'--rdt-color-text-disabled': theme.text.disabled,
		'--rdt-color-bg': theme.background.default,
		'--rdt-color-context-bg': theme.context.background,
		'--rdt-color-context-text': theme.context.text,
		'--rdt-color-divider': theme.divider.default,
		'--rdt-color-btn': theme.button.default,
		'--rdt-color-btn-focus': theme.button.focus,
		'--rdt-color-btn-hover': theme.button.hover,
		'--rdt-color-btn-disabled': theme.button.disabled,
		'--rdt-color-selected': theme.selected.default,
		'--rdt-color-selected-text': theme.selected.text,
		'--rdt-color-highlight': theme.highlightOnHover.default,
		'--rdt-color-highlight-text': theme.highlightOnHover.text,
		'--rdt-color-striped': theme.striped.default,
		'--rdt-color-striped-text': theme.striped.text,
	};
}

// Named registration: createTheme('my-dark', overrides, 'dark') — registers globally, use via theme="my-dark"
export function createTheme(name: string, overrides?: Partial<Theme>, inherit?: string): Theme;
// Inline composition: createTheme(overrides, 'dark') — returns Theme object, pass directly to theme prop
export function createTheme(overrides: Partial<Theme>, inherit?: string): Theme;
export function createTheme(
	nameOrOverrides: string | Partial<Theme>,
	overridesOrInherit?: Partial<Theme> | string,
	inherit?: string,
): Theme {
	if (typeof nameOrOverrides === 'string') {
		const name = nameOrOverrides;
		const overrides = (overridesOrInherit as Partial<Theme>) ?? {};
		const base = defaultThemes[inherit ?? 'default'] ?? defaultThemes.default;
		defaultThemes[name] = mergeDeep(base, overrides) as Theme;
		return defaultThemes[name];
	}

	const overrides = nameOrOverrides;
	const inheritName = (overridesOrInherit as string) ?? 'default';
	const base = defaultThemes[inheritName] ?? defaultThemes.default;
	return mergeDeep(base, overrides) as Theme;
}

function isCSSVarMap(obj: object): boolean {
	const keys = Object.keys(obj);
	return keys.length > 0 && keys.every(k => k.startsWith('--'));
}

export function resolveThemeObject(theme: ThemeProp | undefined): Theme {
	if (!theme || typeof theme === 'string') {
		return defaultThemes[theme as string] ?? defaultThemes.default;
	}
	if (isCSSVarMap(theme as object)) {
		return defaultThemes.default;
	}
	return mergeDeep(defaultThemes.default, theme) as Theme;
}

export function resolveTheme(theme: ThemeProp | undefined): Record<string, string> {
	if (theme && typeof theme !== 'string' && isCSSVarMap(theme as object)) {
		return theme as Record<string, string>;
	}
	return themeToVars(resolveThemeObject(theme));
}
