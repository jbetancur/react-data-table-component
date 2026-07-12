import { insertItem, isRowSelected, removeItem, equalizeId } from './util';
import { SortOrder } from './types';
import type { Action, TableState, SortColumn } from './types';

export function tableReducer<T>(state: TableState<T>, action: Action<T>): TableState<T> {
	const toggleOnSelectedRowsChange = !state.toggleOnSelectedRowsChange;

	switch (action.type) {
		case 'SELECT_ALL_ROWS': {
			const { keyField, rows, rowCount, mergeSelections } = action;
			const allChecked = !state.allSelected;
			const toggleOnSelectedRowsChange = !state.toggleOnSelectedRowsChange;

			if (mergeSelections) {
				const selections = allChecked
					? [...state.selectedRows, ...rows.filter(row => !isRowSelected(row, state.selectedRows, keyField))]
					: state.selectedRows.filter(row => !isRowSelected(row, rows, keyField));

				return {
					...state,
					allSelected: allChecked,
					selectedCount: selections.length,
					selectedRows: selections,
					toggleOnSelectedRowsChange,
				};
			}

			return {
				...state,
				allSelected: allChecked,
				selectedCount: allChecked ? rowCount : 0,
				selectedRows: allChecked ? rows : [],
				toggleOnSelectedRowsChange,
			};
		}

		case 'SELECT_SINGLE_ROW': {
			const { keyField, row, isSelected, rowCount, singleSelect } = action;

			// handle single select mode
			if (singleSelect) {
				if (isSelected) {
					return {
						...state,
						selectedCount: 0,
						allSelected: false,
						selectedRows: [],
						toggleOnSelectedRowsChange,
					};
				}

				return {
					...state,
					selectedCount: 1,
					allSelected: false,
					selectedRows: [row],
					toggleOnSelectedRowsChange,
				};
			}

			// handle multi select mode
			if (isSelected) {
				return {
					...state,
					selectedCount: state.selectedRows.length > 0 ? state.selectedRows.length - 1 : 0,
					allSelected: false,
					selectedRows: removeItem(state.selectedRows, row, keyField),
					toggleOnSelectedRowsChange,
				};
			}

			return {
				...state,
				selectedCount: state.selectedRows.length + 1,
				allSelected: state.selectedRows.length + 1 === rowCount,
				selectedRows: insertItem(state.selectedRows, row),
				toggleOnSelectedRowsChange,
			};
		}

		case 'SELECT_RANGE': {
			const { keyField, rangeRows, rowCount, select, disabledRows } = action;
			const disabledSet = disabledRows && disabledRows.length > 0 ? new Set(disabledRows) : null;
			const eligible = disabledSet ? rangeRows.filter(r => !disabledSet.has(r)) : rangeRows;

			let next: T[];
			if (select) {
				// Add any rows in the range that aren't already selected
				next = [...state.selectedRows, ...eligible.filter(row => !isRowSelected(row, state.selectedRows, keyField))];
			} else {
				// Remove any rows in the range
				next = state.selectedRows.filter(row => !isRowSelected(row, eligible, keyField));
			}

			return {
				...state,
				selectedRows: next,
				selectedCount: next.length,
				allSelected: next.length === rowCount && rowCount > 0,
				toggleOnSelectedRowsChange,
			};
		}

		case 'SELECT_MULTIPLE_ROWS': {
			const { keyField, selectedRows, totalRows, mergeSelections } = action;

			if (mergeSelections) {
				const selections = [
					...state.selectedRows,
					...selectedRows.filter(row => !isRowSelected(row, state.selectedRows, keyField)),
				];

				return {
					...state,
					selectedCount: selections.length,
					allSelected: false,
					selectedRows: selections,
					toggleOnSelectedRowsChange,
				};
			}

			return {
				...state,
				selectedCount: selectedRows.length,
				allSelected: selectedRows.length === totalRows,
				selectedRows,
				toggleOnSelectedRowsChange,
			};
		}

		case 'CLEAR_SELECTED_ROWS': {
			const { selectedRowsFlag } = action;

			return {
				...state,
				allSelected: false,
				selectedCount: 0,
				selectedRows: [],
				selectedRowsFlag,
			};
		}

		case 'CLEAR_SORT': {
			const { defaultSortColumn, defaultSortDirection } = action;
			const hasDefault = defaultSortColumn.id != null || !!defaultSortColumn.selector;

			return {
				...state,
				selectedColumn: defaultSortColumn,
				sortDirection: defaultSortDirection,
				sortColumns: hasDefault ? [{ column: defaultSortColumn, sortDirection: defaultSortDirection }] : [],
			};
		}

		case 'SORT_CHANGE': {
			const { selectedColumn, clearSelectedOnSort, additive, defaultSortDirection, direction } = action;
			const firstDirection = defaultSortDirection;
			const secondDirection = firstDirection === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;

			const existingIndex = state.sortColumns.findIndex(s => equalizeId(s.column.id, selectedColumn.id));

			let nextSortColumns: SortColumn<T>[];

			if (direction) {
				// Explicit direction (context menu): set it outright instead of cycling.
				if (additive) {
					nextSortColumns =
						existingIndex === -1
							? [...state.sortColumns, { column: selectedColumn, sortDirection: direction }]
							: state.sortColumns.map((s, i) =>
									i === existingIndex ? { column: selectedColumn, sortDirection: direction } : s,
								);
				} else {
					nextSortColumns = [{ column: selectedColumn, sortDirection: direction }];
				}
			} else if (additive) {
				// Ctrl/⌘+click: add or cycle the clicked column within the existing sort.
				if (existingIndex === -1) {
					nextSortColumns = [...state.sortColumns, { column: selectedColumn, sortDirection: firstDirection }];
				} else {
					const current = state.sortColumns[existingIndex];
					if (current.sortDirection === firstDirection) {
						nextSortColumns = state.sortColumns.map((s, i) =>
							i === existingIndex ? { column: selectedColumn, sortDirection: secondDirection } : s,
						);
					} else {
						// Second click on a column already in the second direction removes it from the sort.
						nextSortColumns = state.sortColumns.filter((_, i) => i !== existingIndex);
					}
				}
			} else {
				// Plain click: cycle the clicked column through asc → desc → none, replacing any other sort.
				const isOnlyColumn = state.sortColumns.length === 1 && existingIndex === 0;

				if (isOnlyColumn) {
					const current = state.sortColumns[0];
					nextSortColumns =
						current.sortDirection === firstDirection
							? [{ column: selectedColumn, sortDirection: secondDirection }]
							: [];
				} else {
					nextSortColumns = [{ column: selectedColumn, sortDirection: firstDirection }];
				}
			}

			const primary = nextSortColumns[0];

			return {
				...state,
				selectedColumn: primary ? primary.column : {},
				sortDirection: primary ? primary.sortDirection : defaultSortDirection,
				sortColumns: nextSortColumns,
				currentPage: 1,
				sortTriggeredPageReset: true,
				// when using server-side paging reset selected row counts when sorting
				...(clearSelectedOnSort && {
					allSelected: false,
					selectedCount: 0,
					selectedRows: [],
					toggleOnSelectedRowsChange,
				}),
			};
		}

		case 'CHANGE_PAGE': {
			const { page, paginationServer, visibleOnly, persistSelectedOnPageChange } = action;
			const mergeSelections = paginationServer && persistSelectedOnPageChange;
			const clearSelectedOnPage = (paginationServer && !persistSelectedOnPageChange) || visibleOnly;

			return {
				...state,
				currentPage: page,
				sortTriggeredPageReset: false,
				...(mergeSelections && {
					allSelected: false,
				}),
				// when using server-side paging reset selected row counts
				...(clearSelectedOnPage && {
					allSelected: false,
					selectedCount: 0,
					selectedRows: [],
					toggleOnSelectedRowsChange,
				}),
			};
		}

		case 'CHANGE_ROWS_PER_PAGE': {
			const { rowsPerPage, page } = action;

			return {
				...state,
				currentPage: page,
				rowsPerPage,
				sortTriggeredPageReset: false,
			};
		}

		default: {
			// Exhaustiveness check: TypeScript will error here if a new Action
			// variant is added to the union without a corresponding case above.
			const _exhaustive: never = action;
			return _exhaustive;
		}
	}
}
