import { renderHook, act } from '@testing-library/react';
import useColumnFilter, { emptyFilterState, isFilterActive } from '../hooks/useColumnFilter';
import type { TableColumn, FilterState } from '../types';

type Row = { id: number; name: string; price: number; releasedAt: string };

const columns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, filterable: true, filterType: 'text' },
	{ id: 'price', name: 'Price', selector: r => r.price, filterable: true, filterType: 'number' },
	{ id: 'releasedAt', name: 'Released', selector: r => r.releasedAt, filterable: true, filterType: 'date' },
];

const data: Row[] = [
	{ id: 1, name: 'Apple', price: 10, releasedAt: '2024-01-01' },
	{ id: 2, name: 'Banana', price: 20, releasedAt: '2024-06-15' },
	{ id: 3, name: 'Cherry', price: 30, releasedAt: '2025-03-10' },
	{ id: 4, name: '', price: 0, releasedAt: '2024-01-01' },
];

describe('emptyFilterState', () => {
	test('defaults to a "contains" condition for text filters', () => {
		expect(emptyFilterState('text')).toEqual({ condition1: { operator: 'contains' } });
	});

	test('defaults to an "equals" condition for numeric filters', () => {
		expect(emptyFilterState('number')).toEqual({ condition1: { operator: 'equals' } });
	});
});

describe('isFilterActive', () => {
	test('returns false for a fresh filter with no value', () => {
		expect(isFilterActive(emptyFilterState('text'))).toBe(false);
	});

	test('returns true once a value is supplied', () => {
		expect(isFilterActive({ condition1: { operator: 'contains', value: 'app' } })).toBe(true);
	});

	test('treats blank / notBlank operators as active without a value', () => {
		expect(isFilterActive({ condition1: { operator: 'blank' } })).toBe(true);
		expect(isFilterActive({ condition1: { operator: 'notBlank' } })).toBe(true);
	});

	test('is active when only the second condition has a value', () => {
		expect(
			isFilterActive({
				condition1: { operator: 'contains' },
				condition2: { operator: 'contains', value: 'app' },
			}),
		).toBe(true);
	});

	test('between is active with only one bound filled', () => {
		expect(isFilterActive({ condition1: { operator: 'between', value: '10' } })).toBe(true);
		expect(isFilterActive({ condition1: { operator: 'between', value2: '20' } })).toBe(true);
	});
});

describe('useColumnFilter:uncontrolled', () => {
	test('updates internal filterValues when handleFilterChange is called', () => {
		const { result } = renderHook(() => useColumnFilter<Row>(columns));

		act(() => {
			result.current.handleFilterChange('name', { condition1: { operator: 'contains', value: 'app' } });
		});

		expect(result.current.filterValues.name).toEqual({ condition1: { operator: 'contains', value: 'app' } });
	});

	test('returns data unchanged when no filters are active', () => {
		const { result } = renderHook(() => useColumnFilter<Row>(columns));

		expect(result.current.filteredData(data)).toEqual(data);
	});
});

describe('useColumnFilter:controlled', () => {
	test('uses the controlled filterValues prop and does not write to internal state', () => {
		const onFilterChange = vi.fn();
		const controlled: Record<string, FilterState> = {
			name: { condition1: { operator: 'contains', value: 'apple' } },
		};

		const { result } = renderHook(() => useColumnFilter<Row>(columns, controlled, onFilterChange));

		expect(result.current.filterValues).toBe(controlled);

		act(() => {
			result.current.handleFilterChange('name', { condition1: { operator: 'equals', value: 'banana' } });
		});

		expect(onFilterChange).toBeCalledWith('name', { condition1: { operator: 'equals', value: 'banana' } });
		// The hook should not have mutated the controlled object
		expect(result.current.filterValues).toBe(controlled);
	});
});

describe('useColumnFilter:text operators', () => {
	const setFilter = (filter: FilterState) => {
		const { result } = renderHook(() => useColumnFilter<Row>(columns, { name: filter }));
		return result.current.filteredData(data);
	};

	test('contains matches case-insensitively', () => {
		expect(setFilter({ condition1: { operator: 'contains', value: 'an' } }).map(r => r.name)).toEqual(['Banana']);
	});

	test('notContains excludes rows matching the value', () => {
		const names = setFilter({ condition1: { operator: 'notContains', value: 'an' } }).map(r => r.name);
		expect(names).toEqual(['Apple', 'Cherry', '']);
	});

	test('equals (text) matches exact value case-insensitively', () => {
		expect(setFilter({ condition1: { operator: 'equals', value: 'apple' } }).map(r => r.name)).toEqual(['Apple']);
	});

	test('notEquals excludes the exact value', () => {
		const names = setFilter({ condition1: { operator: 'notEquals', value: 'apple' } }).map(r => r.name);
		expect(names).toEqual(['Banana', 'Cherry', '']);
	});

	test('startsWith only matches the leading substring', () => {
		expect(setFilter({ condition1: { operator: 'startsWith', value: 'ch' } }).map(r => r.name)).toEqual(['Cherry']);
	});

	test('endsWith only matches the trailing substring', () => {
		expect(setFilter({ condition1: { operator: 'endsWith', value: 'rry' } }).map(r => r.name)).toEqual(['Cherry']);
	});

	test('unknown text operator returns all rows', () => {
		// exercises the default branch in the text switch
		const filter: FilterState = { condition1: { operator: 'gt' as never, value: 'x' } };
		expect(setFilter(filter)).toHaveLength(data.length);
	});

	test('blank matches empty cells', () => {
		expect(setFilter({ condition1: { operator: 'blank' } }).map(r => r.id)).toEqual([4]);
	});

	test('notBlank excludes empty cells', () => {
		expect(setFilter({ condition1: { operator: 'notBlank' } }).map(r => r.id)).toEqual([1, 2, 3]);
	});
});

describe('useColumnFilter:number operators', () => {
	const setFilter = (filter: FilterState) => {
		const { result } = renderHook(() => useColumnFilter<Row>(columns, { price: filter }));
		return result.current.filteredData(data);
	};

	test('gt returns rows strictly greater than the value', () => {
		expect(setFilter({ condition1: { operator: 'gt', value: '10' } }).map(r => r.id)).toEqual([2, 3]);
	});

	test('between is inclusive of both bounds', () => {
		expect(setFilter({ condition1: { operator: 'between', value: '10', value2: '20' } }).map(r => r.id)).toEqual([
			1, 2,
		]);
	});

	test('equals only matches the exact value', () => {
		expect(setFilter({ condition1: { operator: 'equals', value: '20' } }).map(r => r.id)).toEqual([2]);
	});

	test('between with only a lower bound acts as gte', () => {
		expect(setFilter({ condition1: { operator: 'between', value: '15' } }).map(r => r.id)).toEqual([2, 3]);
	});

	test('between with only an upper bound acts as lte', () => {
		expect(setFilter({ condition1: { operator: 'between', value2: '15' } }).map(r => r.id)).toEqual([1, 4]);
	});
});

describe('useColumnFilter:date operators', () => {
	const setFilter = (filter: FilterState) => {
		const { result } = renderHook(() => useColumnFilter<Row>(columns, { releasedAt: filter }));
		return result.current.filteredData(data);
	};

	test('before returns rows older than the cutoff', () => {
		expect(setFilter({ condition1: { operator: 'before', value: '2024-02-01' } }).map(r => r.id)).toEqual([1, 4]);
	});

	test('after returns rows newer than the cutoff', () => {
		expect(setFilter({ condition1: { operator: 'after', value: '2024-12-31' } }).map(r => r.id)).toEqual([3]);
	});

	test('equals matches the calendar day even when the cell carries a time (no TZ skew)', () => {
		type WithTime = { id: number; d: string };
		const cols: TableColumn<WithTime>[] = [
			{ id: 'd', name: 'D', selector: r => r.d, filterable: true, filterType: 'date' },
		];
		const rows: WithTime[] = [
			{ id: 1, d: '2024-03-15T00:30:00' },
			{ id: 2, d: '2024-03-15T23:45:00' },
			{ id: 3, d: '2024-03-16T10:00:00' },
		];
		const { result } = renderHook(() =>
			useColumnFilter<WithTime>(cols, { d: { condition1: { operator: 'equals', value: '2024-03-15' } } }),
		);
		expect(result.current.filteredData(rows).map(r => r.id)).toEqual([1, 2]);
	});

	test('equals matches rows on the same calendar day', () => {
		expect(setFilter({ condition1: { operator: 'equals', value: '2024-01-01' } }).map(r => r.id)).toEqual([1, 4]);
	});

	test('between is inclusive of both date bounds', () => {
		expect(
			setFilter({ condition1: { operator: 'between', value: '2024-01-01', value2: '2024-06-15' } }).map(r => r.id),
		).toEqual([1, 2, 4]);
	});

	test('between with only one date bound leaves the other side unbounded', () => {
		expect(setFilter({ condition1: { operator: 'between', value: '2024-06-01' } }).map(r => r.id)).toEqual([2, 3]);
		expect(setFilter({ condition1: { operator: 'between', value2: '2024-06-01' } }).map(r => r.id)).toEqual([1, 4]);
	});

	test('unknown date operator returns all rows', () => {
		// exercises the default branch in the date switch
		const filter: FilterState = { condition1: { operator: 'notBlank' as never, value: '' } };
		const colsDateNotBlank: typeof columns = [
			{ id: 'releasedAt', name: 'Released', selector: r => r.releasedAt, filterable: true, filterType: 'date' },
		];
		const { result } = renderHook(() => useColumnFilter<Row>(colsDateNotBlank, { releasedAt: filter }));
		expect(result.current.filteredData(data)).toHaveLength(data.length);
	});
});

describe('useColumnFilter:datetime operators', () => {
	type Event = { id: number; at: string };
	const events: Event[] = [
		{ id: 1, at: '2024-01-01T09:00' },
		{ id: 2, at: '2024-01-01T15:30' },
		{ id: 3, at: '2024-01-01T15:30:45' },
		{ id: 4, at: '2024-01-02T08:00' },
	];
	const cols: TableColumn<Event>[] = [
		{ id: 'at', name: 'At', selector: r => r.at, filterable: true, filterType: 'datetime' },
	];
	const setFilter = (filter: FilterState) => {
		const { result } = renderHook(() => useColumnFilter<Event>(cols, { at: filter }));
		return result.current.filteredData(events);
	};

	test('equals matches the exact instant, not the whole day', () => {
		expect(setFilter({ condition1: { operator: 'equals', value: '2024-01-01T15:30' } }).map(r => r.id)).toEqual([2]);
	});

	test('before / after compare on time of day', () => {
		expect(setFilter({ condition1: { operator: 'before', value: '2024-01-01T12:00' } }).map(r => r.id)).toEqual([1]);
		expect(setFilter({ condition1: { operator: 'after', value: '2024-01-01T12:00' } }).map(r => r.id)).toEqual([
			2, 3, 4,
		]);
	});

	test('between bounds a time window across days', () => {
		expect(
			setFilter({
				condition1: { operator: 'between', value: '2024-01-01T15:00', value2: '2024-01-02T09:00' },
			}).map(r => r.id),
		).toEqual([2, 3, 4]);
	});
});

describe('useColumnFilter:time operators', () => {
	// Same clock times spread across different days — the date must be ignored.
	type Log = { id: number; ts: string };
	const logs: Log[] = [
		{ id: 1, ts: '2024-01-01T03:15:00' },
		{ id: 2, ts: '2024-02-14T09:30:00' },
		{ id: 3, ts: '2024-03-20T17:45:30' },
		{ id: 4, ts: '2024-04-01T23:10:00' },
		{ id: 5, ts: '2024-05-05T00:20:00' },
	];
	const cols: TableColumn<Log>[] = [
		{ id: 'ts', name: 'Timestamp', selector: r => r.ts, filterable: true, filterType: 'time' },
	];
	const setFilter = (filter: FilterState) => {
		const { result } = renderHook(() => useColumnFilter<Log>(cols, { ts: filter }));
		return result.current.filteredData(logs).map(r => r.id);
	};

	test('after matches a time of day on every date', () => {
		expect(setFilter({ condition1: { operator: 'after', value: '17:00' } })).toEqual([3, 4]);
	});

	test('before ignores the date component', () => {
		expect(setFilter({ condition1: { operator: 'before', value: '09:30' } })).toEqual([1, 5]);
	});

	test('equals matches to the second', () => {
		expect(setFilter({ condition1: { operator: 'equals', value: '17:45:30' } })).toEqual([3]);
		expect(setFilter({ condition1: { operator: 'equals', value: '17:45' } })).toEqual([]);
	});

	test('between bounds a normal daytime window', () => {
		expect(setFilter({ condition1: { operator: 'between', value: '09:00', value2: '18:00' } })).toEqual([2, 3]);
	});

	test('between wraps past midnight when start is later than end', () => {
		// Overnight window 22:00–06:00 matches late-night and early-morning rows
		expect(setFilter({ condition1: { operator: 'between', value: '22:00', value2: '06:00' } })).toEqual([1, 4, 5]);
	});

	test('non-time cell values do not match', () => {
		const { result } = renderHook(() =>
			useColumnFilter<Log>(cols, { ts: { condition1: { operator: 'after', value: '00:00' } } }),
		);
		expect(result.current.filteredData([{ id: 9, ts: 'not a time' }])).toEqual([]);
	});
});

describe('useColumnFilter:condition combinators', () => {
	const setFilter = (filter: FilterState) => {
		const { result } = renderHook(() => useColumnFilter<Row>(columns, { name: filter }));
		return result.current.filteredData(data);
	};

	test('AND requires both conditions to pass', () => {
		const names = setFilter({
			condition1: { operator: 'contains', value: 'a' },
			condition2: { operator: 'endsWith', value: 'e' },
			logic: 'AND',
		}).map(r => r.name);

		expect(names).toEqual(['Apple']);
	});

	test('OR matches either condition', () => {
		const names = setFilter({
			condition1: { operator: 'equals', value: 'cherry' },
			condition2: { operator: 'startsWith', value: 'a' },
			logic: 'OR',
		}).map(r => r.name);

		expect(names).toEqual(['Apple', 'Cherry']);
	});

	test('inactive second condition is ignored', () => {
		const names = setFilter({
			condition1: { operator: 'contains', value: 'a' },
			condition2: { operator: 'contains', value: '' },
			logic: 'AND',
		}).map(r => r.name);

		expect(names).toEqual(['Apple', 'Banana']);
	});

	test('second condition applies alone when the first is empty', () => {
		const names = setFilter({
			condition1: { operator: 'contains' },
			condition2: { operator: 'startsWith', value: 'ban' },
			logic: 'AND',
		}).map(r => r.name);

		expect(names).toEqual(['Banana']);
	});

	test('empty first condition does not force-match every row under OR', () => {
		const names = setFilter({
			condition1: { operator: 'contains' },
			condition2: { operator: 'equals', value: 'cherry' },
			logic: 'OR',
		}).map(r => r.name);

		expect(names).toEqual(['Cherry']);
	});
});

describe('useColumnFilter:custom filterFunction', () => {
	test('delegates to the column-supplied filterFunction', () => {
		const custom: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				filterable: true,
				filterFunction: (row, filter) => row.name.length === parseInt(filter.condition1.value ?? '0', 10),
			},
		];

		const { result } = renderHook(() =>
			useColumnFilter<Row>(custom, { name: { condition1: { operator: 'equals', value: '6' } } }),
		);

		expect(result.current.filteredData(data).map(r => r.name)).toEqual(['Banana', 'Cherry']);
	});

	test('runs for a value-less operator (built-in isFilterActive would skip it)', () => {
		let calls = 0;
		const custom: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				filterable: true,
				filterFunction: row => {
					calls++;
					return row.name.length === 5;
				},
			},
		];

		const { result } = renderHook(() =>
			useColumnFilter<Row>(custom, { name: { condition1: { operator: 'startsWith' } } }),
		);

		expect(result.current.filteredData(data).map(r => r.name)).toEqual(['Apple']);
		expect(calls).toBeGreaterThan(0);
	});

	test('does not run once its filter is cleared back to the empty default', () => {
		let calls = 0;
		const custom: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Name',
				selector: r => r.name,
				filterable: true,
				filterFunction: () => {
					calls++;
					return false;
				},
			},
		];

		const { result } = renderHook(() => useColumnFilter<Row>(custom, { name: emptyFilterState('text') }));

		expect(result.current.filteredData(data)).toHaveLength(data.length);
		expect(calls).toBe(0);
	});
});

describe('set filter', () => {
	const setColumns: TableColumn<Row>[] = [
		{ id: 'name', name: 'Name', selector: r => r.name, filterable: true, filterType: 'set' },
		{ id: 'price', name: 'Price', selector: r => r.price, filterable: true, filterType: 'number' },
	];

	test('keeps only rows whose value is selected', () => {
		const { result } = renderHook(() =>
			useColumnFilter<Row>(setColumns, { name: { ...emptyFilterState('set'), values: ['Apple', 'Cherry'] } }),
		);

		expect(result.current.filteredData(data).map(r => r.name)).toEqual(['Apple', 'Cherry']);
	});

	test('an undefined selection matches every row', () => {
		const { result } = renderHook(() => useColumnFilter<Row>(setColumns, { name: emptyFilterState('set') }));

		expect(result.current.filteredData(data)).toHaveLength(data.length);
	});

	test('an empty selection matches no rows', () => {
		const { result } = renderHook(() =>
			useColumnFilter<Row>(setColumns, { name: { ...emptyFilterState('set'), values: [] } }),
		);

		expect(result.current.filteredData(data)).toHaveLength(0);
	});

	test('selecting the empty string matches blank cells', () => {
		const { result } = renderHook(() =>
			useColumnFilter<Row>(setColumns, { name: { ...emptyFilterState('set'), values: [''] } }),
		);

		expect(result.current.filteredData(data).map(r => r.id)).toEqual([4]);
	});

	test('an empty selection is active even though it carries no condition', () => {
		expect(isFilterActive({ ...emptyFilterState('set'), values: [] })).toBe(true);
		expect(isFilterActive(emptyFilterState('set'))).toBe(false);
	});

	test('getDistinctValues returns sorted distinct values with blanks last', () => {
		const { result } = renderHook(() => useColumnFilter<Row>(setColumns, { rows: data }));

		expect(result.current.filtering.getDistinctValues('name')).toEqual(['Apple', 'Banana', 'Cherry', '']);
	});

	test('getDistinctValues sees rows added after mount', () => {
		const { result, rerender } = renderHook(({ rows }) => useColumnFilter<Row>(setColumns, { rows }), {
			initialProps: { rows: data.slice(0, 2) },
		});

		expect(result.current.filtering.getDistinctValues('name')).toEqual(['Apple', 'Banana']);

		rerender({ rows: data });
		expect(result.current.filtering.getDistinctValues('name')).toEqual(['Apple', 'Banana', 'Cherry', '']);
	});

	test('filterOptions replaces the derived values and keeps the given order', () => {
		const columns: TableColumn<Row>[] = [
			{
				...setColumns[0],
				filterOptions: { values: ['Cherry', 'Damson', 'Apple'] },
			},
		];

		const { result } = renderHook(() => useColumnFilter<Row>(columns, { rows: data }));

		expect(result.current.filtering.getDistinctValues('name')).toEqual(['Cherry', 'Damson', 'Apple']);
	});

	test('filterOptions offers no blanks unless the list asks for one', () => {
		const columns: TableColumn<Row>[] = [{ ...setColumns[0], filterOptions: { values: ['Apple'] } }];
		const { result } = renderHook(() => useColumnFilter<Row>(columns, { rows: data }));

		expect(result.current.filtering.getDistinctValues('name')).toEqual(['Apple']);

		const withBlank: TableColumn<Row>[] = [{ ...setColumns[0], filterOptions: { values: ['Apple', '  '] } }];
		const { result: r2 } = renderHook(() => useColumnFilter<Row>(withBlank, { rows: data }));

		expect(r2.current.filtering.getDistinctValues('name')).toEqual(['Apple', '']);
	});

	test('the filterOptions function receives the rows the table is holding', () => {
		const columns: TableColumn<Row>[] = [
			{
				...setColumns[0],
				filterOptions: { values: rows => [...new Set(['Damson', ...rows.map(r => r.name)])] },
			},
		];

		const { result, rerender } = renderHook(({ rows }) => useColumnFilter<Row>(columns, { rows }), {
			initialProps: { rows: data.slice(0, 2) },
		});

		expect(result.current.filtering.getDistinctValues('name')).toEqual(['Damson', 'Apple', 'Banana']);

		rerender({ rows: data });
		expect(result.current.filtering.getDistinctValues('name')).toEqual(['Damson', 'Apple', 'Banana', 'Cherry', '']);
	});

	test('selecting a filterOptions value the rows do not contain keeps only rows outside the checklist', () => {
		const columns: TableColumn<Row>[] = [{ ...setColumns[0], filterOptions: { values: ['Apple', 'Damson'] } }];

		// knownValues is the checklist that was on screen, so Banana and Cherry were never
		// offered and are not treated as unchecked. Only Apple, offered and left unchecked, goes.
		const { result } = renderHook(() =>
			useColumnFilter<Row>(columns, {
				filterValues: { name: { ...emptyFilterState('set'), values: ['Damson'], knownValues: ['Apple', 'Damson'] } },
				rows: data,
			}),
		);

		expect(result.current.filteredData(data).map(r => r.name)).toEqual(['Banana', 'Cherry', '']);
	});

	test('an exhaustive filterOptions selection drops every row outside it', () => {
		const columns: TableColumn<Row>[] = [{ ...setColumns[0], filterOptions: { values: ['Apple', 'Damson'] } }];

		// No knownValues, so values is an exhaustive allow-list and Damson matches no row.
		const { result } = renderHook(() =>
			useColumnFilter<Row>(columns, {
				filterValues: { name: { ...emptyFilterState('set'), values: ['Damson'] } },
				rows: data,
			}),
		);

		expect(result.current.filteredData(data)).toEqual([]);
	});

	test('the filtering slice keeps its identity when only the rows change', () => {
		const { result, rerender } = renderHook(({ rows }) => useColumnFilter<Row>(setColumns, { rows }), {
			initialProps: { rows: data.slice(0, 2) },
		});

		const first = result.current.filtering;
		rerender({ rows: data });

		expect(result.current.filtering).toBe(first);
	});

	test('still accepts the deprecated positional signature', () => {
		const { result } = renderHook(() =>
			useColumnFilter<Row>(setColumns, { name: { ...emptyFilterState('set'), values: ['Apple'] } }),
		);

		expect(result.current.filteredData(data).map(r => r.name)).toEqual(['Apple']);
	});

	test('getDistinctValues is not narrowed by other columns filters', () => {
		const { result } = renderHook(() =>
			useColumnFilter<Row>(setColumns, {
				filterValues: {
					price: { condition1: { operator: 'lt', value: '25' } },
					name: { ...emptyFilterState('set'), values: ['Apple'] },
				},
				rows: data,
			}),
		);

		expect(result.current.filtering.getDistinctValues('name')).toEqual(['Apple', 'Banana', 'Cherry', '']);
	});

	test('whitespace-only cells are selectable as blanks', () => {
		const wsRows: Row[] = [
			{ id: 1, name: '   ', price: 1, releasedAt: '2024-01-01' },
			{ id: 2, name: '', price: 2, releasedAt: '2024-01-01' },
			{ id: 3, name: 'Real', price: 3, releasedAt: '2024-01-01' },
		];

		const { result } = renderHook(() => useColumnFilter<Row>(setColumns, { rows: wsRows }));
		expect(result.current.filtering.getDistinctValues('name')).toEqual(['Real', '']);

		const { result: r2 } = renderHook(() =>
			useColumnFilter<Row>(setColumns, { name: { ...emptyFilterState('set'), values: [''] } }),
		);
		expect(r2.current.filteredData(wsRows).map(r => r.id)).toEqual([1, 2]);
	});

	test('a caller-supplied whitespace value matches blanks', () => {
		const wsRows: Row[] = [
			{ id: 1, name: '  ', price: 1, releasedAt: '2024-01-01' },
			{ id: 2, name: 'Real', price: 2, releasedAt: '2024-01-01' },
		];
		const { result } = renderHook(() =>
			useColumnFilter<Row>(setColumns, { name: { ...emptyFilterState('set'), values: ['   '] } }),
		);

		expect(result.current.filteredData(wsRows).map(r => r.id)).toEqual([1]);
	});

	test('a set column with no selector does not filter anything out', () => {
		const noSelector: TableColumn<Row>[] = [{ id: 'name', name: 'Name', filterable: true, filterType: 'set' }];
		const { result } = renderHook(() =>
			useColumnFilter<Row>(noSelector, { name: { ...emptyFilterState('set'), values: ['Apple'] } }),
		);

		expect(result.current.filteredData(data)).toHaveLength(data.length);
	});

	test('values appearing after the filter was applied are not hidden', () => {
		const applied: FilterState = {
			...emptyFilterState('set'),
			values: ['Banana'],
			knownValues: ['Apple', 'Banana', 'Cherry', ''],
		};
		const { result } = renderHook(() => useColumnFilter<Row>(setColumns, { name: applied }));

		const withNew = [...data, { id: 9, name: 'Zebra', price: 99, releasedAt: '2024-01-01' }];
		// Apple was in the checklist and left unchecked. Zebra was not in it at all.
		expect(result.current.filteredData(withNew).map(r => r.name)).toEqual(['Banana', 'Zebra']);
	});

	test('without knownValues the selection stays an exhaustive allow-list', () => {
		const { result } = renderHook(() =>
			useColumnFilter<Row>(setColumns, { name: { ...emptyFilterState('set'), values: ['Banana'] } }),
		);

		const withNew = [...data, { id: 9, name: 'Zebra', price: 99, releasedAt: '2024-01-01' }];
		expect(result.current.filteredData(withNew).map(r => r.name)).toEqual(['Banana']);
	});

	describe('separator', () => {
		const tagColumns: TableColumn<Row>[] = [
			{
				id: 'name',
				name: 'Tags',
				selector: r => r.name,
				filterable: true,
				filterType: 'set',
				filterOptions: { separator: ',' },
			},
		];

		const tagRows: Row[] = [
			{ id: 1, name: 'React, TypeScript', price: 1, releasedAt: '2024-01-01' },
			{ id: 2, name: 'TypeScript', price: 2, releasedAt: '2024-01-01' },
			{ id: 3, name: 'Vue', price: 3, releasedAt: '2024-01-01' },
			{ id: 4, name: '', price: 4, releasedAt: '2024-01-01' },
		];

		test('the checklist offers each part rather than the whole cell', () => {
			const { result } = renderHook(() => useColumnFilter<Row>(tagColumns, { rows: tagRows }));

			expect(result.current.filtering.getDistinctValues('name')).toEqual(['React', 'TypeScript', 'Vue', '']);
		});

		test('a row matches when any of its parts is selected', () => {
			const { result } = renderHook(() =>
				useColumnFilter<Row>(tagColumns, { name: { ...emptyFilterState('set'), values: ['React'] } }),
			);

			expect(result.current.filteredData(tagRows).map(r => r.id)).toEqual([1]);
		});

		test('selecting a shared part keeps every row carrying it', () => {
			const { result } = renderHook(() =>
				useColumnFilter<Row>(tagColumns, { name: { ...emptyFilterState('set'), values: ['TypeScript'] } }),
			);

			expect(result.current.filteredData(tagRows).map(r => r.id)).toEqual([1, 2]);
		});

		test('a RegExp separator splits the same way', () => {
			const regexColumns: TableColumn<Row>[] = [{ ...tagColumns[0], filterOptions: { separator: /\s*[,|]\s*/ } }];
			const mixed: Row[] = [{ id: 1, name: 'React | TypeScript, Vue', price: 1, releasedAt: '2024-01-01' }];

			const { result } = renderHook(() => useColumnFilter<Row>(regexColumns, { rows: mixed }));
			expect(result.current.filtering.getDistinctValues('name')).toEqual(['React', 'TypeScript', 'Vue']);
		});

		test('parts are trimmed and empty ones dropped', () => {
			const ragged: Row[] = [{ id: 1, name: 'React, , TypeScript,', price: 1, releasedAt: '2024-01-01' }];
			const { result } = renderHook(() => useColumnFilter<Row>(tagColumns, { rows: ragged }));

			expect(result.current.filtering.getDistinctValues('name')).toEqual(['React', 'TypeScript']);
		});

		test('a cell of only separators is blank', () => {
			const blankish: Row[] = [{ id: 1, name: ' , ', price: 1, releasedAt: '2024-01-01' }];
			const { result } = renderHook(() => useColumnFilter<Row>(tagColumns, { rows: blankish }));

			expect(result.current.filtering.getDistinctValues('name')).toEqual(['']);

			const { result: r2 } = renderHook(() =>
				useColumnFilter<Row>(tagColumns, { name: { ...emptyFilterState('set'), values: [''] } }),
			);
			expect(r2.current.filteredData(blankish).map(r => r.id)).toEqual([1]);
		});

		test('a part appearing after the filter was applied is not hidden', () => {
			const applied: FilterState = {
				...emptyFilterState('set'),
				values: ['Vue'],
				knownValues: ['React', 'TypeScript', 'Vue', ''],
			};
			const { result } = renderHook(() => useColumnFilter<Row>(tagColumns, { name: applied }));

			const withNew = [...tagRows, { id: 9, name: 'Svelte, React', price: 9, releasedAt: '2024-01-01' }];
			// React was in the checklist and left unchecked, but Svelte was not in it at all.
			expect(result.current.filteredData(withNew).map(r => r.id)).toEqual([3, 9]);
		});

		test('a part is matched after trimming', () => {
			const padded: Row[] = [{ id: 1, name: '  React  , TypeScript', price: 1, releasedAt: '2024-01-01' }];
			const { result } = renderHook(() =>
				useColumnFilter<Row>(tagColumns, { name: { ...emptyFilterState('set'), values: ['React'] } }),
			);

			expect(result.current.filteredData(padded).map(r => r.id)).toEqual([1]);
		});

		test('no separator leaves the cell atomic', () => {
			const { result } = renderHook(() => useColumnFilter<Row>(setColumns, { rows: tagRows }));

			expect(result.current.filtering.getDistinctValues('name')).toEqual([
				'React, TypeScript',
				'TypeScript',
				'Vue',
				'',
			]);
		});
	});
});

describe('useColumnFilter:options vs filterValues detection', () => {
	test('a filterValues record keyed by an option name is not read as options', () => {
		const cols: TableColumn<Row>[] = [
			{ id: 'rows', name: 'Rows', selector: r => r.name, filterable: true, filterType: 'text' },
		];
		const { result } = renderHook(() =>
			useColumnFilter<Row>(cols, { rows: { condition1: { operator: 'contains', value: 'Apple' } } } as never),
		);

		expect(result.current.filteredData(data).map(r => r.name)).toEqual(['Apple']);
	});

	test('an empty object is treated as options, not as filter values', () => {
		const { result } = renderHook(() => useColumnFilter<Row>(columns, {}));

		expect(result.current.filteredData(data)).toHaveLength(data.length);
	});
});
