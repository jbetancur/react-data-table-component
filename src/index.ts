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

export { emptyFilterState, isFilterActive } from './hooks/useColumnFilter';

export default DataTable;
