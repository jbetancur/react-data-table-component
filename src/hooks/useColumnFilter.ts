import * as React from 'react';
import type { TableColumn, FilterState, FilterCondition, FilterOperator, FilterType, Localization } from '../types';

/**
 * Column-filter feature slice — the head-side transport for filter state.
 * `filterValues` changes identity per applied filter (legitimate re-render);
 * DataTableHead extracts each column's own value so TableCol memoization
 * stays per-column.
 */
export type FilteringSlice = {
	filterValues: Record<string | number, FilterState>;
	localization: NonNullable<Localization['filter']>;
	onFilterChange: (columnId: string | number, filter: FilterState) => void;
};

export interface UseColumnFilterResult<T> {
	filterValues: Record<string | number, FilterState>;
	handleFilterChange: (columnId: string | number, filter: FilterState) => void;
	filteredData: (data: T[]) => T[];
	filtering: FilteringSlice;
}

export function emptyFilterState(filterType: FilterType = 'text'): FilterState {
	const op: FilterOperator = filterType === 'text' ? 'contains' : 'equals';
	return { condition1: { operator: op } };
}

function isConditionActive(condition: FilterCondition): boolean {
	if (condition.operator === 'blank' || condition.operator === 'notBlank') return true;
	if (condition.operator === 'between' && (condition.value2?.trim() ?? '') !== '') return true;
	return (condition.value?.trim() ?? '') !== '';
}

export function isFilterActive(filter: FilterState): boolean {
	return isConditionActive(filter.condition1) || (!!filter.condition2 && isConditionActive(filter.condition2));
}

// Seconds since midnight for a clock time, ignoring any date component.
// Accepts a bare time ("17:30", "17:30:45") or a full timestamp whose time
// portion is extracted ("2024-01-01T17:30:00", "2024-01-01 17:30"). Returns
// null when no HH:MM can be found.
function timeOfDaySeconds(raw: string): number | null {
	const match = raw.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
	if (!match) return null;
	const h = Number(match[1]);
	const m = Number(match[2]);
	const s = match[3] ? Number(match[3]) : 0;
	if (h > 23 || m > 59 || s > 59) return null;
	return h * 3600 + m * 60 + s;
}

function applyCondition(condition: FilterCondition, cellValue: string, filterType: FilterType): boolean {
	const { operator, value = '', value2 = '' } = condition;

	if (operator === 'blank') return cellValue.trim() === '';
	if (operator === 'notBlank') return cellValue.trim() !== '';

	if (filterType === 'time') {
		const t = timeOfDaySeconds(cellValue);
		if (t === null) return false;
		const t1 = timeOfDaySeconds(value);
		const t2 = timeOfDaySeconds(value2);
		switch (operator) {
			case 'equals':
				return t1 !== null && t === t1;
			case 'before':
				return t1 !== null && t < t1;
			case 'after':
				return t1 !== null && t > t1;
			case 'between':
				if (t1 === null) return t2 === null || t <= t2;
				if (t2 === null) return t >= t1;
				// A start later than the end is a window that wraps past midnight
				// (e.g. 22:00–06:00), so match times outside the [t2, t1] gap.
				return t1 <= t2 ? t >= t1 && t <= t2 : t >= t1 || t <= t2;
			default:
				return true;
		}
	}

	if (filterType === 'number') {
		const num = parseFloat(cellValue);
		if (isNaN(num)) return false;
		const v1 = parseFloat(value);
		const v2 = parseFloat(value2);
		switch (operator) {
			case 'equals':
				return num === v1;
			case 'notEquals':
				return num !== v1;
			case 'gt':
				return num > v1;
			case 'gte':
				return num >= v1;
			case 'lt':
				return num < v1;
			case 'lte':
				return num <= v1;
			case 'between':
				// An empty bound is unbounded on that side
				return (isNaN(v1) || num >= v1) && (isNaN(v2) || num <= v2);
			default:
				return true;
		}
	}

	if (filterType === 'date' || filterType === 'datetime') {
		const d = new Date(cellValue);
		if (isNaN(d.getTime())) return false;
		const d1 = new Date(value);
		const d2 = new Date(value2);
		switch (operator) {
			case 'equals':
				// date matches the whole calendar day; datetime matches the exact instant
				return filterType === 'datetime' ? d.getTime() === d1.getTime() : d.toDateString() === d1.toDateString();
			case 'before':
				return d < d1;
			case 'after':
				return d > d1;
			case 'between':
				return (isNaN(d1.getTime()) || d >= d1) && (isNaN(d2.getTime()) || d <= d2);
			default:
				return true;
		}
	}

	// text
	const lc = cellValue.toLowerCase();
	const lv = value.toLowerCase();
	switch (operator) {
		case 'contains':
			return lc.includes(lv);
		case 'notContains':
			return !lc.includes(lv);
		case 'equals':
			return lc === lv;
		case 'notEquals':
			return lc !== lv;
		case 'startsWith':
			return lc.startsWith(lv);
		case 'endsWith':
			return lc.endsWith(lv);
		default:
			return true;
	}
}

function rowMatchesFilter<T>(row: T, filter: FilterState, col: TableColumn<T>): boolean {
	const filterType = col.filterType ?? 'text';

	if (col.filterFunction) return col.filterFunction(row, filter);

	const raw = col.selector ? col.selector(row) : '';
	const cellValue = String(raw ?? '');

	// Only active conditions participate — an empty condition1 must not force-match
	// (OR) or be a no-op operand (AND) when condition2 is doing the filtering.
	const c1Active = isConditionActive(filter.condition1);
	const c2Active = !!filter.condition2 && isConditionActive(filter.condition2);

	if (c1Active && c2Active) {
		const r1 = applyCondition(filter.condition1, cellValue, filterType);
		const r2 = applyCondition(filter.condition2!, cellValue, filterType);
		return filter.logic === 'OR' ? r1 || r2 : r1 && r2;
	}
	if (c2Active) return applyCondition(filter.condition2!, cellValue, filterType);
	return applyCondition(filter.condition1, cellValue, filterType);
}

// Module-level so the default argument does not mint a new object per render.
const EMPTY_LOCALIZATION: NonNullable<Localization['filter']> = {};

export default function useColumnFilter<T>(
	columns: TableColumn<T>[],
	controlledFilterValues?: Record<string | number, FilterState>,
	onFilterChangeProp?: (columnId: string | number, filter: FilterState) => void,
	localization: NonNullable<Localization['filter']> = EMPTY_LOCALIZATION,
): UseColumnFilterResult<T> {
	const [internalFilterValues, setInternalFilterValues] = React.useState<Record<string | number, FilterState>>({});
	const filterValues = controlledFilterValues ?? internalFilterValues;

	const handleFilterChange = React.useCallback(
		(columnId: string | number, filter: FilterState) => {
			if (onFilterChangeProp) {
				onFilterChangeProp(columnId, filter);
			} else {
				setInternalFilterValues(prev => ({ ...prev, [columnId]: filter }));
			}
		},
		[onFilterChangeProp],
	);

	const activeFilters = React.useMemo(
		() => (Object.entries(filterValues) as [string, FilterState][]).filter(([, v]) => isFilterActive(v)),
		[filterValues],
	);

	const filteredData = React.useCallback(
		(data: T[]): T[] => {
			if (activeFilters.length === 0) return data;
			return data.filter(row =>
				activeFilters.every(([colId, filter]) => {
					const col = columns.find(c => String(c.id) === colId);
					if (!col) return true;
					return rowMatchesFilter(row, filter, col);
				}),
			);
		},
		[activeFilters, columns],
	);

	const filtering = React.useMemo<FilteringSlice>(
		() => ({ filterValues, localization, onFilterChange: handleFilterChange }),
		[filterValues, localization, handleFilterChange],
	);

	return { filterValues, handleFilterChange, filteredData, filtering };
}
