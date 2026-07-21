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
});
