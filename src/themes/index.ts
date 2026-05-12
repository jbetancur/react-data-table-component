import { mergeDeep } from '../util';
import { type Theme, type ThemeProp } from '../types';

import { defaultColorTheme } from './default';
import { materialTheme } from './material';
import { roundedTheme } from './rounded';
import { catppuccinTheme } from './catppuccin';
import { aggridTheme } from './aggrid';

type ThemeMapping = {
	[propertyName: string]: Theme;
};

export const defaultThemes: ThemeMapping = {
	default: defaultColorTheme,
	light: defaultColorTheme,
	material: materialTheme,
	rounded: roundedTheme,
	catppuccin: catppuccinTheme,
	aggrid: aggridTheme,
};

export function themeToVars(theme: Theme): Record<string, string> {
	const vars: Record<string, string> = {
		'--rdt-color-scheme': theme.colorScheme ?? 'light',
		'--rdt-color-primary': theme.primary ?? '#1976d2',
		'--rdt-color-text-primary': theme.text.primary,
		'--rdt-color-text-secondary': theme.text.secondary,
		'--rdt-color-text-disabled': theme.text.disabled,
		'--rdt-color-bg': theme.background.default,
		'--rdt-color-context-bg': theme.context.background,
		...(theme.background.header ? { '--rdt-color-header-bg': theme.background.header } : {}),
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

	if (theme.spacing?.rowHeight != null) vars['--rdt-row-height'] = theme.spacing.rowHeight;
	if (theme.spacing?.headerHeight != null) vars['--rdt-header-height'] = theme.spacing.headerHeight;
	if (theme.spacing?.cellPaddingX != null) vars['--rdt-cell-padding-x'] = theme.spacing.cellPaddingX;
	if (theme.spacing?.iconSize != null) vars['--rdt-icon-size'] = theme.spacing.iconSize;
	if (theme.typography?.fontSize != null) vars['--rdt-font-size'] = theme.typography.fontSize;
	if (theme.typography?.fontSizeHeader != null) vars['--rdt-font-size-header'] = theme.typography.fontSizeHeader;
	if (theme.typography?.fontFamily != null) vars['--rdt-font-family'] = theme.typography.fontFamily;
	if (theme.shape?.borderRadius != null) vars['--rdt-border-radius'] = theme.shape.borderRadius;
	if (theme.checkbox?.size != null) vars['--rdt-checkbox-size'] = theme.checkbox.size;
	if (theme.checkbox?.borderRadius != null) vars['--rdt-checkbox-radius'] = theme.checkbox.borderRadius;

	return vars;
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

export function resolveTheme(
	theme: ThemeProp | undefined,
	resolvedMode: 'light' | 'dark' = 'light',
): Record<string, string> {
	if (theme && typeof theme !== 'string' && isCSSVarMap(theme as object)) {
		return theme as Record<string, string>;
	}
	const themeObj = resolveThemeObject(theme);
	const effective =
		resolvedMode === 'dark' && themeObj.darkMode
			? (mergeDeep(themeObj, { ...themeObj.darkMode, colorScheme: 'dark' } as Partial<Theme>) as Theme)
			: themeObj;
	return themeToVars(effective);
}
