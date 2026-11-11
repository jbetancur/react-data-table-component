import { renderHook, act } from '@testing-library/react';
import * as headless from '../headless';
import * as main from '../index';
import { useColumns, useTableState, useTableData, useCellNavigation, SortOrder } from '../headless';
import type { TableColumn } from '../headless';

type Row = { id: number; name: string };

const columns: TableColumn<Row>[] = [
	{ id: 'name', name: 'Name', selector: r => r.name, sortable: true },
	{ id: 'id', name: 'Id', selector: r => r.id, sortable: true },
];

const data: Row[] = [
	{ id: 1, name: 'Cara' },
	{ id: 2, name: 'Abe' },
	{ id: 3, name: 'Bo' },
];

// ── Entry point ──────────────────────────────────────────────────────────────

describe('headless entry', () => {
	test('the main entry re-exports every headless export', () => {
		const mainExports = main as unknown as Record<string, unknown>;

		for (const [name, value] of Object.entries(headless)) {
			expect(mainExports[name]).toBe(value);
		}
	});
});

// ── Defaults ─────────────────────────────────────────────────────────────────

function usePipeline(options: { pagination?: boolean; paginationPerPage?: number } = {}) {
	const { tableColumns, defaultSortColumn, defaultSortDirection } = useColumns(columns);
	const state = useTableState({ data, defaultSortColumn, defaultSortDirection, ...options });
	const { selectedColumn, sortDirection, sortColumns, currentPage, rowsPerPage } = state.tableState;
	const rows = useTableData({
		data,
		selectedColumn,
		sortDirection,
		sortColumns,
		currentPage,
		rowsPerPage,
		pagination: options.pagination,
	});

	return { tableColumns, ...state, ...rows };
}

describe('headless hooks with default options', () => {
	test('useColumns needs only columns', () => {
		const { result } = renderHook(() => useColumns(columns));

		expect(result.current.tableColumns.map(c => c.id)).toEqual(['name', 'id']);
		expect(result.current.defaultSortColumn).toEqual({});
		expect(result.current.defaultSortDirection).toBe(SortOrder.ASC);
	});

	test('useColumns takes an options object', () => {
		const onColumnOrderChange = vi.fn();
		const { result } = renderHook(() =>
			useColumns(columns, { defaultSortFieldId: 'id', defaultSortAsc: false, onColumnOrderChange }),
		);

		expect(result.current.defaultSortColumn.id).toBe('id');
		expect(result.current.defaultSortDirection).toBe(SortOrder.DESC);

		act(() => result.current.handlePinColumn('id', 'left'));

		expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
		expect(result.current.tableColumns[0]).toMatchObject({ id: 'id', pinned: 'left' });
	});

	test('useTableState needs only data', () => {
		const { result } = renderHook(() => useTableState({ data }));

		expect(result.current.tableState).toMatchObject({
			currentPage: 1,
			rowsPerPage: 10,
			sortDirection: SortOrder.ASC,
			sortColumns: [],
			selectedRows: [],
		});
	});

	test('omitted options keep handler identity stable across renders', () => {
		const { result, rerender } = renderHook(() => useTableState({ data }));
		const first = result.current;

		rerender();

		expect(result.current.handleChangePage).toBe(first.handleChangePage);
		expect(result.current.handleClearSort).toBe(first.handleClearSort);
	});

	test('the pipeline returns unsorted, unpaginated rows by default', () => {
		const { result } = renderHook(() => usePipeline());

		expect(result.current.tableRows).toEqual(data);
	});

	test('sorts through the default pipeline', () => {
		const { result } = renderHook(() => usePipeline());

		act(() => {
			result.current.handleSort({
				type: 'SORT_CHANGE',
				selectedColumn: result.current.tableColumns[0],
				clearSelectedOnSort: false,
				additive: false,
				defaultSortDirection: SortOrder.ASC,
			});
		});

		expect(result.current.tableRows.map(r => r.name)).toEqual(['Abe', 'Bo', 'Cara']);
	});

	test('paginates when pagination is on', () => {
		const { result } = renderHook(() => usePipeline({ pagination: true, paginationPerPage: 2 }));

		expect(result.current.tableRows.map(r => r.id)).toEqual([1, 2]);
		expect(result.current.sortedData).toHaveLength(3);

		act(() => result.current.handleChangePage(2));

		expect(result.current.tableRows.map(r => r.id)).toEqual([3]);
	});

	test('selects a row using the default keyField', () => {
		const { result } = renderHook(() => useTableState({ data }));

		act(() => {
			result.current.handleSelectedRow({
				type: 'SELECT_SINGLE_ROW',
				keyField: 'id',
				row: data[1],
				isSelected: false,
				rowCount: data.length,
				singleSelect: false,
			});
		});

		expect(result.current.tableState.selectedRows).toEqual([data[1]]);
	});

	test('useCellNavigation is on by default and includes the header row', () => {
		const { result } = renderHook(() => useCellNavigation({ effectiveColumns: columns, filteredTableRowCount: 3 }));

		expect(result.current.activeCell).toEqual({ row: 0, col: 0 });
	});
});
