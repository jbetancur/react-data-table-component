import DataTable from './components/DataTable';

export { defaultThemes, createTheme } from './themes';
export { DEFAULT_PAGINATION_ICONS, DEFAULT_EXPANDABLE_ICON } from './defaultProps';
export * from './constants';

// Headless hooks, pinning helpers, and their types — compose these yourself if you want
// to bring your own markup/styles. Also published on their own, without the component
// or its stylesheet, as `react-data-table-component/headless`.
export * from './headless';

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
	Localization,
	/** @deprecated Use `Localization['filter']` instead. Will be removed in v9. */
	ColumnFilterOptions,
	/** @deprecated Use `Localization['expandable']` instead. Will be removed in v9. */
	ExpandableRowsOptions,
	SortFunction,
	SortColumn,
	Selector,
	FilterType,
	FilterOperator,
	FilterCondition,
	FilterState,
	SetFilterOptions,
	CellEditor,
	CellEditCallback,
	CellValidateResult,
	CustomCellEditorContext,
	ContextMenuAction,
	ContextMenuActionContext,
	ContextMenuActions,
	ContextMenuConfig,
	ContextMenuTrigger,
	ContextMenuPosition,
	ColumnFooter,
	FooterComponent,
	FooterComponentProps,
} from './types';

export default DataTable;
