import DataTable from './components/DataTable';

export { defaultThemes, createTheme } from './themes';
export * from './constants';
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
