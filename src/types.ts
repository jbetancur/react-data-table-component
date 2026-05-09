import { Alignment, Direction, Media } from './constants';

export type CSSObject = React.CSSProperties;

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export type Primitive = string | number | boolean;
export type ColumnSortFunction<T> = (a: T, b: T) => number;
export type ExpandRowToggled<T> = (expanded: boolean, row: T) => void;
export type Format<T> = (row: T, rowIndex: number) => React.ReactNode;
export type RowState<T> = ((row: T) => boolean) | null;
export type Selector<T> = (row: T, rowIndex?: number) => Primitive;
export type SortFunction<T> = (rows: T[], field: Selector<T>, sortDirection: SortOrder) => T[];
export type TableRow = Record<string, unknown>;
export type ComponentProps = Record<string, unknown>;
export type ExpanderComponentProps<T> = { data: T };
export type ExpandableRowsComponent<T> = React.ComponentType<ExpanderComponentProps<T>>;
export type PaginationChangePage = (page: number, totalRows: number) => void;
export type PaginationChangeRowsPerPage = (currentRowsPerPage: number, currentPage: number) => void;
export type PaginationComponentProps = {
	rowsPerPage: number;
	rowCount: number;
	currentPage: number;
	onChangePage: PaginationChangePage;
	onChangeRowsPerPage: PaginationChangeRowsPerPage;
};
export type PaginationComponent = React.ComponentType<PaginationComponentProps>;

export type DataTableHandle = {
	clearSelectedRows: () => void;
};

// ── Feature-group prop types ──────────────────────────────────────────────────

type SelectionProps<T> = {
	/** @deprecated Use a ref with DataTableHandle instead: ref.current.clearSelectedRows() */
	clearSelectedRows?: boolean;
	onSelectedRowsChange?: (selected: { allSelected: boolean; selectedCount: number; selectedRows: T[] }) => void;
	selectableRowDisabled?: RowState<T>;
	selectableRows?: boolean;
	selectableRowsComponent?: 'input' | React.ReactNode;
	selectableRowsComponentProps?: ComponentProps;
	selectableRowSelected?: RowState<T>;
	selectableRowsHighlight?: boolean;
	selectableRowsNoSelectAll?: boolean;
	selectableRowsVisibleOnly?: boolean;
	selectableRowsSingle?: boolean;
};

type PaginationProps = {
	onChangePage?: PaginationChangePage;
	onChangeRowsPerPage?: PaginationChangeRowsPerPage;
	pagination?: boolean;
	paginationComponent?: PaginationComponent;
	paginationComponentOptions?: PaginationOptions;
	paginationDefaultPage?: number;
	paginationIconFirstPage?: React.ReactNode;
	paginationIconLastPage?: React.ReactNode;
	paginationIconNext?: React.ReactNode;
	paginationIconPrevious?: React.ReactNode;
	paginationPerPage?: number;
	paginationResetDefaultPage?: boolean;
	paginationRowsPerPageOptions?: number[];
	paginationServer?: boolean;
	paginationServerOptions?: PaginationServerOptions;
	paginationTotalRows?: number;
};

type ExpandableProps<T> = {
	expandableIcon?: ExpandableIcon;
	expandableInheritConditionalStyles?: boolean;
	expandableRowDisabled?: RowState<T>;
	expandableRowExpanded?: RowState<T>;
	expandableRows?: boolean;
	expandableRowsComponent?: ExpandableRowsComponent<T>;
	expandableRowsComponentProps?: ComponentProps;
	expandableRowsHideExpander?: boolean;
	expandOnRowClicked?: boolean;
	expandOnRowDoubleClicked?: boolean;
	onRowExpandToggled?: ExpandRowToggled<T>;
};

type SortProps<T> = {
	defaultSortAsc?: boolean;
	defaultSortFieldId?: string | number | null | undefined;
	onSort?: (selectedColumn: TableColumn<T>, sortDirection: SortOrder, sortedRows: T[]) => void;
	sortFunction?: SortFunction<T> | null;
	sortIcon?: React.ReactNode;
	sortServer?: boolean;
};

type BaseTableProps<T> = {
	actions?: React.ReactNode | React.ReactNode[];
	ariaLabel?: string;
	className?: string;
	columns: TableColumn<T>[];
	conditionalRowStyles?: ConditionalStyles<T>[];
	customStyles?: TableStyles;
	data: T[];
	dense?: boolean;
	direction?: Direction;
	disabled?: boolean;
	fixedHeader?: boolean;
	fixedHeaderScrollHeight?: string;
	highlightOnHover?: boolean;
	keyField?: string;
	noDataComponent?: React.ReactNode;
	noHeader?: boolean;
	noTableHead?: boolean;
	onRowClicked?: (row: T, e: React.MouseEvent) => void;
	onRowDoubleClicked?: (row: T, e: React.MouseEvent) => void;
	onRowMouseEnter?: (row: T, e: React.MouseEvent) => void;
	onRowMouseLeave?: (row: T, e: React.MouseEvent) => void;
	/** Enable drag-to-resize handles on column headers */
	resizable?: boolean;
	/** Animate rows on mount and expander rows on expand (respects prefers-reduced-motion) */
	animateRows?: boolean;
	/**
	 * Draw a vertical separator between body row columns.
	 * Headers always show separators by default.
	 * - `true` / `"subtle"` — inset 60%-height line
	 * - `"full"` — full-height line using the theme divider color
	 * - `false` / omitted — no body separators
	 */
	columnSeparator?: boolean | 'subtle' | 'full';
	/** Column group definitions — renders a spanning header row above the column header row */
	columnGroups?: ColumnGroup[];
	/**
	 * Controlled filter values per column id. When provided, DataTable uses these values
	 * and calls onFilterChange when the user edits a filter. Omit to use internal filter state.
	 */
	filterValues?: Record<string | number, string>;
	/** Called when a column filter input changes */
	onFilterChange?: (columnId: string | number, value: string) => void;
	onColumnOrderChange?: (nextOrder: TableColumn<T>[]) => void;
	persistTableHead?: boolean;
	pointerOnHover?: boolean;
	progressComponent?: React.ReactNode;
	progressPending?: boolean;
	responsive?: boolean;
	striped?: boolean;
	style?: CSSObject;
	subHeader?: React.ReactNode | React.ReactNode[];
	subHeaderAlign?: Alignment;
	subHeaderComponent?: React.ReactNode | React.ReactNode[];
	subHeaderWrap?: boolean;
	theme?: ThemeProp;
	/**
	 *  Shows and displays a header with a title
	 *  */
	title?: string | React.ReactNode;
};

export type TableProps<T> = BaseTableProps<T> & SelectionProps<T> & PaginationProps & ExpandableProps<T> & SortProps<T>;

export type TableColumnBase = {
	allowOverflow?: boolean;
	button?: boolean;
	center?: boolean;
	compact?: boolean;
	reorder?: boolean;
	grow?: number;
	hide?: number | Media;
	id?: string | number;
	ignoreRowClick?: boolean;
	maxWidth?: string;
	minWidth?: string;
	name?: string | number | React.ReactNode;
	omit?: boolean;
	right?: boolean;
	sortable?: boolean;
	/** Enable built-in text filter for this column */
	filterable?: boolean;
	style?: CSSObject;
	width?: string;
	wrap?: boolean;
};

export interface TableColumn<T> extends TableColumnBase {
	name?: string | number | React.ReactNode;
	sortField?: string;
	cell?: (row: T, rowIndex: number, column: TableColumn<T>, id: string | number) => React.ReactNode;
	conditionalCellStyles?: ConditionalStyles<T>[];
	format?: Format<T> | undefined;
	/**
	 * Extracts a value from the row for display and sorting.
	 * May return `React.ReactNode` when used for display only; if the column is sortable
	 * and no `sortFunction` is provided, the returned value should be a `Primitive`.
	 */
	selector?: (row: T, rowIndex?: number) => Primitive | React.ReactNode;
	sortFunction?: ColumnSortFunction<T>;
	/** Custom filter function — defaults to case-insensitive string match on selector value */
	filterFunction?: (row: T, filterValue: string) => boolean;
}

/** A column group renders as a spanning header row above the regular header row. */
export interface ColumnGroup {
	/** Display name for this group header */
	name: string | React.ReactNode;
	/** The column ids that fall under this group */
	columnIds: (string | number)[];
	/** Horizontal alignment of the group label. Defaults to 'center'. */
	align?: 'left' | 'center' | 'right';
}

export interface ConditionalStyles<T> {
	when: (row: T) => boolean;
	style?: CSSObject | ((row: T) => CSSObject);
	classNames?: string[];
}

export interface TableStyles {
	table?: {
		style: CSSObject;
	};
	tableWrapper?: {
		style: CSSObject;
	};
	responsiveWrapper?: {
		style: CSSObject;
	};
	header?: {
		style: CSSObject;
		fontColor?: string;
		fontSize?: string;
	};
	subHeader?: {
		style: CSSObject;
	};
	head?: {
		style: CSSObject;
	};
	headRow?: {
		style?: CSSObject;
		denseStyle?: CSSObject;
	};
	headCells?: {
		style?: CSSObject;
		draggingStyle?: CSSObject;
	};
	cells?: {
		style: CSSObject;
		draggingStyle?: CSSObject;
	};
	rows?: {
		style?: CSSObject;
		selectedHighlightStyle?: CSSObject;
		denseStyle?: CSSObject;
		highlightOnHoverStyle?: CSSObject;
		stripedStyle?: CSSObject;
	};
	expanderRow?: {
		style: CSSObject;
	};
	expanderCell?: {
		style: CSSObject;
	};
	expanderButton?: {
		style: CSSObject;
	};
	pagination?: {
		style?: CSSObject;
		pageButtonsStyle?: CSSObject;
	};
	noData?: {
		style: CSSObject;
	};
	progress?: {
		style: CSSObject;
	};
}

export interface PaginationOptions {
	noRowsPerPage?: boolean;
	rowsPerPageText?: string;
	rangeSeparatorText?: string;
	selectAllRowsItem?: boolean;
	selectAllRowsItemText?: string;
}

export interface PaginationServerOptions {
	persistSelectedOnSort?: boolean;
	persistSelectedOnPageChange?: boolean;
}

export interface ExpandableIcon {
	collapsed: React.ReactNode;
	expanded: React.ReactNode;
}

export type TableState<T> = {
	allSelected: boolean;
	selectedCount: number;
	selectedRows: T[];
	selectedColumn: TableColumn<T>;
	sortDirection: SortOrder;
	currentPage: number;
	rowsPerPage: number;
	selectedRowsFlag: boolean;
	/* server-side pagination and server-side sorting will cause selectedRows to change
	 because of this behavior onSelectedRowsChange useEffect is triggered (by design it should notify if there was a change)
	 however, when using selectableRowsSingle
	*/
	toggleOnSelectedRowsChange: boolean;
};

// Theming
type ThemeText = {
	primary: string;
	secondary: string;
	disabled: string;
};

type ThemeBackground = {
	default: string;
};

type ThemeContext = {
	background: string;
	text: string;
};

type ThemeDivider = {
	default: string;
};

type ThemeButton = {
	default: string;
	focus: string;
	hover: string;
	disabled: string;
};

type ThemeSelected = {
	default: string;
	text: string;
};

type ThemeHighlightOnHover = {
	default: string;
	text: string;
};

type ThemeStriped = {
	default: string;
	text: string;
};

export type Themes = string;
export type ThemeProp = string | Partial<Theme> | Record<string, string>;

export interface Theme {
	text: ThemeText;
	background: ThemeBackground;
	context: ThemeContext;
	divider: ThemeDivider;
	button: ThemeButton;
	selected: ThemeSelected;
	highlightOnHover: ThemeHighlightOnHover;
	striped: ThemeStriped;
	/** Determines CSS color-scheme so native form controls (checkboxes) render correctly. Defaults to 'light'. */
	colorScheme?: 'light' | 'dark';
}

// Reducer Actions
export interface AllRowsAction<T> {
	type: 'SELECT_ALL_ROWS';
	keyField: string;
	rows: T[];
	rowCount: number;
	mergeSelections: boolean;
}

export interface SingleRowAction<T> {
	type: 'SELECT_SINGLE_ROW';
	keyField: string;
	row: T;
	isSelected: boolean;
	rowCount: number;
	singleSelect: boolean;
}

export interface MultiRowAction<T> {
	type: 'SELECT_MULTIPLE_ROWS';
	keyField: string;
	selectedRows: T[];
	totalRows: number;
	mergeSelections: boolean;
}

export interface SortAction<T> {
	type: 'SORT_CHANGE';
	sortDirection: SortOrder;
	selectedColumn: TableColumn<T>;
	clearSelectedOnSort: boolean;
}

export interface PaginationPageAction {
	type: 'CHANGE_PAGE';
	page: number;
	paginationServer: boolean;
	visibleOnly: boolean;
	persistSelectedOnPageChange: boolean;
}

export interface PaginationRowsPerPageAction {
	type: 'CHANGE_ROWS_PER_PAGE';
	rowsPerPage: number;
	page: number;
}

export interface ClearSelectedRowsAction {
	type: 'CLEAR_SELECTED_ROWS';
	selectedRowsFlag: boolean;
}

export interface ColumnsAction<T> {
	type: 'UPDATE_COLUMNS';
	cols: TableColumn<T>[];
}

export type Action<T> =
	| AllRowsAction<T>
	| SingleRowAction<T>
	| MultiRowAction<T>
	| SortAction<T>
	| PaginationPageAction
	| PaginationRowsPerPageAction
	| ClearSelectedRowsAction
	| ColumnsAction<T>;
