import { type Theme } from '../types';
import { defaultTheme } from './base';

// Faithful port of AG Grid's ag-theme-quartz (current default)
// Colors are computed from the source SCSS color-mix() formulas:
//   border:   color-mix(transparent, #181d1f 15%)  → rgba(24,29,31,0.15)
//   header:   color-mix(#fff, #181d1f 2%)          → #fafafa
//   hover:    color-mix(transparent, #2196f3 12%)  → rgba(33,150,243,0.12)
//   selected: color-mix(transparent, #2196f3  8%)  → rgba(33,150,243,0.08)
// Dark base color: #182230
//   bg:       color-mix(#fff, #182230 97%)         → #1f2936
//   header:   color-mix(#fff, #182230 93%)         → #28313e
export const adgridQuartzTheme: Theme = {
	...defaultTheme,
	primary: '#2196f3',
	text: {
		primary: '#181d1f',
		secondary: 'rgba(24,29,31,0.7)',
		disabled: 'rgba(24,29,31,0.5)',
	},
	background: { default: '#ffffff', header: '#fafafa' },
	divider: { default: 'rgba(24,29,31,0.15)' },
	highlightOnHover: { default: 'rgba(33,150,243,0.12)', text: '#181d1f' },
	striped: { default: '#fafafa', text: '#181d1f' },
	selected: { default: 'rgba(33,150,243,0.08)', text: '#181d1f' },
	context: { background: '#2196f3', text: '#ffffff' },
	button: {
		default: 'rgba(24,29,31,0.9)',
		focus: 'rgba(33,150,243,0.47)',
		hover: 'rgba(24,29,31,0.1)',
		disabled: 'rgba(24,29,31,0.5)',
	},
	spacing: { rowHeight: '42px', headerHeight: '48px', cellPaddingX: '16px', iconSize: '16px' },
	typography: {
		fontSize: '14px',
		fontSizeHeader: '14px',
		fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
	},
	shape: { borderRadius: '4px' },
	checkbox: { size: '16px', borderRadius: '3px' },
	headerSeparator: 'subtle',
	darkMode: {
		primary: '#2196f3',
		text: {
			primary: '#ffffff',
			secondary: 'rgba(255,255,255,0.7)',
			disabled: 'rgba(255,255,255,0.5)',
		},
		background: { default: '#1f2936', header: '#28313e' },
		divider: { default: 'rgba(255,255,255,0.16)' },
		highlightOnHover: { default: 'rgba(33,150,243,0.2)', text: '#ffffff' },
		striped: { default: '#242d3a', text: '#ffffff' },
		selected: { default: 'rgba(33,150,243,0.2)', text: '#ffffff' },
		context: { background: '#1565c0', text: '#ffffff' },
		button: {
			default: 'rgba(255,255,255,0.9)',
			focus: 'rgba(33,150,243,0.47)',
			hover: 'rgba(255,255,255,0.1)',
			disabled: 'rgba(255,255,255,0.5)',
		},
	},
};
