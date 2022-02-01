import DataTable from './DataTable/DataTable';

export { defaultThemes, createTheme } from './DataTable/themes';
export * from './DataTable/constants';
export type {
	TableProps,
	TableProps as IDataTableProps, // this is for backwards compat with v6
	TableColumn,
	TableRow,
	TableStyles,
	Theme,
	Themes,
	ConditionalStyles,
	ExpanderComponentProps,
	PaginationComponentProps,
	PaginationOptions,
	PaginationServerOptions,
	ContextMessage,
	SortOrder,
	SortFunction,
	Selector,
} from './DataTable/types';

export default DataTable;
