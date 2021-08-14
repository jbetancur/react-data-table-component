import * as React from 'react';
import { CSSProperties } from 'styled-components';

export interface IDataTableConditionalCellStyles<T = any> {
  when: (row: T) => boolean;
  style: CSSProperties;
}

export interface IDataTableColumn<T = any> {
  id?: string | number;
  name?: string | number | React.ReactNode;
  selector?: string | ((row: T, rowIndex: number) => React.ReactNode);
  sortable?: boolean;
  sortFunction?: (a: T, b: T) => number;
  format?: (row: T, rowIndex: number) => React.ReactNode;
  cell?: (row: T, rowIndex: number, column: IDataTableColumn, id: string | number) => React.ReactNode;
  grow?: number;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  right?: boolean;
  center?: boolean;
  compact?: boolean;
  ignoreRowClick?: boolean;
  button?: boolean;
  wrap?: boolean;
  allowOverflow?: boolean;
  hide?: number | 'sm' | 'md' | 'lg';
  omit?: boolean;
  style?: CSSProperties;
  conditionalCellStyles?: IDataTableConditionalCellStyles<T>[];
}

export interface IDataTableStyles {
  table?: {
    style: CSSProperties;
  };
  tableWrapper?: {
    style: CSSProperties;
  };
  header?: {
    style: CSSProperties;
  };
  subHeader?: {
    style: CSSProperties;
  };
  head?: {
    style: CSSProperties;
  };
  headRow?: {
    style?: CSSProperties;
    denseStyle?: CSSProperties;
  };
  headCells?: {
    style?: CSSProperties;
    activeSortStyle?: CSSProperties;
    inactiveSortStyle?: CSSProperties;
  };
  contextMenu?: {
    style?: CSSProperties;
    activeStyle?: CSSProperties;
  };
  cells?: {
    style: CSSProperties;
  };
  rows?: {
    style?: CSSProperties;
    selectedHighlightStyle?: CSSProperties;
    denseStyle?: CSSProperties;
    highlightOnHoverStyle?: CSSProperties;
    stripedStyle?: CSSProperties;
  };
  expanderRow?: {
    style: CSSProperties;
  };
  expanderCell?: {
    style: CSSProperties;
  };
  expanderButton?: {
    style: CSSProperties;
  };
  pagination?: {
    style?: CSSProperties;
    pageButtonsStyle?: CSSProperties;
  };
  noData?: {
    style: CSSProperties;
  };
  progress?: {
    style: CSSProperties;
  };
}

export interface IDataTableConditionalRowStyles<T = any> {
  when: (row: T) => boolean;
  style: CSSProperties;
}

export interface IDataTablePaginationOptions {
  noRowsPerPage?: boolean;
  rowsPerPageText?: string;
  rangeSeparatorText?: string;
  selectAllRowsItem?: boolean;
  selectAllRowsItemText?: string;
}

export interface IExpandableIcon {
  collapsed: React.ReactNode;
  expanded: React.ReactNode;
}

export interface IContextMessage {
  singular: string;
  plural: string;
  message: string;
}

export interface IDataTableProps<T = any> {
  title?: React.ReactNode;
  columns: IDataTableColumn<T>[];
  data: T[];
  keyField?: string;
  striped?: boolean;
  highlightOnHover?: boolean;
  pointerOnHover?: boolean;
  noDataComponent?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  responsive?: boolean;
  disabled?: boolean;
  onRowClicked?: (row: T, e: MouseEvent) => void;
  onRowDoubleClicked?: (row: T, e: MouseEvent) => void;
  overflowY?: boolean;
  overflowYOffset?: string;
  dense?: boolean;
  noTableHead?: boolean;
  defaultSortField?: string;
  defaultSortAsc?: boolean;
  sortIcon?: React.ReactNode;
  onSort?: (
    column: IDataTableColumn<T>,
    sortDirection: 'asc' | 'desc'
  ) => void;
  sortFunction?: (
    rows: T[],
    field: string,
    sortDirection: 'asc' | 'desc'
  ) => T[];
  sortServer?: boolean;
  pagination?: boolean;
  paginationServer?: boolean;
  paginationServerOptions?: {
    persistSelectedOnSort?: boolean;
    persistSelectedOnPageChange?: boolean;
  };
  paginationDefaultPage?: number;
  paginationResetDefaultPage?: boolean;
  paginationTotalRows?: number;
  paginationPerPage?: number;
  paginationRowsPerPageOptions?: number[];
  paginationComponentOptions?: IDataTablePaginationOptions;
  onChangeRowsPerPage?: (
    currentRowsPerPage: number,
    currentPage: number
  ) => void;
  onChangePage?: (page: number, totalRows: number) => void;
  paginationComponent?: React.ReactNode;
  paginationIconFirstPage?: React.ReactNode;
  paginationIconLastPage?: React.ReactNode;
  paginationIconNext?: React.ReactNode;
  paginationIconPrevious?: React.ReactNode;
  progressPending?: boolean;
  persistTableHead?: boolean;
  progressComponent?: React.ReactNode;
  expandableRows?: boolean;
  expandableRowsComponent?: React.ReactNode;
  expandOnRowClicked?: boolean;
  expandOnRowDoubleClicked?: boolean;
  expandableRowsHideExpander?: boolean;
  onRowExpandToggled?: (expanded: boolean, row: T) => void;
  expandableRowExpanded?: (row: T) => boolean;
  expandableRowDisabled?: (row: T) => boolean;
  expandableIcon?: IExpandableIcon;
  expandableInheritConditionalStyles?: boolean;
  selectableRows?: boolean;
  selectableRowsComponent?: React.ReactNode;
  selectableRowsComponentProps?: any;
  selectableRowsHighlight?: boolean;
  selectableRowsVisibleOnly?: boolean;
  selectableRowSelected?: (row: T) => boolean;
  selectableRowDisabled?: (row: T) => boolean;
  selectableRowsNoSelectAll?: boolean;
  clearSelectedRows?: boolean;
  onSelectedRowsChange?: (selectedRowState: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: T[];
  }) => void;
  actions?: React.ReactNode | React.ReactNode[];
  noContextMenu?: boolean;
  contextMessage?: IContextMessage;
  contextActions?: React.ReactNode | React.ReactNode[];
  contextComponent?: React.ReactNode;
  noHeader?: boolean;
  fixedHeader?: boolean;
  fixedHeaderScrollHeight?: string;
  subHeader?: React.ReactNode | React.ReactNode[];
  subHeaderAlign?: string;
  subHeaderWrap?: boolean;
  subHeaderComponent?: React.ReactNode | React.ReactNode[];
  customStyles?: IDataTableStyles;
  theme?: string;
  conditionalRowStyles?: IDataTableConditionalRowStyles<T>[];
  direction?: 'ltr' | 'rtl' | 'auto';
}

export interface ITheme {
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  background: {
    default: string;
  };
  context: {
    background: string;
    text: string;
  };
  divider: {
    default: string;
  };
  button: {
    default: string;
    focus: string;
    hover: string;
    disabled: string;
  };
  sortFocus: {
    default: string;
  };
  selected: {
    default: string;
    text: string;
  };
  highlightOnHover: {
    default: string;
    text: string;
  };
  striped: {
    default: string;
    text: string;
  };
}

interface IDefaultThemes {
  default: ITheme;
  dark: ITheme;
}

export function createTheme<T = any>(name: string, customTheme: T): ITheme;
export const defaultThemes: IDefaultThemes;

export default function DataTable<T = any>(
  props: IDataTableProps<T>
): React.ReactElement;
