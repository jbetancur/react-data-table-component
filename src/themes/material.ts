import { type Theme } from '../types';
import { defaultTheme } from './base';

// Matches MUI (Material UI) table styling exactly
// Ref: https://mui.com/material-ui/react-table/
// Primary: #1976d2 (MUI default blue-700)
// Cell padding: 16px, body2 font (14px), header: no separate bg
// Row hover: palette.action.hover = rgba(0,0,0,0.04)
// Selected: alpha(primary, 0.08) = rgba(25,118,210,0.08)
// Divider: rgba(224,224,224,1) = #e0e0e0
export const materialTheme: Theme = {
	...defaultTheme,
	primary: '#1976d2',
	text: {
		primary: 'rgba(0,0,0,0.87)',
		secondary: 'rgba(0,0,0,0.6)',
		disabled: 'rgba(0,0,0,0.38)',
	},
	background: { default: '#ffffff', footer: '#fafafa' },
	divider: { default: '#e0e0e0' },
	highlightOnHover: { default: 'rgba(0,0,0,0.04)', text: 'rgba(0,0,0,0.87)' },
	striped: { default: 'rgba(0,0,0,0.02)', text: 'rgba(0,0,0,0.87)' },
	selected: { default: 'rgba(25,118,210,0.08)', text: 'rgba(0,0,0,0.87)' },
	context: { background: '#1976d2', text: '#ffffff' },
	button: {
		default: 'rgba(0,0,0,0.54)',
		focus: 'rgba(0,0,0,0.12)',
		hover: 'rgba(0,0,0,0.04)',
		disabled: 'rgba(0,0,0,0.26)',
	},
	spacing: { rowHeight: '52px', headerHeight: '56px', cellPaddingX: '16px', iconSize: '18px' },
	typography: {
		fontSize: '14px',
		fontSizeHeader: '14px',
		fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen-Sans, Ubuntu, sans-serif',
	},
	shape: { borderRadius: '4px' },
	checkbox: { size: '18px', borderRadius: '2px' },
	headerSeparator: false,
	columnSeparator: false,
	darkMode: {
		primary: '#90caf9',
		text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.7)', disabled: 'rgba(255,255,255,0.5)' },
		background: { default: '#121212', footer: '#1a1a1a' },
		divider: { default: 'rgba(255,255,255,0.12)' },
		highlightOnHover: { default: 'rgba(255,255,255,0.08)', text: '#ffffff' },
		striped: { default: 'rgba(255,255,255,0.04)', text: '#ffffff' },
		selected: { default: 'rgba(144,202,249,0.16)', text: '#ffffff' },
		context: { background: '#90caf9', text: '#000000' },
		button: {
			default: 'rgba(255,255,255,0.7)',
			focus: 'rgba(255,255,255,0.12)',
			hover: 'rgba(255,255,255,0.08)',
			disabled: 'rgba(255,255,255,0.3)',
		},
	},
};
