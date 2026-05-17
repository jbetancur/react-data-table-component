import { type Theme } from '../types';
import { defaultTheme } from './base';

// Modern SaaS aesthetic — indigo accent, full circular checkboxes, soft slate palette
export const roundedTheme: Theme = {
	...defaultTheme,
	primary: '#6366f1',
	text: {
		primary: '#0f172a',
		secondary: '#64748b',
		disabled: '#cbd5e1',
	},
	background: { default: '#ffffff', header: '#f8fafc', footer: '#f8fafc' },
	divider: { default: '#e2e8f0' },
	highlightOnHover: { default: '#f1f5f9', text: '#0f172a' },
	striped: { default: '#f8fafc', text: '#0f172a' },
	selected: { default: '#ede9fe', text: '#0f172a' },
	context: { background: '#6366f1', text: '#ffffff' },
	button: {
		default: '#94a3b8',
		focus: 'rgba(99,102,241,0.2)',
		hover: 'rgba(99,102,241,0.08)',
		disabled: '#e2e8f0',
	},
	spacing: { rowHeight: '48px', headerHeight: '52px', cellPaddingX: '18px', iconSize: '18px' },
	typography: { fontSize: '14px', fontSizeHeader: '12px' },
	shape: { borderRadius: '8px' },
	checkbox: { size: '18px', borderRadius: '50%' },
	headerSeparator: 'subtle',
	darkMode: {
		primary: '#818cf8',
		text: { primary: '#f1f5f9', secondary: '#94a3b8', disabled: '#334155' },
		background: { default: '#0f172a', header: '#1e293b', footer: '#1e293b' },
		divider: { default: '#1e293b' },
		highlightOnHover: { default: '#1e293b', text: '#f1f5f9' },
		striped: { default: '#162032', text: '#f1f5f9' },
		selected: { default: '#2e1065', text: '#f1f5f9' },
		context: { background: '#818cf8', text: '#0f172a' },
		button: {
			default: '#475569',
			focus: 'rgba(129,140,248,0.2)',
			hover: 'rgba(129,140,248,0.1)',
			disabled: '#1e293b',
		},
	},
};
