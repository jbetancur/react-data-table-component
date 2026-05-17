import { tableReducer } from '../tableReducer';
import { SortOrder } from '../types';
import type { TableState, TableColumn } from '../types';

type Row = { id: number; name: string };

const column: TableColumn<Row> = { id: 1, name: 'name', selector: r => r.name };

const baseState = (overrides: Partial<TableState<Row>> = {}): TableState<Row> => ({
	allSelected: false,
	selectedCount: 0,
	selectedRows: [],
	selectedColumn: column,
	sortDirection: SortOrder.ASC,
	currentPage: 1,
	rowsPerPage: 10,
	selectedRowsFlag: false,
	toggleOnSelectedRowsChange: false,
	sortTriggeredPageReset: false,
	...overrides,
});

const r1: Row = { id: 1, name: 'a' };
const r2: Row = { id: 2, name: 'b' };
const r3: Row = { id: 3, name: 'c' };

describe('tableReducer:SELECT_ALL_ROWS', () => {
	test('selects all visible rows when nothing was selected', () => {
		const next = tableReducer(baseState(), {
			type: 'SELECT_ALL_ROWS',
			rows: [r1, r2, r3],
			rowCount: 3,
			keyField: 'id',
			mergeSelections: false,
		});

		expect(next.allSelected).toBe(true);
		expect(next.selectedCount).toBe(3);
		expect(next.selectedRows).toEqual([r1, r2, r3]);
	});

	test('deselects all rows when all were previously selected', () => {
		const next = tableReducer(baseState({ allSelected: true, selectedRows: [r1, r2], selectedCount: 2 }), {
			type: 'SELECT_ALL_ROWS',
			rows: [r1, r2],
			rowCount: 2,
			keyField: 'id',
			mergeSelections: false,
		});

		expect(next.allSelected).toBe(false);
		expect(next.selectedCount).toBe(0);
		expect(next.selectedRows).toEqual([]);
	});

	test('merges new rows with existing selections when mergeSelections=true', () => {
		const next = tableReducer(baseState({ selectedRows: [r1], selectedCount: 1 }), {
			type: 'SELECT_ALL_ROWS',
			rows: [r2, r3],
			rowCount: 2,
			keyField: 'id',
			mergeSelections: true,
		});

		expect(next.allSelected).toBe(true);
		expect(next.selectedRows).toEqual([r1, r2, r3]);
		expect(next.selectedCount).toBe(3);
	});

	test('removes only the visible rows from selections when toggling off with mergeSelections=true', () => {
		const next = tableReducer(baseState({ allSelected: true, selectedRows: [r1, r2, r3], selectedCount: 3 }), {
			type: 'SELECT_ALL_ROWS',
			rows: [r2, r3],
			rowCount: 2,
			keyField: 'id',
			mergeSelections: true,
		});

		expect(next.allSelected).toBe(false);
		expect(next.selectedRows).toEqual([r1]);
		expect(next.selectedCount).toBe(1);
	});

	test('flips toggleOnSelectedRowsChange to signal subscribers', () => {
		const next = tableReducer(baseState({ toggleOnSelectedRowsChange: false }), {
			type: 'SELECT_ALL_ROWS',
			rows: [r1],
			rowCount: 1,
			keyField: 'id',
			mergeSelections: false,
		});

		expect(next.toggleOnSelectedRowsChange).toBe(true);
	});
});

describe('tableReducer:SELECT_SINGLE_ROW (multi-select mode)', () => {
	test('adds a row to selections', () => {
		const next = tableReducer(baseState(), {
			type: 'SELECT_SINGLE_ROW',
			row: r1,
			isSelected: false,
			keyField: 'id',
			rowCount: 3,
			singleSelect: false,
		});

		expect(next.selectedRows).toEqual([r1]);
		expect(next.selectedCount).toBe(1);
		expect(next.allSelected).toBe(false);
	});

	test('sets allSelected=true when the new selection completes the set', () => {
		const next = tableReducer(baseState({ selectedRows: [r1, r2], selectedCount: 2 }), {
			type: 'SELECT_SINGLE_ROW',
			row: r3,
			isSelected: false,
			keyField: 'id',
			rowCount: 3,
			singleSelect: false,
		});

		expect(next.allSelected).toBe(true);
		expect(next.selectedCount).toBe(3);
	});

	test('removes a row when it was already selected', () => {
		const next = tableReducer(baseState({ selectedRows: [r1, r2], selectedCount: 2, allSelected: true }), {
			type: 'SELECT_SINGLE_ROW',
			row: r1,
			isSelected: true,
			keyField: 'id',
			rowCount: 2,
			singleSelect: false,
		});

		expect(next.selectedRows).toEqual([r2]);
		expect(next.selectedCount).toBe(1);
		expect(next.allSelected).toBe(false);
	});
});

describe('tableReducer:SELECT_SINGLE_ROW (singleSelect mode)', () => {
	test('replaces any existing selection with the chosen row', () => {
		const next = tableReducer(baseState({ selectedRows: [r1], selectedCount: 1 }), {
			type: 'SELECT_SINGLE_ROW',
			row: r2,
			isSelected: false,
			keyField: 'id',
			rowCount: 3,
			singleSelect: true,
		});

		expect(next.selectedRows).toEqual([r2]);
		expect(next.selectedCount).toBe(1);
		expect(next.allSelected).toBe(false);
	});

	test('clears the selection when the chosen row was already selected', () => {
		const next = tableReducer(baseState({ selectedRows: [r1], selectedCount: 1 }), {
			type: 'SELECT_SINGLE_ROW',
			row: r1,
			isSelected: true,
			keyField: 'id',
			rowCount: 3,
			singleSelect: true,
		});

		expect(next.selectedRows).toEqual([]);
		expect(next.selectedCount).toBe(0);
	});
});

describe('tableReducer:SELECT_MULTIPLE_ROWS', () => {
	test('replaces selections when mergeSelections=false', () => {
		const next = tableReducer(baseState({ selectedRows: [r1], selectedCount: 1 }), {
			type: 'SELECT_MULTIPLE_ROWS',
			selectedRows: [r2, r3],
			totalRows: 3,
			keyField: 'id',
			mergeSelections: false,
		});

		expect(next.selectedRows).toEqual([r2, r3]);
		expect(next.selectedCount).toBe(2);
		expect(next.allSelected).toBe(false);
	});

	test('sets allSelected=true when selection matches totalRows', () => {
		const next = tableReducer(baseState(), {
			type: 'SELECT_MULTIPLE_ROWS',
			selectedRows: [r1, r2],
			totalRows: 2,
			keyField: 'id',
			mergeSelections: false,
		});

		expect(next.allSelected).toBe(true);
	});

	test('merges with existing selections without duplicates when mergeSelections=true', () => {
		const next = tableReducer(baseState({ selectedRows: [r1, r2], selectedCount: 2 }), {
			type: 'SELECT_MULTIPLE_ROWS',
			selectedRows: [r2, r3],
			totalRows: 3,
			keyField: 'id',
			mergeSelections: true,
		});

		expect(next.selectedRows).toEqual([r1, r2, r3]);
		expect(next.selectedCount).toBe(3);
	});
});

describe('tableReducer:SELECT_RANGE', () => {
	test('selects every row in the range when select=true', () => {
		const next = tableReducer(baseState(), {
			type: 'SELECT_RANGE',
			keyField: 'id',
			rangeRows: [r1, r2, r3],
			rowCount: 3,
			select: true,
		});

		expect(next.selectedRows).toEqual([r1, r2, r3]);
		expect(next.selectedCount).toBe(3);
		expect(next.allSelected).toBe(true);
	});

	test('merges range with existing selection without duplicates', () => {
		const next = tableReducer(baseState({ selectedRows: [r1], selectedCount: 1 }), {
			type: 'SELECT_RANGE',
			keyField: 'id',
			rangeRows: [r1, r2],
			rowCount: 3,
			select: true,
		});

		expect(next.selectedRows).toEqual([r1, r2]);
		expect(next.selectedCount).toBe(2);
		expect(next.allSelected).toBe(false);
	});

	test('deselects every row in the range when select=false', () => {
		const next = tableReducer(baseState({ selectedRows: [r1, r2, r3], selectedCount: 3, allSelected: true }), {
			type: 'SELECT_RANGE',
			keyField: 'id',
			rangeRows: [r2, r3],
			rowCount: 3,
			select: false,
		});

		expect(next.selectedRows).toEqual([r1]);
		expect(next.selectedCount).toBe(1);
		expect(next.allSelected).toBe(false);
	});

	test('skips disabled rows', () => {
		const next = tableReducer(baseState(), {
			type: 'SELECT_RANGE',
			keyField: 'id',
			rangeRows: [r1, r2, r3],
			rowCount: 3,
			select: true,
			disabledRows: [r2],
		});

		expect(next.selectedRows).toEqual([r1, r3]);
		expect(next.allSelected).toBe(false);
	});
});

describe('tableReducer:CLEAR_SELECTED_ROWS', () => {
	test('wipes selection state and stores the supplied flag', () => {
		const next = tableReducer(
			baseState({ allSelected: true, selectedRows: [r1, r2], selectedCount: 2, selectedRowsFlag: false }),
			{ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: true },
		);

		expect(next.allSelected).toBe(false);
		expect(next.selectedCount).toBe(0);
		expect(next.selectedRows).toEqual([]);
		expect(next.selectedRowsFlag).toBe(true);
	});
});

describe('tableReducer:SORT_CHANGE', () => {
	test('updates sort column / direction and resets to page 1', () => {
		const next = tableReducer(baseState({ currentPage: 4 }), {
			type: 'SORT_CHANGE',
			sortDirection: SortOrder.DESC,
			selectedColumn: column,
			clearSelectedOnSort: false,
		});

		expect(next.selectedColumn).toBe(column);
		expect(next.sortDirection).toBe(SortOrder.DESC);
		expect(next.currentPage).toBe(1);
		expect(next.sortTriggeredPageReset).toBe(true);
	});

	test('clears the selection when clearSelectedOnSort=true', () => {
		const next = tableReducer(baseState({ selectedRows: [r1], selectedCount: 1, allSelected: true }), {
			type: 'SORT_CHANGE',
			sortDirection: SortOrder.DESC,
			selectedColumn: column,
			clearSelectedOnSort: true,
		});

		expect(next.selectedRows).toEqual([]);
		expect(next.selectedCount).toBe(0);
		expect(next.allSelected).toBe(false);
	});

	test('keeps the selection when clearSelectedOnSort=false', () => {
		const next = tableReducer(baseState({ selectedRows: [r1], selectedCount: 1, allSelected: true }), {
			type: 'SORT_CHANGE',
			sortDirection: SortOrder.DESC,
			selectedColumn: column,
			clearSelectedOnSort: false,
		});

		expect(next.selectedRows).toEqual([r1]);
		expect(next.allSelected).toBe(true);
	});
});

describe('tableReducer:CHANGE_PAGE', () => {
	test('updates the current page and clears sortTriggeredPageReset', () => {
		const next = tableReducer(baseState({ currentPage: 1, sortTriggeredPageReset: true }), {
			type: 'CHANGE_PAGE',
			page: 3,
			paginationServer: false,
			visibleOnly: false,
			persistSelectedOnPageChange: false,
		});

		expect(next.currentPage).toBe(3);
		expect(next.sortTriggeredPageReset).toBe(false);
	});

	test('clears selections under server pagination without persistSelectedOnPageChange', () => {
		const next = tableReducer(baseState({ selectedRows: [r1], selectedCount: 1, allSelected: true }), {
			type: 'CHANGE_PAGE',
			page: 2,
			paginationServer: true,
			visibleOnly: false,
			persistSelectedOnPageChange: false,
		});

		expect(next.selectedRows).toEqual([]);
		expect(next.selectedCount).toBe(0);
		expect(next.allSelected).toBe(false);
	});

	test('preserves selections under server pagination when persistSelectedOnPageChange=true', () => {
		const next = tableReducer(baseState({ selectedRows: [r1, r2], selectedCount: 2, allSelected: true }), {
			type: 'CHANGE_PAGE',
			page: 2,
			paginationServer: true,
			visibleOnly: false,
			persistSelectedOnPageChange: true,
		});

		expect(next.selectedRows).toEqual([r1, r2]);
		// allSelected is reset to false because the "all" set differs per page under server pagination.
		expect(next.allSelected).toBe(false);
	});

	test('clears selections when visibleOnly=true (client pagination)', () => {
		const next = tableReducer(baseState({ selectedRows: [r1], selectedCount: 1 }), {
			type: 'CHANGE_PAGE',
			page: 2,
			paginationServer: false,
			visibleOnly: true,
			persistSelectedOnPageChange: false,
		});

		expect(next.selectedRows).toEqual([]);
	});
});

describe('tableReducer:CHANGE_ROWS_PER_PAGE', () => {
	test('sets rowsPerPage and currentPage and clears sortTriggeredPageReset', () => {
		const next = tableReducer(baseState({ sortTriggeredPageReset: true }), {
			type: 'CHANGE_ROWS_PER_PAGE',
			rowsPerPage: 25,
			page: 2,
		});

		expect(next.rowsPerPage).toBe(25);
		expect(next.currentPage).toBe(2);
		expect(next.sortTriggeredPageReset).toBe(false);
	});
});
