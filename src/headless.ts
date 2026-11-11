// The logic layer on its own: hooks, pure helpers, and their types. Nothing here
// imports a component or DataTable.css, so `react-data-table-component/headless`
// ships no markup and injects no stylesheet. The main entry re-exports all of it.

export { default as useTableState } from './hooks/useTableState';
export type { UseTableStateProps, UseTableStateReturn } from './hooks/useTableState';
export { default as useColumns } from './hooks/useColumns';
export type { UseColumnsOptions, UseColumnsResult, ColumnDragSlice } from './hooks/useColumns';
export { default as useTableData } from './hooks/useTableData';
export type { UseTableDataProps, UseTableDataReturn } from './hooks/useTableData';
export { default as useColumnFilter, emptyFilterState, isFilterActive } from './hooks/useColumnFilter';
export type { UseColumnFilterOptions, UseColumnFilterResult } from './hooks/useColumnFilter';
export { default as useColumnVisibility } from './hooks/useColumnVisibility';
export type { UseColumnVisibilityResult, ColumnVisibilityEntry } from './hooks/useColumnVisibility';
export { default as useTableExport } from './hooks/useTableExport';
export type { UseTableExportOptions, UseTableExportResult, ExportFormat } from './hooks/useTableExport';
export { default as useCellNavigation } from './hooks/useCellNavigation';
export type { UseCellNavigationOptions } from './hooks/useCellNavigation';
export type { ActiveCell } from './context/RowContext';
export { default as useColumnResize } from './hooks/useColumnResize';
export type { UseColumnResizeOptions } from './hooks/useColumnResize';

// Pure helpers behind column pinning — call these directly if you're rendering your own
// markup and want sticky-offset positions without pulling in <DataTable />.
export { getPinnedOffsets, getPinnedTotalWidths, getPinnedCellMeta } from './util';
export type { PinnedOffsets, PinnedCellMeta } from './util';

export { SortOrder } from './types';

export type {
	TableColumn,
	ColumnGroup,
	TableState,
	SortAction,
	AllRowsAction,
	SingleRowAction,
	RangeRowAction,
	SortFunction,
	SortColumn,
	Selector,
	FilterType,
	FilterOperator,
	FilterCondition,
	FilterState,
	SetFilterOptions,
	Localization,
} from './types';
