import React, {
  memo,
  useReducer,
  useMemo,
  useCallback,
  useEffect
} from "react";
import { ThemeProvider } from "styled-components";
import merge from "lodash/merge";
import { DataTableProvider } from "./DataTableContext";
import { tableReducer } from "./tableReducer";
import Table from "./Table";
import TableHead from "./TableHead";
import TableFooter from "./TableFooter";
import TableHeadRow from "./TableHeadRow";
import TableRow from "./TableRow";
import TableCol from "./TableCol";
import TableColCheckbox from "./TableColCheckbox";
import TableHeader from "./TableHeader";
import TableSubheader from "./TableSubheader";
import TableBody from "./TableBody";
import ResponsiveWrapper from "./ResponsiveWrapper";
import ProgressWrapper from "./ProgressWrapper";
import TableWrapper from "./TableWrapper";
import { CellBase } from "./Cell";
import NoData from "./NoData";
import NativePagination from "./Pagination";
import useDidUpdateEffect from "./useDidUpdateEffect";
import styled from 'styled-components';
import { propTypes, defaultProps } from "./propTypes";
import {
  sort,
  decorateColumns,
  getSortDirection,
  getNumberOfPages,
  recalculatePage
} from "./util";
import getDefaultTheme from "../themes/default";

let dtCount = 0;

const ScreenReaderLabelStyle = styled.span`
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 10px;
  position: absolute;
`;

const DataTable = memo(
  ({
    data,
    columns,
    title,
    actions,
    keyField,
    striped,
    highlightOnHover,
    pointerOnHover,
    dense,
    selectableRows,
    selectableRowsNoSelectAll,
    selectableRowsDisabledField,
    selectableRowsPreSelectedField,
    selectableRowsComponent,
    selectableRowsComponentProps,
    onRowSelected,
    onSelectedRowsChange,
    expandableIcon,
    onChangeRowsPerPage,
    onChangePage,
    paginationServer,
    paginationTotalRows,
    paginationDefaultPage,
    paginationResetDefaultPage,
    paginationPerPage,
    paginationRowsPerPageOptions,
    paginationIconLastPage,
    paginationIconFirstPage,
    paginationIconNext,
    paginationIconPrevious,
    paginationComponent,
    paginationComponentOptions,
    customTheme,
    className,
    style,
    responsive,
    overflowY,
    overflowYOffset,
    progressPending,
    progressComponent,
    persistTableHead,
    noDataComponent,
    disabled,
    noTableHead,
    noHeader,
    fixedHeader,
    fixedHeaderScrollHeight,
    pagination,
    subHeader,
    subHeaderAlign,
    subHeaderWrap,
    subHeaderComponent,
    contextTitle,
    contextActions,
    expandableRows,
    onRowClicked,
    onRowDoubleClicked,
    sortIcon,
    onSort,
    sortFunction,
    sortServer,
    expandableRowsComponent,
    expandableDisabledField,
    expandOnRowClicked,
    expandOnRowDoubleClicked,
    defaultExpandedField,
    defaultSortField,
    defaultSortAsc,
    clearSelectedRows,
    conditionalRowStyles,
    id
  }) => {
    const initialState = {
      allSelected: false,
      selectedCount: 0,
      selectedRows: [],
      sortColumn: defaultSortField,
      selectedColumn: {},
      sortDirection: getSortDirection(defaultSortAsc),
      currentPage: paginationDefaultPage,
      rowsPerPage: paginationPerPage,
      myId: id ? id : `data-table-${++dtCount}`
    };

    const [
      {
        myId,
        rowsPerPage,
        currentPage,
        selectedRows,
        allSelected,
        selectedCount,
        sortColumn,
        selectedColumn,
        sortDirection
      },
      dispatch
    ] = useReducer(tableReducer, initialState);

    const enabledPagination = pagination && !progressPending && data.length > 0;
    const Pagination = paginationComponent || NativePagination;
    const columnsMemo = useMemo(() => decorateColumns(columns), [columns]);
    const theme = useMemo(() => merge(getDefaultTheme(), customTheme), [
      customTheme
    ]);
    const expandableRowsComponentMemo = useMemo(() => expandableRowsComponent, [
      expandableRowsComponent
    ]);
    const handleRowClicked = useCallback((row, e) => onRowClicked(row, e), [
      onRowClicked
    ]);
    const handleRowDoubleClicked = useCallback(
      (row, e) => onRowDoubleClicked(row, e),
      [onRowDoubleClicked]
    );
    const handleChangePage = page =>
      dispatch({ type: "CHANGE_PAGE", page, paginationServer });

    useDidUpdateEffect(() => {
      /* istanbul ignore next */
      if (onRowSelected) {
        onRowSelected({ allSelected, selectedCount, selectedRows });
        // eslint-disable-next-line no-console
        console.error(
          "Warning: onRowSelected has been deprecated. Please switch to onSelectedRowsChange."
        );
      }

      onSelectedRowsChange({ allSelected, selectedCount, selectedRows });
    }, [selectedCount]);

    useDidUpdateEffect(() => {
      onChangePage(currentPage, paginationTotalRows || data.length);
    }, [currentPage]);

    useDidUpdateEffect(() => {
      onChangeRowsPerPage(rowsPerPage, currentPage);
    }, [rowsPerPage]);

    useDidUpdateEffect(() => {
      onSort(selectedColumn, sortDirection);
    }, [sortColumn, sortDirection]);

    useEffect(() => {
      dispatch({
        type: "CLEAR_SELECTED_ROWS",
        selectedRowsFlag: clearSelectedRows
      });
    }, [clearSelectedRows]);

    useDidUpdateEffect(() => {
      handleChangePage(paginationDefaultPage);
    }, [paginationDefaultPage, paginationResetDefaultPage]);

    useEffect(() => {
      // if the selectableRowsPreSelectedField is defined then attempt to set the selectedRows state when the table initially loads
      if (selectableRowsPreSelectedField) {
        const preSelectedRows = data.filter(
          row => row[selectableRowsPreSelectedField]
        );

        dispatch({
          type: "SELECT_MULTIPLE_ROWS",
          selectedRows: preSelectedRows,
          rows: data
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useDidUpdateEffect(() => {
      if (pagination && paginationServer && paginationTotalRows > 0) {
        const updatedPage = getNumberOfPages(paginationTotalRows, rowsPerPage);
        const recalculatedPage = recalculatePage(currentPage, updatedPage);
        if (currentPage !== recalculatedPage) {
          handleChangePage(recalculatedPage);
        }
      }
    }, [paginationTotalRows]);

    const sortedData = useMemo(() => {
      // server-side sorting bypasses internal sorting
      if (!sortServer) {
        return sort(data, sortColumn, sortDirection, sortFunction);
      }

      return data;
    }, [data, sortColumn, sortDirection, sortFunction, sortServer]);

    const calculatedRows = useMemo(() => {
      if (pagination && !paginationServer) {
        // when using client-side pagination we can just slice the data set
        const lastIndex = currentPage * rowsPerPage;
        const firstIndex = lastIndex - rowsPerPage;

        return sortedData.slice(firstIndex, lastIndex);
      }

      return sortedData;
    }, [currentPage, pagination, paginationServer, rowsPerPage, sortedData]);

    // recalculate the pagination and currentPage if the data length changes
    if (
      pagination &&
      !paginationServer &&
      data.length > 0 &&
      calculatedRows.length === 0
    ) {
      const updatedPage = getNumberOfPages(data.length, rowsPerPage);
      const recalculatedPage = recalculatePage(currentPage, updatedPage);

      handleChangePage(recalculatedPage);
    }

    const handleChangeRowsPerPage = newRowsPerPage => {
      const rowCount = paginationTotalRows || calculatedRows.length;
      const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
      const recalculatedPage = recalculatePage(currentPage, updatedPage);

      // update the currentPage for client-side pagination
      // server - side should be handled by onChangeRowsPerPage
      if (!paginationServer) {
        handleChangePage(recalculatedPage);
      }

      dispatch({
        type: "CHANGE_ROWS_PER_PAGE",
        page: recalculatedPage,
        rowsPerPage: newRowsPerPage
      });
    };

    const init = {
      dispatch,
      data,
      allSelected,
      selectedRows,
      selectedCount,
      sortColumn,
      sortDirection,
      keyField,
      contextTitle,
      contextActions,
      selectableRowsPreSelectedField,
      selectableRowsDisabledField,
      selectableRowsComponent,
      selectableRowsComponentProps,
      expandableIcon,
      pagination,
      paginationServer,
      paginationRowsPerPageOptions,
      paginationIconLastPage,
      paginationIconFirstPage,
      paginationIconNext,
      paginationIconPrevious,
      paginationComponentOptions
    };

    const showTableHead = () => {
      if (noTableHead) {
        return false;
      }

      if (persistTableHead) {
        return true;
      }

      return data.length > 0 && !progressPending;
    };
    let rowIndex = 0;
    let colIndex = 0;
    const extraCols = (selectableRows ? 1 : 0) + (expandableRows ? 2 : 0);
    return (
      <ThemeProvider theme={theme}>
        <DataTableProvider initialState={init}>
          <ResponsiveWrapper
            responsive={responsive}
            className={className}
            style={style}
            overflowYOffset={overflowYOffset}
            overflowY={overflowY}
          >
            {!noHeader && (
              <TableHeader
                id={`${myId}-header`}
                title={title}
                actions={actions}
                pending={progressPending}
              />
            )}

            {subHeader && (
              <TableSubheader
                id={`${myId}-subheader`}
                align={subHeaderAlign}
                wrapContent={subHeaderWrap}
                component={subHeaderComponent}
              />
            )}

            <TableWrapper>
              {progressPending && !persistTableHead && (
                <ProgressWrapper>{progressComponent}</ProgressWrapper>
              )}

              <Table
                id={myId}
                disabled={disabled}
                role="table"
                className="rdt_Table"
                aria-colcount={columnsMemo.length + extraCols}
                aria-rowcount={
                  !data.length > 0 && !progressPending
                    ? -1
                    : (paginationTotalRows || data.length) + 1
                }
                {...(!noHeader ? { "aria-labelledby": `${myId}-header` } : {})}
                {...(subHeader
                  ? { "aria-describedby": `${myId}-subheader` }
                  : {})}
              >
                {showTableHead() && (
                  <TableHead
                    id={`${myId}-thead`}
                    role="rowgroup"
                    className="rdt_TableHead"
                  >
                    <TableHeadRow
                      aria-rowindex={++rowIndex}
                      id={`${myId}-thead-row`}
                      role="row"
                      className="rdt_TableHeadRow"
                      dense={dense}
                      disabled={progressPending || data.length === 0}
                    >
                      {selectableRows &&
                        (selectableRowsNoSelectAll ? (
                          <CellBase
                            aria-colindex={++colIndex}
                            role="columnheader"
                            style={{ flex: "0 0 48px" }}
                          >
                            <ScreenReaderLabelStyle>
                              Row Selector
                            </ScreenReaderLabelStyle>
                          </CellBase>
                        ) : (
                          <TableColCheckbox index={++colIndex} />
                        ))}
                      {expandableRows && (
                        <CellBase
                          aria-colindex={++colIndex}
                          role="columnheader"
                          style={{ flex: "0 0 56px" }}
                        >
                        <ScreenReaderLabelStyle>
                          Toggle Expanded Details
                        </ScreenReaderLabelStyle>
                      </CellBase>
                      )}
                      {columnsMemo.map(column => (
                        <TableCol
                          tableId={myId}
                          aria-colindex={++colIndex}
                          key={column.id}
                          column={column}
                          sortIcon={sortIcon}
                        />
                      ))}
                      {expandableRows && (
                        <ScreenReaderLabelStyle
                          aria-colindex={++colIndex}
                          role="columnheader"
                        >
                          Expanded Details
                        </ScreenReaderLabelStyle>
                      )}
                    </TableHeadRow>
                  </TableHead>
                )}

                {!data.length > 0 && !progressPending && (
                  <NoData component={noDataComponent} />
                )}

                {progressPending && persistTableHead && (
                  <ProgressWrapper>{progressComponent}</ProgressWrapper>
                )}

                {!progressPending && data.length > 0 && (
                  <TableBody
                    role="rowgroup"
                    fixedHeader={fixedHeader}
                    fixedHeaderScrollHeight={fixedHeaderScrollHeight}
                    hasOffset={overflowY}
                    offset={overflowYOffset}
                    className="rdt_TableBody"
                  >
                    {calculatedRows.map(row => {
                      // aria-rowindex includes header rows
                      const index =
                        ++rowIndex +
                        (enabledPagination
                          ? (currentPage - 1) * rowsPerPage
                          : 0);
                      const id = row[keyField] || rowIndex;
                      const defaultExpanded =
                        row[defaultExpandedField] || false;

                      return (
                        <TableRow
                          index={index}
                          tableId={myId}
                          id={id}
                          key={id}
                          keyField={keyField}
                          row={row}
                          columns={columnsMemo}
                          selectableRows={selectableRows}
                          expandableRows={expandableRows}
                          striped={striped}
                          highlightOnHover={highlightOnHover}
                          pointerOnHover={pointerOnHover}
                          dense={dense}
                          expandOnRowClicked={expandOnRowClicked}
                          expandOnRowDoubleClicked={expandOnRowDoubleClicked}
                          expandableRowsComponent={expandableRowsComponentMemo}
                          expandableDisabledField={expandableDisabledField}
                          defaultExpanded={defaultExpanded}
                          onRowClicked={handleRowClicked}
                          onRowDoubleClicked={handleRowDoubleClicked}
                          conditionalRowStyles={conditionalRowStyles}
                        />
                      );
                    })}
                  </TableBody>
                )}
              </Table>

              {enabledPagination && (
                <TableFooter className="rdt_TableFooter">
                  <Pagination
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    rowCount={paginationTotalRows || data.length}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    theme={theme}
                  />
                </TableFooter>
              )}
            </TableWrapper>
          </ResponsiveWrapper>
        </DataTableProvider>
      </ThemeProvider>
    );
  }
);

DataTable.propTypes = propTypes;
DataTable.defaultProps = defaultProps;

export default DataTable;
