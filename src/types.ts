import { Alignment, Direction, Media } from './constants';

export type CSSObject = React.CSSProperties;

// ── Column filter types ────────────────────────────────────────────────────────

export type FilterType = 'text' | 'number' | 'date';

export type FilterOperator =
	| 'contains'
	| 'notContains'
	| 'equals'
	| 'notEquals'
	| 'startsWith'
	| 'endsWith'
	| 'blank'
	| 'notBlank'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'between'
	| 'before'
	| 'after';

export type FilterCondition = {
	operator: FilterOperator;
	value?: string;
	/** Second value — only used when operator is "between". */
	value2?: string;
};

export type FilterState = {
	condition1: FilterCondition;
	condition2?: FilterCondition;
	/** How condition1 and condition2 combine. Defaults to "AND". */
	logic?: 'AND' | 'OR';
};

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
	direction?: Direction;
	paginationRowsPerPageOptions?: number[];
	paginationIcons?: PaginationIcons;
	paginationComponentOptions?: PaginationOptions;
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
	selectableRowsComponent?: 'input' | React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
	selectableRowsComponentProps?: ComponentProps;
	selectableRowSelected?: RowState<T>;
	selectableRowsHighlight?: boolean;
	selectableRowsNoSelectAll?: boolean;
	selectableRowsVisibleOnly?: boolean;
	selectableRowsSingle?: boolean;
};

export interface PaginationIcons {
	first?: React.ReactNode;
	last?: React.ReactNode;
	next?: React.ReactNode;
	previous?: React.ReactNode;
}

type PaginationProps = {
	onChangePage?: PaginationChangePage;
	onChangeRowsPerPage?: PaginationChangeRowsPerPage;
	pagination?: boolean;
	paginationComponent?: PaginationComponent;
	paginationComponentOptions?: PaginationOptions;
	paginationDefaultPage?: number;
	/**
	 * @deprecated Pass via the theme instead: `createTheme('t', { icons: { pagination: { next: <Icon /> } } })`
	 */
	paginationIcons?: PaginationIcons;
	paginationPerPage?: number;
	paginationResetDefaultPage?: boolean;
	paginationRowsPerPageOptions?: number[];
	paginationServer?: boolean;
	paginationServerOptions?: PaginationServerOptions;
	paginationTotalRows?: number;
};

type ExpandableProps<T> = {
	/**
	 * @deprecated Pass via the theme instead: `createTheme('t', { icons: { expandable: { collapsed: <Icon /> } } })`
	 */
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
	/**
	 * @deprecated Pass via the theme instead: `createTheme('t', { icons: { sort: <Icon /> } })`
	 */
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
	keyField?: keyof T & string;
	noDataComponent?: React.ReactNode;
	noHeader?: boolean;
	noTableHead?: boolean;
	onRowClicked?: (row: T, e: React.MouseEvent) => void;
	onRowDoubleClicked?: (row: T, e: React.MouseEvent) => void;
	onRowMiddleClicked?: (row: T, e: React.MouseEvent) => void;
	onRowMouseEnter?: (row: T, e: React.MouseEvent) => void;
	onRowMouseLeave?: (row: T, e: React.MouseEvent) => void;
	/** Enable drag-to-resize handles on column headers */
	resizable?: boolean;
	/** Animate rows on mount and expander rows on expand (respects prefers-reduced-motion) */
	animateRows?: boolean;
	/**
	 * Draw a vertical separator between body row columns.
	 * - `true` / `"subtle"`: inset 60%-height line.
	 * - `"full"`: full-height line using the theme divider color.
	 * - `false` / omitted: no body separators.
	 */
	columnSeparator?: boolean | 'subtle' | 'full';
	/**
	 * Draw a vertical separator between column header cells.
	 * Defaults to `true` (subtle inset line). Set to `false` to remove,
	 * or `"full"` for a full-height line.
	 * - `true` / `"subtle"` / omitted: inset 60%-height line (default).
	 * - `"full"`: full-height line using the theme divider color.
	 * - `false`: no header separators.
	 */
	headerSeparator?: boolean | 'subtle' | 'full';
	/** Column group definitions — renders a spanning header row above the column header row */
	columnGroups?: ColumnGroup[];
	/**
	 * Controlled filter values per column id. When provided, DataTable uses these values
	 * and calls onFilterChange when the user applies a filter. Omit to use internal filter state.
	 */
	filterValues?: Record<string | number, FilterState>;
	/** Called when the user clicks Apply in a column filter popup. */
	onFilterChange?: (columnId: string | number, filter: FilterState) => void;
	onColumnOrderChange?: (nextOrder: TableColumn<T>[]) => void;
	/** Called after a group drag reorder with the new group order and matching column order. */
	onColumnGroupOrderChange?: (nextGroups: ColumnGroup[], nextColumns: TableColumn<T>[]) => void;
	persistTableHead?: boolean;
	pointerOnHover?: boolean;
	progressComponent?: React.ReactNode;
	progressPending?: boolean;
	responsive?: boolean;
	striped?: boolean;
	style?: CSSObject;
	/** Content rendered in the sub-header bar. Providing any value shows the bar. */
	subHeader?: React.ReactNode;
	subHeaderAlign?: Alignment;
	subHeaderWrap?: boolean;
	theme?: ThemeProp;
	/** 'light' | 'dark' | 'system'. When 'system', the table auto-detects from prefers-color-scheme and the html.dark class. Default: 'light'. */
	colorMode?: ColorMode;
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
	/** Enable the built-in filter popup for this column. */
	filterable?: boolean;
	/** Filter input type. Determines the available operators and input widget. Defaults to "text". */
	filterType?: FilterType;
	style?: CSSObject;
	width?: string;
	wrap?: boolean;
	/** Freeze this column to the left or right edge on horizontal scroll. */
	pinned?: 'left' | 'right';
	/** Allow clicking the cell to edit its value inline. Calls onCellEdit on commit. */
	editable?: boolean;
};

export type CellEditCallback<T> = (row: T, value: string, column: TableColumn<T>) => void;

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
	/** Custom filter function — overrides built-in operator logic. Receives the full FilterState so both conditions are available. */
	filterFunction?: (row: T, filter: FilterState) => boolean;
	/** Called when the user commits an inline edit (blur or Enter). Only fires when editable: true. */
	onCellEdit?: CellEditCallback<T>;
}

/** A column group renders as a spanning header row above the regular header row. */
export interface ColumnGroup {
	/** Display name for this group header */
	name: string | React.ReactNode;
	/** The column ids that fall under this group */
	columnIds: (string | number)[];
	/** Horizontal alignment of the group label. Defaults to 'center'. */
	align?: 'left' | 'center' | 'right';
	/** Enable drag-to-reorder for this group. Dragging moves all member columns as a block. */
	reorder?: boolean;
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

export interface ThemeIcons {
	/** Replaces the built-in CSS-arrow sort indicator on sortable columns. */
	sort?: React.ReactNode;
	/** Replaces the built-in expand/collapse chevrons on expandable rows. */
	expandable?: Partial<ExpandableIcon>;
	/** Replaces individual built-in pagination navigation icons. */
	pagination?: Partial<PaginationIcons>;
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
	/** True when currentPage was reset to 1 as a side-effect of SORT_CHANGE.
	 * Used to suppress the onChangePage callback so only onSort fires. */
	sortTriggeredPageReset: boolean;
};

// Theming
type ThemeText = {
	primary: string;
	secondary: string;
	disabled: string;
};

type ThemeBackground = {
	default: string;
	/** Optional separate background for column header rows. Falls back to `default`. */
	header?: string;
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

type ThemeSpacing = {
	/** Height of body rows. Maps to --rdt-row-height. */
	rowHeight?: string;
	/** Height of the header row. Maps to --rdt-header-height. */
	headerHeight?: string;
	/** Horizontal cell padding. Maps to --rdt-cell-padding-x. */
	cellPaddingX?: string;
	/** Size of pagination nav icons. Maps to --rdt-icon-size. */
	iconSize?: string;
};

type ThemeTypography = {
	/** Body cell font size. Maps to --rdt-font-size. */
	fontSize?: string;
	/** Header cell font size. Maps to --rdt-font-size-header. */
	fontSizeHeader?: string;
	/** Font family for the whole table. Maps to --rdt-font-family. */
	fontFamily?: string;
};

type ThemeShape = {
	/** Border radius used for interactive elements (filter panel, resize handle, etc.). Maps to --rdt-border-radius. */
	borderRadius?: string;
};

export type Themes = string;
export type ThemeProp = string | Partial<Theme> | Record<string, string>;

/** Which color palette the table uses. 'system' auto-detects from prefers-color-scheme and html.dark. */
export type ColorMode = 'light' | 'dark' | 'system';

/** Color-only overrides applied when the resolved color mode is dark. */
export type DarkModeColors = {
	primary?: string;
	text?: Partial<ThemeText>;
	background?: Partial<ThemeBackground>;
	context?: Partial<ThemeContext>;
	divider?: Partial<ThemeDivider>;
	button?: Partial<ThemeButton>;
	selected?: Partial<ThemeSelected>;
	highlightOnHover?: Partial<ThemeHighlightOnHover>;
	striped?: Partial<ThemeStriped>;
};

export interface Theme {
	primary?: string;
	text: ThemeText;
	background: ThemeBackground;
	context: ThemeContext;
	divider: ThemeDivider;
	button: ThemeButton;
	selected: ThemeSelected;
	highlightOnHover: ThemeHighlightOnHover;
	striped: ThemeStriped;
	/** Sets CSS color-scheme so native form controls render correctly in the active mode. */
	colorScheme?: 'light' | 'dark';
	/** Dark-mode color overrides. Used automatically when colorMode resolves to 'dark'. */
	darkMode?: DarkModeColors;
	/** Controls row/header height and cell padding. */
	spacing?: ThemeSpacing;
	/** Controls font size and family. */
	typography?: ThemeTypography;
	/** Controls border radius on interactive elements. */
	shape?: ThemeShape;
	/** Icon overrides — replaces built-in sort, expand, and pagination icons. */
	icons?: ThemeIcons;
	/** Checkbox appearance — controls the CSS variables for the built-in CSS checkbox. */
	checkbox?: { size?: string; borderRadius?: string };
	/**
	 * Default header column separator behaviour for this theme.
	 * The `headerSeparator` prop overrides this when explicitly passed.
	 * Omitting both falls back to `'subtle'`.
	 */
	headerSeparator?: boolean | 'subtle' | 'full';
	/**
	 * Default body column separator behaviour for this theme.
	 * The `columnSeparator` prop overrides this when explicitly passed.
	 * Omitting both falls back to `false` (no separator).
	 */
	columnSeparator?: boolean | 'subtle' | 'full';
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

export type Action<T> =
	| AllRowsAction<T>
	| SingleRowAction<T>
	| MultiRowAction<T>
	| SortAction<T>
	| PaginationPageAction
	| PaginationRowsPerPageAction
	| ClearSelectedRowsAction;
