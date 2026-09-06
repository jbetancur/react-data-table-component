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
	/** The column's distinct values for a `filterType: "set"` checklist. Called on
	 *  panel open, not precomputed. */
	getDistinctValues: (columnId: string | number) => string[];
};

export interface UseColumnFilterResult<T> {
	filterValues: Record<string | number, FilterState>;
	handleFilterChange: (columnId: string | number, filter: FilterState) => void;
	filteredData: (data: T[]) => T[];
	filtering: FilteringSlice;
}

export function defaultOperator(filterType: FilterType): FilterOperator {
	return filterType === 'text' ? 'contains' : 'equals';
}

export function emptyFilterState(filterType: FilterType = 'text'): FilterState {
	return { condition1: { operator: defaultOperator(filterType) } };
}

// An empty array is active and deliberately matches nothing; `undefined` means no
// selection has been made yet.
function isSetFilterActive(filter: FilterState): boolean {
	return filter.values !== undefined;
}

// Missing, empty, and whitespace-only all count as blank.
function isBlank(value: string | undefined): boolean {
	return (value?.trim() ?? '') === '';
}

// Whitespace-only cells fold into "" so they are reachable as "(Blanks)". The list
// and the matcher must agree here, or a selected value would match nothing.
function setValueOf(raw: string): string {
	return isBlank(raw) ? '' : raw;
}

// The parts of a cell under a column's `separator`, or the whole cell when it has none.
// Parts are trimmed and empties dropped, so "React, , TypeScript" yields two values and a
// cell of only separators folds to a single blank rather than vanishing from the checklist.
function splitCellValue(cellValue: string, separator: string | RegExp | undefined): string[] {
	if (separator === undefined) {
		return [setValueOf(cellValue)];
	}

	const parts = cellValue.split(separator).filter(part => !isBlank(part));

	return parts.length > 0 ? parts.map(part => part.trim()) : [''];
}

// Cached by array identity so the set is built once per filter pass, not per row.
const selectedSetCache = new WeakMap<string[], Set<string>>();
function selectedSetOf(values: string[]): Set<string> {
	let set = selectedSetCache.get(values);
	if (!set) {
		set = new Set(values.map(setValueOf));
		selectedSetCache.set(values, set);
	}
	return set;
}

/**
 * Whether a set filter keeps `value`. Shared by the matcher and the checklist so a
 * checked box and a visible row can never disagree. `values` undefined means nothing
 * has been selected yet, so everything stays; a value missing from `knownValues` was
 * not in the checklist when the filter was applied, so it was never unchecked.
 */
export function isValueSelected(
	value: string,
	values: string[] | undefined,
	knownValues: string[] | undefined,
): boolean {
	if (values === undefined) {
		return true;
	}
	if (selectedSetOf(values).has(value)) {
		return true;
	}
	return knownValues !== undefined && !selectedSetOf(knownValues).has(value);
}

// True when a filter carries nothing a consumer could have intended — the default
// operator for its type, no values, and no second condition. Used to tell an
// applied-but-cleared filterFunction filter from an intentional value-less one.
function isEmptyFilter(filter: FilterState, filterType: FilterType | undefined): boolean {
	const { operator, value, value2 } = filter.condition1;
	return (
		operator === defaultOperator(filterType ?? 'text') &&
		isBlank(value) &&
		isBlank(value2) &&
		filter.condition2 === undefined &&
		!isSetFilterActive(filter)
	);
}

function isConditionActive(condition: FilterCondition): boolean {
	if (condition.operator === 'blank' || condition.operator === 'notBlank') {
		return true;
	}
	if (condition.operator === 'between' && !isBlank(condition.value2)) {
		return true;
	}
	return !isBlank(condition.value);
}

export function isFilterActive(filter: FilterState): boolean {
	if (isSetFilterActive(filter)) {
		return true;
	}
	return isConditionActive(filter.condition1) || (!!filter.condition2 && isConditionActive(filter.condition2));
}

// The calendar day (YYYY-MM-DD) of a date-ish string, timezone-agnostically.
// An ISO date prefix is used verbatim so "2024-03-15" and "2024-03-15T00:30"
// yield the same day; anything else falls back to the local day of a parsed Date.
function calendarDay(raw: string): string | null {
	const iso = raw.match(/^(\d{4}-\d{2}-\d{2})/);
	if (iso) {
		return iso[1];
	}
	const d = new Date(raw);
	if (isNaN(d.getTime())) {
		return null;
	}
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${d.getFullYear()}-${m}-${day}`;
}

// Seconds since midnight for a clock time, ignoring any date component.
// Accepts a bare time ("17:30", "17:30:45") or a full timestamp whose time
// portion is extracted ("2024-01-01T17:30:00", "2024-01-01 17:30"). Returns
// null when no HH:MM can be found, and when the digits are out of range —
// the pattern is loose enough to match "99:99", so the range check is what
// keeps a nonsense time from comparing as a real one.
function timeOfDaySeconds(raw: string): number | null {
	const match = raw.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
	if (!match) {
		return null;
	}
	const h = Number(match[1]);
	const m = Number(match[2]);
	const s = match[3] ? Number(match[3]) : 0;

	if (h > 23 || m > 59 || s > 59) {
		return null;
	}

	return h * 3600 + m * 60 + s;
}

function applyCondition(condition: FilterCondition, cellValue: string, filterType: FilterType): boolean {
	const { operator, value = '', value2 = '' } = condition;

	if (operator === 'blank') {
		return isBlank(cellValue);
	}
	if (operator === 'notBlank') {
		return !isBlank(cellValue);
	}

	if (filterType === 'time') {
		const t = timeOfDaySeconds(cellValue);
		if (t === null) {
			return false;
		}
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
				if (t1 === null) {
					return t2 === null || t <= t2;
				}
				if (t2 === null) {
					return t >= t1;
				}
				// A start later than the end is a window that wraps past midnight
				// (e.g. 22:00–06:00), so match times outside the [t2, t1] gap.
				return t1 <= t2 ? t >= t1 && t <= t2 : t >= t1 || t <= t2;
			default:
				return true;
		}
	}

	if (filterType === 'number') {
		const num = parseFloat(cellValue);
		if (isNaN(num)) {
			return false;
		}
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
		if (isNaN(d.getTime())) {
			return false;
		}
		const d1 = new Date(value);
		const d2 = new Date(value2);
		switch (operator) {
			case 'equals':
				// datetime matches the exact instant; date matches the calendar day.
				// For the day comparison we compare the ISO Y-M-D of each side rather
				// than parsed Date objects: a bare "2024-03-15" parses as UTC midnight
				// while "2024-03-15T00:30" parses as local, so toDateString() on the
				// two disagrees by a day in non-UTC zones. Comparing day strings avoids it.
				return filterType === 'datetime' ? d.getTime() === d1.getTime() : calendarDay(cellValue) === calendarDay(value);
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

	if (col.filterFunction) {
		return col.filterFunction(row, filter);
	}

	const raw = col.selector ? col.selector(row) : '';
	const cellValue = String(raw ?? '');

	if (filterType === 'set') {
		// No selector means no distinct values to build a checklist from.
		if (!col.selector) {
			return true;
		}
		// Any part matching keeps the row: checking a tag shows every row carrying it.
		return splitCellValue(cellValue, col.filterOptions?.separator).some(value =>
			isValueSelected(value, filter.values, filter.knownValues),
		);
	}

	// Only active conditions participate — an empty condition1 must not force-match
	// (OR) or be a no-op operand (AND) when condition2 is doing the filtering.
	const c1Active = isConditionActive(filter.condition1);
	const c2Active = !!filter.condition2 && isConditionActive(filter.condition2);

	if (c1Active && c2Active) {
		const r1 = applyCondition(filter.condition1, cellValue, filterType);
		const r2 = applyCondition(filter.condition2!, cellValue, filterType);
		return filter.logic === 'OR' ? r1 || r2 : r1 && r2;
	}
	if (c2Active) {
		return applyCondition(filter.condition2!, cellValue, filterType);
	}
	return applyCondition(filter.condition1, cellValue, filterType);
}

const EMPTY_LOCALIZATION: NonNullable<Localization['filter']> = {};
const EMPTY_ROWS: never[] = [];

export interface UseColumnFilterOptions<T> {
	/** Filter state per column id. Pass with `onFilterChange` to run controlled. */
	filterValues?: Record<string | number, FilterState>;
	/** Called when a filter is applied. Pass with `filterValues` to run controlled. */
	onFilterChange?: (columnId: string | number, filter: FilterState) => void;
	localization?: NonNullable<Localization['filter']>;
	/** Rows the `filterType: "set"` checklists derive their distinct values from. */
	rows?: T[];
}

// `values` is checked as an own property: `'values' in []` is true via Array.prototype.
function isFilterState(value: unknown): boolean {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return false;
	}
	return 'condition1' in value || Object.prototype.hasOwnProperty.call(value, 'values');
}

// Both forms take a plain object second argument. They are told apart by value shape
// rather than key names, which would misread a column legitimately named "rows" or
// "localization" as an option.
function resolveOptions<T>(
	optionsOrFilterValues: UseColumnFilterOptions<T> | Record<string | number, FilterState> | undefined,
	legacyOnFilterChange?: (columnId: string | number, filter: FilterState) => void,
	legacyLocalization?: NonNullable<Localization['filter']>,
): UseColumnFilterOptions<T> {
	if (!optionsOrFilterValues) {
		return {};
	}

	const entries = Object.values(optionsOrFilterValues);
	if (entries.length === 0 || !entries.every(isFilterState)) {
		return optionsOrFilterValues as UseColumnFilterOptions<T>;
	}

	return {
		filterValues: optionsOrFilterValues as Record<string | number, FilterState>,
		onFilterChange: legacyOnFilterChange,
		localization: legacyLocalization,
	};
}

export default function useColumnFilter<T>(
	columns: TableColumn<T>[],
	optionsOrFilterValues?: UseColumnFilterOptions<T> | Record<string | number, FilterState>,
	/** @deprecated Pass `{ onFilterChange }` in the options object instead. Removed in v9. */
	legacyOnFilterChange?: (columnId: string | number, filter: FilterState) => void,
	/** @deprecated Pass `{ localization }` in the options object instead. Removed in v9. */
	legacyLocalization?: NonNullable<Localization['filter']>,
): UseColumnFilterResult<T> {
	const options = resolveOptions<T>(optionsOrFilterValues, legacyOnFilterChange, legacyLocalization);

	const {
		filterValues: controlledFilterValues,
		onFilterChange: onFilterChangeProp,
		localization = EMPTY_LOCALIZATION,
		rows = EMPTY_ROWS,
	} = options;

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

	// A filter is active if it matches values the built-in matcher understands, OR
	// the column supplies a filterFunction and the condition is anything other than
	// the pristine empty default — a custom function owns its own activation logic,
	// so it must run even for value-less operators the built-in heuristic ignores.
	const columnsById = React.useMemo(() => {
		const map = new Map<string, TableColumn<T>>();
		for (const col of columns) {
			map.set(String(col.id), col);
		}
		return map;
	}, [columns]);

	// Columns are resolved here, once per filter change, rather than per row in
	// filteredData.
	const activeFilters = React.useMemo(
		() =>
			(Object.entries(filterValues) as [string, FilterState][]).flatMap(([colId, v]) => {
				const col = columnsById.get(colId);

				if (!col) {
					return [];
				}
				if (isFilterActive(v)) {
					return [[v, col] as const];
				}
				if (!col.filterFunction) {
					return [];
				}

				return isEmptyFilter(v, col.filterType) ? [] : [[v, col] as const];
			}),
		[filterValues, columnsById],
	);

	const filteredData = React.useCallback(
		(data: T[]): T[] => {
			if (activeFilters.length === 0) {
				return data;
			}
			return data.filter(row => activeFilters.every(([filter, col]) => rowMatchesFilter(row, filter, col)));
		},
		[activeFilters],
	);

	// Read through a ref so getDistinctValues stays reference-stable: depending on
	// `rows` directly would churn the filtering slice on every data change and
	// re-render every column (ARCHITECTURE.md invariant 1). Only called on panel open.
	const distinctSource = React.useRef({ columnsById, rows });
	React.useEffect(() => {
		distinctSource.current = { columnsById, rows };
	}, [columnsById, rows]);

	const getDistinctValues = React.useCallback((columnId: string | number): string[] => {
		const { columnsById: cols, rows: allRows } = distinctSource.current;
		const col = cols.get(String(columnId));

		const values = col?.filterOptions?.values;
		if (values) {
			const supplied = typeof values === 'function' ? values(allRows) : values;

			return [...new Set(supplied.map(setValueOf))];
		}

		if (!col?.selector) {
			return [];
		}

		const seen = new Set<string>();

		for (const row of allRows) {
			for (const value of splitCellValue(String(col.selector(row) ?? ''), col.filterOptions?.separator)) {
				seen.add(value);
			}
		}

		// Blanks sort last so the checklist opens on real values.
		return [...seen].sort((a, b) => {
			if (a === '') {
				return 1;
			}
			if (b === '') {
				return -1;
			}
			return a.localeCompare(b, undefined, { numeric: true });
		});
	}, []);

	const filtering = React.useMemo<FilteringSlice>(
		() => ({ filterValues, localization, onFilterChange: handleFilterChange, getDistinctValues }),
		[filterValues, localization, handleFilterChange, getDistinctValues],
	);

	return { filterValues, handleFilterChange, filteredData, filtering };
}
