import { Alignment, Direction, Media } from './constants';
import { CSSObject } from 'styled-components';

export type ChangePage = (page: number, totalRows: number) => void;
export type ChangeRowsPerPage = (currentRowsPerPage: number, currentPage: number) => void;
export type ColumnSortFunction<T> = (a: T, b: T) => number;
export type DefaultSortField = string | number | null | undefined;
export type ExpandRowToggled<T> = (expanded: boolean, row: T) => void;
export type Format<T> = (row: T, rowIndex: number) => React.ReactNode;
export type RowState<T> = ((row: T) => boolean) | null;
export type Selector<T> = string | ((row: T, rowIndex: number) => React.ReactNode);
export type SortDirection = 'asc' | 'desc';
export type SortFunction<T> = (rows: T[], field: Selector<T>, sortDirection: 'asc' | 'desc') => T[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RowRecord = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExpandableRowsComponent = React.ComponentType<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationComponent = React.ComponentType<any>;
export type ComponentProps = Record<string, unknown>;

export type TableProps<T = RowRecord> = {
	actions?: React.ReactNode | React.ReactNode[];
	className?: string;
	clearSelectedRows?: boolean;
	columns: TableColumn<T>[];
	conditionalRowStyles?: ConditionalStyles<T>[];
	contextActions?: React.ReactNode | React.ReactNode[];
	contextComponent?: React.ReactNode;
	contextMessage?: ContextMessage;
	customStyles?: TableStyles;
	data: T[];
	defaultSortAsc?: boolean;
	defaultSortFieldId?: DefaultSortField;
	dense?: boolean;
	direction?: Direction;
	disabled?: boolean;
	expandableIcon?: ExpandableIcon;
	expandableInheritConditionalStyles?: boolean;
	expandableRowDisabled?: RowState<T>;
	expandableRowExpanded?: RowState<T>;
	expandableRows?: boolean;
	expandableRowsComponent?: ExpandableRowsComponent;
	expandableRowsComponentProps?: ComponentProps;
	expandableRowsHideExpander?: boolean;
	expandOnRowClicked?: boolean;
	expandOnRowDoubleClicked?: boolean;
	fixedHeader?: boolean;
	fixedHeaderScrollHeight?: string;
	highlightOnHover?: boolean;
	keyField?: string;
	noContextMenu?: boolean;
	noDataComponent?: React.ReactNode;
	noHeader?: boolean;
	noTableHead?: boolean;
	offset?: string;
	onChangePage?: ChangePage;
	onChangeRowsPerPage?: ChangeRowsPerPage;
	onRowClicked?: (row: T, e: React.MouseEvent) => void;
	onRowDoubleClicked?: (row: T, e: React.MouseEvent) => void;
	onRowExpandToggled?: ExpandRowToggled<T>;
	onSelectedRowsChange?: (selected: { allSelected: boolean; selectedCount: number; selectedRows: T[] }) => void;
	onSort?: (column: TableColumn<T>, sortDirection: 'asc' | 'desc') => void;
	overflowY?: boolean;
	overflowYOffset?: string;
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
	persistTableHead?: boolean;
	pointerOnHover?: boolean;
	progressComponent?: React.ReactNode;
	progressPending?: boolean;
	responsive?: boolean;
	selectableRowDisabled?: RowState<T>;
	selectableRows?: boolean;
	selectableRowsComponent?: 'input' | React.ReactNode;
	selectableRowsComponentProps?: ComponentProps;
	selectableRowSelected?: RowState<T>;
	selectableRowsHighlight?: boolean;
	selectableRowsNoSelectAll?: boolean;
	selectableRowsVisibleOnly?: boolean;
	selectableRowsSingle?: boolean;
	sortFunction?: SortFunction<T> | null;
	sortIcon?: React.ReactNode;
	sortServer?: boolean;
	striped?: boolean;
	style?: CSSObject;
	subHeader?: React.ReactNode | React.ReactNode[];
	subHeaderAlign?: Alignment;
	subHeaderComponent?: React.ReactNode | React.ReactNode[];
	subHeaderWrap?: boolean;
	theme?: Themes;
	/**
	 *  Shows and displays a header with a title
	 *  */
	title?: string | React.ReactNode;
};

export interface TableColumnBase {
	allowOverflow?: boolean;
	button?: boolean;
	center?: boolean;
	compact?: boolean;
	grow?: number;
	hide?: number | ((value: number) => CSSObject) | Media;
	id?: string | number;
	ignoreRowClick?: boolean;
	maxWidth?: string;
	minWidth?: string;
	name?: string | number | React.ReactNode;
	omit?: boolean;
	right?: boolean;
	sortable?: boolean;
	style?: CSSObject;
	width?: string;
	wrap?: boolean;
}

export interface TableColumn<T = RowRecord> extends TableColumnBase {
	name: string | number | React.ReactNode;
	cell?: (row: T, rowIndex: number, column: TableColumn<T>, id: string | number) => React.ReactNode;
	conditionalCellStyles?: ConditionalStyles<T>[];
	format?: Format<T> | undefined;
	selector?: Selector<T>;
	sortFunction?: ColumnSortFunction<T>;
}

export interface ConditionalStyles<T = RowRecord> {
	when: (row: T) => boolean;
	style?: CSSObject | ((row: T) => CSSObject);
}

export interface TableStyles {
	table?: {
		style: CSSObject;
	};
	tableWrapper?: {
		style: CSSObject;
	};
	header?: {
		style: CSSObject;
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
		activeSortStyle?: CSSObject;
		inactiveSortStyle?: CSSObject;
	};
	contextMenu?: {
		style?: CSSObject;
		activeStyle?: CSSObject;
	};
	cells?: {
		style: CSSObject;
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

export interface ContextMessage {
	singular: string;
	plural: string;
	message?: string;
}

export type TableState<T> = {
	allSelected: boolean;
	contextMessage: ContextMessage;
	rows: T[];
	selectedCount: number;
	selectedRows: T[];
	selectedColumn: TableColumn<T>;
	sortDirection: SortDirection;
	currentPage: number;
	rowsPerPage: number;
	selectedRowsFlag: boolean;
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

type ThemeSortFocus = {
	default: string;
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

export interface ThemeCustom {
	text?: ThemeText;
	background?: ThemeBackground;
	context?: ThemeContext;
	divider?: ThemeDivider;
	button?: ThemeButton;
	sortFocus?: ThemeSortFocus;
	selected?: ThemeSelected;
	highlightOnHover?: ThemeHighlightOnHover;
	striped?: ThemeStriped;
}

export type Themes = 'default' | 'dark' | string | undefined;

export interface Theme {
	text: ThemeText;
	background: ThemeBackground;
	context: ThemeContext;
	divider: ThemeDivider;
	button: ThemeButton;
	sortFocus: ThemeSortFocus;
	selected: ThemeSelected;
	highlightOnHover: ThemeHighlightOnHover;
	striped: ThemeStriped;
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
	rows: T[];
	mergeSelections: boolean;
}

export interface SortAction<T> {
	type: 'SORT_CHANGE';
	rows: T[];
	sortDirection: SortDirection;
	sortServer: boolean;
	selectedColumn: TableColumn<T>;
	pagination: boolean;
	paginationServer: boolean;
	visibleOnly: boolean;
	persistSelectedOnSort: boolean;
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

export interface RowsAction<T> {
	type: 'UPDATE_ROWS';
	rows: T[];
}

export type Action<T> =
	| AllRowsAction<T>
	| SingleRowAction<T>
	| MultiRowAction<T>
	| SortAction<T>
	| PaginationPageAction
	| PaginationRowsPerPageAction
	| ClearSelectedRowsAction
	| RowsAction<T>
	| { type: '' };
