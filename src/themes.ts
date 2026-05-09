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

	// ── Slate — clean, neutral, professional ───────────────────────────────────
	slate: {
		text: { primary: '#1E293B', secondary: '#64748B', disabled: '#CBD5E1' },
		background: { default: '#FFFFFF' },
		context: { background: '#3B82F6', text: '#FFFFFF' },
		divider: { default: '#E2E8F0' },
		button: { default: '#3B82F6', focus: 'rgba(59,130,246,0.12)', hover: 'rgba(59,130,246,0.08)', disabled: '#CBD5E1' },
		selected: { default: '#EFF6FF', text: '#1E293B' },
		highlightOnHover: { default: '#F8FAFC', text: '#1E293B' },
		striped: { default: '#F1F5F9', text: '#1E293B' },
	},

	// Slate Dark
	'slate-dark': {
		colorScheme: 'dark' as const,
		text: { primary: '#E2E8F0', secondary: '#94A3B8', disabled: '#475569' },
		background: { default: '#1E293B' },
		context: { background: '#3B82F6', text: '#FFFFFF' },
		divider: { default: '#334155' },
		button: { default: '#60A5FA', focus: 'rgba(96,165,250,0.12)', hover: 'rgba(96,165,250,0.08)', disabled: '#475569' },
		selected: { default: '#1E3A5F', text: '#E2E8F0' },
		highlightOnHover: { default: '#263348', text: '#E2E8F0' },
		striped: { default: '#243044', text: '#E2E8F0' },
	},

	// ── Ocean — calm blue-green tones ───────────────────────────────────────────
	ocean: {
		text: { primary: '#0F2A3A', secondary: '#4A7A8A', disabled: '#B0C8D4' },
		background: { default: '#F0F7FA' },
		context: { background: '#0891B2', text: '#FFFFFF' },
		divider: { default: '#C8DEE8' },
		button: { default: '#0891B2', focus: 'rgba(8,145,178,0.12)', hover: 'rgba(8,145,178,0.08)', disabled: '#B0C8D4' },
		selected: { default: '#CCEEFF', text: '#0F2A3A' },
		highlightOnHover: { default: '#E0F2F8', text: '#0F2A3A' },
		striped: { default: '#E8F4F8', text: '#0F2A3A' },
	},

	// Ocean Dark
	'ocean-dark': {
		colorScheme: 'dark' as const,
		text: { primary: '#CAE8F0', secondary: '#7ABCCC', disabled: '#3A5A66' },
		background: { default: '#0A1F2E' },
		context: { background: '#0891B2', text: '#FFFFFF' },
		divider: { default: '#1A3A4A' },
		button: { default: '#22D3EE', focus: 'rgba(34,211,238,0.12)', hover: 'rgba(34,211,238,0.08)', disabled: '#3A5A66' },
		selected: { default: '#0E3A50', text: '#CAE8F0' },
		highlightOnHover: { default: '#112840', text: '#CAE8F0' },
		striped: { default: '#0C2338', text: '#CAE8F0' },
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
