import DataTable from './components/DataTable';

export { defaultThemes, createTheme } from './themes';
export * from './constants';

// Headless hooks — compose these yourself if you want to bring your own markup/styles
export { default as useTableState } from './hooks/useTableState';
export { default as useColumns } from './hooks/useColumns';
export { default as useTableData } from './hooks/useTableData';
export { default as useColumnFilter } from './hooks/useColumnFilter';

export type {
	TableProps,
	TableProps as IDataTableProps, // this is for backwards compat with v6
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
	PaginationOptions,
	PaginationServerOptions,
	SortOrder,
	SortFunction,
	Selector,
} from './types';

export default DataTable;
