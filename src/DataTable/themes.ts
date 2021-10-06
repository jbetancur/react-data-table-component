import merge from 'deepmerge';
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

export function createTheme<T>(name = 'default', customTheme?: T, inherit: Themes = 'default'): Theme {
	if (!defaultThemes[name]) {
		defaultThemes[name] = merge(defaultThemes[inherit], customTheme || {});
	}

	// allow tweaking default or light themes if the theme passed in matches
	defaultThemes[name] = merge(defaultThemes[name], customTheme || {});

	return defaultThemes[name];
}
