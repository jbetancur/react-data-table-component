import { type Theme } from '../types';
import { defaultTheme } from './base';

// Catppuccin — Latte (light) / Mocha (dark)
// Palette: https://github.com/catppuccin/palette
// Accent: Mauve (#8839ef latte / #cba6f7 mocha)
export const catppuccinTheme: Theme = {
	...defaultTheme,
	primary: '#8839ef',
	text: {
		primary: '#4c4f69', // latte: text
		secondary: '#5c5f77', // latte: subtext1
		disabled: '#9ca0b0', // latte: overlay0
	},
	background: { default: '#eff1f5', header: '#e6e9ef', footer: '#e6e9ef' }, // base / mantle
	divider: { default: '#bcc0cc' }, // surface1
	highlightOnHover: { default: '#ccd0da', text: '#4c4f69' }, // surface0
	striped: { default: '#e6e9ef', text: '#4c4f69' }, // mantle
	selected: { default: '#dce0e8', text: '#4c4f69' }, // crust
	context: { background: '#8839ef', text: '#eff1f5' },
	button: {
		default: '#7c7f93', // overlay2
		focus: 'rgba(136,57,239,0.15)',
		hover: 'rgba(136,57,239,0.08)',
		disabled: '#acb0be', // surface2
	},
	spacing: { rowHeight: '48px', headerHeight: '52px', cellPaddingX: '16px', iconSize: '16px' },
	typography: { fontSize: '14px', fontSizeHeader: '12px' },
	shape: { borderRadius: '6px' },
	checkbox: { size: '16px', borderRadius: '4px' },
	headerSeparator: 'subtle',
	darkMode: {
		primary: '#cba6f7',
		text: {
			primary: '#cdd6f4', // mocha: text
			secondary: '#bac2de', // mocha: subtext1
			disabled: '#6c7086', // mocha: overlay0
		},
		background: { default: '#1e1e2e', header: '#181825', footer: '#181825' }, // base / mantle
		divider: { default: '#45475a' }, // surface1
		highlightOnHover: { default: '#313244', text: '#cdd6f4' }, // surface0
		striped: { default: '#181825', text: '#cdd6f4' }, // mantle
		selected: { default: '#313244', text: '#cdd6f4' }, // surface0
		context: { background: '#cba6f7', text: '#1e1e2e' },
		button: {
			default: '#9399b2', // overlay2
			focus: 'rgba(203,166,247,0.15)',
			hover: 'rgba(203,166,247,0.08)',
			disabled: '#585b70', // surface2
		},
	},
};
