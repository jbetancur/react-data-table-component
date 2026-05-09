import DataTable from './components/DataTable';

export { defaultThemes, createTheme } from './themes';
export { DEFAULT_PAGINATION_ICONS, DEFAULT_EXPANDABLE_ICON } from './defaultProps';
export * from './constants';

// Headless hooks — compose these yourself if you want to bring your own markup/styles
export { default as useTableState } from './hooks/useTableState';
export { default as useColumns } from './hooks/useColumns';
export { default as useTableData } from './hooks/useTableData';
export { default as useColumnFilter } from './hooks/useColumnFilter';

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
	ConditionalStyles,
	ExpanderComponentProps,
	PaginationComponentProps,
	PaginationIcons,
	PaginationOptions,
	PaginationServerOptions,
	SortOrder,
	SortFunction,
	Selector,
} from './types';

export default DataTable;
