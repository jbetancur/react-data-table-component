import { mergeDeep } from './util';
import { Theme, Themes } from './types';

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
};

export function themeToVars(theme: Theme): Record<string, string> {
	return {
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

export function createTheme<T>(name = 'default', customTheme?: T, inherit: Themes = 'default'): Theme {
	if (!defaultThemes[name]) {
		defaultThemes[name] = mergeDeep(defaultThemes[inherit], customTheme || {});
	}

	// allow tweaking default or light themes if the theme passed in matches
	defaultThemes[name] = mergeDeep(defaultThemes[name], customTheme || {});

	return defaultThemes[name];
}
