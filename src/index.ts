import DataTable from './components/DataTable';

export { defaultThemes, createTheme } from './themes';
export { DEFAULT_PAGINATION_ICONS, DEFAULT_EXPANDABLE_ICON } from './defaultProps';
export * from './constants';

// Headless hooks — compose these yourself if you want to bring your own markup/styles
export { default as useTableState } from './hooks/useTableState';
export { default as useColumns } from './hooks/useColumns';
export { default as useTableData } from './hooks/useTableData';
export { default as useColumnFilter } from './hooks/useColumnFilter';
export { default as useColumnVisibility } from './hooks/useColumnVisibility';
export type { UseColumnVisibilityResult, ColumnVisibilityEntry } from './hooks/useColumnVisibility';

export { SortOrder } from './types';

export type {
	TableProps,
	DataTableHandle,
	TableColumn,
	ColumnGroup,
	TableRow,
	TableStyles,
	Theme,
	ThemeProp,
	Themes,
	ColorMode,
	ConditionalStyles,
	ExpanderComponentProps,
	PaginationComponentProps,
	PaginationIcons,
	ThemeIcons,
	PaginationOptions,
	PaginationServerOptions,
	SortFunction,
	Selector,
	FilterType,
	FilterOperator,
	FilterCondition,
	FilterState,
	CellEditor,
	CellEditCallback,
} from './types';

export { emptyFilterState, isFilterActive } from './hooks/useColumnFilter';

export default DataTable;
