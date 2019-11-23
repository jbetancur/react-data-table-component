  import * as React from "react";
  import { CSSProperties } from "styled-components";

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
    customTheme?: IDataTableTheme;
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
      sortDirection: "asc" | "desc"
    ) => void;
    sortFunction?: (
      rows: T[],
      field: string,
      sortDirection: "asc" | "desc"
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
    defaultExpandedField?: string;
    expandableDisabledField?: string;
    selectableRows?: boolean;
    clearSelectedRows?: boolean;
    onSelectedRow?: (selectedRowState: T) => void; // Deprecated: will be removed in v5.0
    onSelectedRowsChange?: (selectedRowState: T) => void;
    actions?: React.ReactNode | React.ReactNode[];
    contextTitle?: string;
    contextActions?: React.ReactNode | React.ReactNode[];
    noHeader?: boolean;
    fixedHeader?: boolean;
    fixedHeaderScrollHeight?: string;
    subHeader?: React.ReactNode | React.ReactNode[];
    subHeaderAlign?: string;
    subHeaderWrap?: boolean;
    subHeaderComponent?: React.ReactNode | React.ReactNode[];
  }

  export interface IDataTableColumn<T> {
    name?: string;
    selector: string;
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
    hide?: number | "sm" | "md" | "lg";
    style?: CSSProperties;
    conditionalCellStyles?: IDataTableConditionalCellStyles<T>;
  }

  export interface IDataTableTheme {
    title?: {
      fontSize?: string;
      fontColor?: string;
      backgroundColor?: string;
      height?: string;
    };
    header?: {
      fontSize?: string;
      fontWeight?: string;
      fontColor?: string;
      fontColorActive?: string;
      backgroundColor?: string;
      borderWidth?: string;
      borderColor?: string;
      borderStyle?: string;
      height?: string;
      denseHeight?: string;
    };
    contextMenu?: {
      backgroundColor?: string;
      fontSize?: string;
      fontColor?: string;
      transitionTime?: string;
    };
    rows?: {
      spacing?: "default" | "spaced";
      fontSize?: string;
      fontColor?: string;
      backgroundColor?: string;
      borderStyle?: string;
      borderWidth?: string;
      borderColor?: string;
      stripedColor?: string;
      hoverFontColor?: string;
      hoverBackgroundColor?: string;
      height?: string;
      denseHeight?: string;
    };
    cells?: {
      cellPadding?: string;
    };
    expander?: {
      fontColor?: string;
      expanderColor?: string;
      expanderColorDisabled?: string;
      backgroundColor?: string;
    };
    pagination?: {
      fontSize?: string;
      fontColor?: string;
      backgroundColor?: string;
      buttonFontColor?: string;
      buttonHoverBackground?: string;
    };
    footer?: {
      separatorStyle?: string;
      separatorWidth?: string;
      separatorColor?: string;
    };
  }

  export interface IDataTableConditionalCellStyles<T> {
    when: (row: T) => boolean;
    style: CSSProperties;
  }

export interface IDataTablePaginationOptions {
    noRowsPerPage?: boolean;
    rowsPerPageText?: string;
    rangeSeparatorText?: string;
  }

  export default function DataTable<T>(
    props: IDataTableProps<T>
  ): React.ReactElement;

