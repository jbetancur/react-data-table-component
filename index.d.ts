import * as React from 'react';
import { CSSProperties } from 'styled-components';
import { createTheme, defaultThemes } from './src/DataTable/themes';

export { defaultThemes, createTheme };

export interface IDataTableProps<T> {
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
  onRowClicked?: (row: T) => void;
  onRowDoubleClicked?: (row: T) => void;
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
  onRowExpandToggled?: (expanded: boolean, row: T) => void;
  expandableRowExpanded?: (row: T) => boolean;
  expandableRowDisabled?: (row: T) => boolean;
  expandableIcon?: IExpandableIcon;
  expandableInheritConditionalStyles?: boolean;
  selectableRows?: boolean;
  selectableRowsHighlight?: boolean;
  selectableRowSelected?: (row: T) => boolean;
  selectableRowDisabled?: (row: T) => boolean;
  clearSelectedRows?: boolean;
  onSelectedRowsChange?: (selectedRowState: T) => void;
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
}

export interface IDataTableColumn<T> {
  name: string;
  selector: string | ((row: T) => React.ReactNode);
  sortable?: boolean;
  format?: (row: T) => React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  grow?: number;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  right?: boolean;
  center?: boolean;
  compact?: boolean;
  ignoreOnRowClick?: boolean;
  button?: boolean;
  wrap?: boolean;
  allowOverflow?: boolean;
  hide?: number | 'sm' | 'md' | 'lg';
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
    style: CSSProperties;
    denseStyle: CSSProperties;
  };
  headCells: {
    style: CSSProperties;
    activeStyle: CSSProperties;
  };
  contextMenu: {
    style: CSSProperties;
    activeStyle: CSSProperties;
  };
  cells?: {
    style: CSSProperties;
  };
  rows: {
    style: CSSProperties;
    selectedHighlighStyle: CSSProperties;
    denseStyle: CSSProperties;
    highlightOnHoverStyle: CSSProperties;
    stripedStyle: CSSProperties;
  };
  expanderRow?: {
    style: CSSProperties;
  };
  expanderButton?: {
    style: CSSProperties;
  };
  pagination?: {
    style: CSSProperties;
    pageButtonsStyle: CSSProperties;
  };
  noData: {
    style: CSSProperties;
  };
  progress: {
    style: CSSProperties;
  };
}

export interface IDataTableConditionalCellStyles<T> {
  when: (row: T) => boolean;
  style: CSSProperties;
}

export interface IDataTableConditionalRowStyles<T> {
  when: (row: T) => boolean;
  style: CSSProperties;
}

export interface IDataTablePaginationOptions {
  noRowsPerPage?: boolean;
  rowsPerPageText?: string;
  rangeSeparatorText?: string;
}

export interface IExpandableIcon {
  collapsed: React.ReactNode;
  expanded: React.ReactNode;
}

export interface IContextMessage<T> {
  singular: string;
  plural: string;
  message: string;
}

export interface ICreateTheme {
  createTheme?: T;
}

export interface IDefaultThemes {
  defaultThemes?: T;
}

export default function DataTable<T>(
  props: IDataTableProps<T>
): React.ReactElement;
