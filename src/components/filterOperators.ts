import type { FilterCondition, FilterOperator, FilterType, Localization } from '../types';
import { defaultOperator } from '../hooks/useColumnFilter';

type ColumnFilterOptions = NonNullable<Localization['filter']>;

export type OperatorOption = { value: FilterOperator; label: string; noInput?: boolean; twoInputs?: boolean };

// English fallbacks, used only when no localization is supplied. `localization.filter`
// is optional and has no default, so with no locale these are the labels that render.
// Translations live in src/locales/*.ts and override them via `operatorsFor`; the
// duplication is deliberate, keeping the locale bundle independent of the core.
const DEFAULT_TEXT_OPERATORS: OperatorOption[] = [
	{ value: 'contains', label: 'Contains' },
	{ value: 'notContains', label: 'Does not contain' },
	{ value: 'equals', label: 'Equals' },
	{ value: 'notEquals', label: 'Does not equal' },
	{ value: 'startsWith', label: 'Begins with' },
	{ value: 'endsWith', label: 'Ends with' },
	{ value: 'blank', label: 'Blank', noInput: true },
	{ value: 'notBlank', label: 'Not blank', noInput: true },
];

const DEFAULT_NUMBER_OPERATORS: OperatorOption[] = [
	{ value: 'equals', label: 'Equals' },
	{ value: 'notEquals', label: 'Does not equal' },
	{ value: 'gt', label: 'Greater than' },
	{ value: 'gte', label: 'Greater than or equal' },
	{ value: 'lt', label: 'Less than' },
	{ value: 'lte', label: 'Less than or equal' },
	{ value: 'between', label: 'Between', twoInputs: true },
	{ value: 'blank', label: 'Blank', noInput: true },
	{ value: 'notBlank', label: 'Not blank', noInput: true },
];

const DEFAULT_DATE_OPERATORS: OperatorOption[] = [
	{ value: 'equals', label: 'Equals' },
	{ value: 'before', label: 'Before' },
	{ value: 'after', label: 'After' },
	{ value: 'between', label: 'Between', twoInputs: true },
	{ value: 'blank', label: 'Blank', noInput: true },
	{ value: 'notBlank', label: 'Not blank', noInput: true },
];

function baseOperators(filterType: FilterType): OperatorOption[] {
	if (filterType === 'number') {
		return DEFAULT_NUMBER_OPERATORS;
	}
	if (filterType === 'date' || filterType === 'datetime' || filterType === 'time') {
		return DEFAULT_DATE_OPERATORS;
	}
	return DEFAULT_TEXT_OPERATORS;
}

export function operatorsFor(filterType: FilterType, overrides?: ColumnFilterOptions['operators']): OperatorOption[] {
	const base = baseOperators(filterType);
	if (!overrides) {
		return base;
	}
	return base.map(op => (overrides[op.value] ? { ...op, label: overrides[op.value]! } : op));
}

export function inputTypeFor(filterType: FilterType): string {
	if (filterType === 'number') {
		return 'number';
	}
	if (filterType === 'date') {
		return 'date';
	}
	if (filterType === 'datetime') {
		return 'datetime-local';
	}
	if (filterType === 'time') {
		return 'time';
	}
	return 'text';
}

export function emptyCondition(filterType: FilterType): FilterCondition {
	return { operator: defaultOperator(filterType) };
}
