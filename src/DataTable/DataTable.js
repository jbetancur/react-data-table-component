import React, { memo, useReducer, useMemo, useCallback, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { DataTableProvider } from './DataTableContext';
import { tableReducer } from './tableReducer';
import Table from './Table';
import TableHead from './TableHead';
import TableHeadRow from './TableHeadRow';
import TableRow from './TableRow';
import TableCol from './TableCol';
import TableColCheckbox from './TableColCheckbox';
import TableHeader from './TableHeader';
import TableSubheader from './TableSubheader';
import TableBody from './TableBody';
import ResponsiveWrapper from './ResponsiveWrapper';
import ProgressWrapper from './ProgressWrapper';
import TableWrapper from './TableWrapper';
import { CellBase } from './Cell';
import NoData from './NoDataWrapper';
import NativePagination from './Pagination';
import useDidUpdateEffect from './useDidUpdateEffect';
import { propTypes, defaultProps } from './propTypes';
import { sort, decorateColumns, getSortDirection, getNumberOfPages, recalculatePage, isRowSelected } from './util';
import { createStyles } from './styles';

const DataTable = memo(({
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
  selectableRowsHighlight,
  selectableRowsNoSelectAll,
  selectableRowSelected,
  selectableRowDisabled,
  selectableRowsComponent,
  selectableRowsComponentProps,
  onRowExpandToggled,
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
  noContextMenu,
  contextMessage,
  contextActions,
  contextComponent,
  expandableRows,
  onRowClicked,
  onRowDoubleClicked,
  sortIcon,
  onSort,
  sortFunction,
  sortServer,
  expandableRowsComponent,
  expandableRowDisabled,
  expandOnRowClicked,
  expandOnRowDoubleClicked,
  expandableRowExpanded,
  defaultSortField,
  defaultSortAsc,
  clearSelectedRows,
  conditionalRowStyles,
  theme,
  customStyles,
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
  };

  const [{
    rowsPerPage,
    currentPage,
    selectedRows,
    allSelected,
    selectedCount,
    sortColumn,
    selectedColumn,
    sortDirection,
  }, dispatch] = useReducer(tableReducer, initialState);

  const enabledPagination = pagination && !progressPending && data.length > 0;
  const Pagination = paginationComponent || NativePagination;
  const columnsMemo = useMemo(() => decorateColumns(columns), [columns]);
  const currentTheme = useMemo(() => createStyles(customStyles, theme), [customStyles, theme]);
  const expandableRowsComponentMemo = useMemo(() => expandableRowsComponent, [expandableRowsComponent]);
  const handleRowClicked = useCallback((row, e) => onRowClicked(row, e), [onRowClicked]);
  const handleRowDoubleClicked = useCallback((row, e) => onRowDoubleClicked(row, e), [onRowDoubleClicked]);
  const handleChangePage = page => dispatch({ type: 'CHANGE_PAGE', page, paginationServer });

  useDidUpdateEffect(() => {
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
    dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
  }, [clearSelectedRows]);

  useDidUpdateEffect(() => {
    handleChangePage(paginationDefaultPage);
  }, [paginationDefaultPage, paginationResetDefaultPage]);

  useEffect(() => {
    if (selectableRowSelected) {
      const preSelectedRows = data.filter(row => selectableRowSelected(row));

      dispatch({ type: 'SELECT_MULTIPLE_ROWS', selectedRows: preSelectedRows, rows: data });
    }
  }, [data, selectableRowSelected]);

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
  if (pagination && !paginationServer && data.length > 0 && calculatedRows.length === 0) {
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

    dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
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
    contextMessage,
    contextActions,
    contextComponent,
    selectableRowSelected,
    selectableRowDisabled,
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
    paginationComponentOptions,
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

  return (
    <ThemeProvider theme={currentTheme}>
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
              title={title}
              actions={actions}
              showMenu={!noContextMenu}
            />
          )}

          {subHeader && (
            <TableSubheader
              align={subHeaderAlign}
              wrapContent={subHeaderWrap}
            >
              {subHeaderComponent}
            </TableSubheader>
          )}

          <TableWrapper>
            {progressPending && !persistTableHead && (
              <ProgressWrapper>
                {progressComponent}
              </ProgressWrapper>
            )}

            <Table disabled={disabled} className="rdt_Table">
              {showTableHead() && (
                <TableHead className="rdt_TableHead">
                  <TableHeadRow
                    className="rdt_TableHeadRow"
                    dense={dense}
                    disabled={progressPending || data.length === 0}
                  >
                    {selectableRows && (
                      selectableRowsNoSelectAll
                        ? <CellBase style={{ flex: '0 0 48px' }} />
                        : <TableColCheckbox />
                    )}
                    {expandableRows && (
                      <CellBase head style={{ flex: '0 0 48px' }} />
                    )}
                    {columnsMemo.map(column => (
                      <TableCol
                        key={column.id}
                        column={column}
                        sortIcon={sortIcon}
                      />
                    ))}
                  </TableHeadRow>
                </TableHead>
              )}

              {!data.length > 0 && !progressPending && (
                <NoData>
                  {noDataComponent}
                </NoData>
              )}

              {progressPending && persistTableHead && (
                <ProgressWrapper>
                  {progressComponent}
                </ProgressWrapper>
              )}

              {!progressPending && data.length > 0 && (
                <TableBody
                  fixedHeader={fixedHeader}
                  fixedHeaderScrollHeight={fixedHeaderScrollHeight}
                  hasOffset={overflowY}
                  offset={overflowYOffset}
                  className="rdt_TableBody"
                >
                  {calculatedRows.map((row, i) => {
                    const id = row[keyField] || i;
                    const selected = isRowSelected(row, selectedRows, keyField);
                    const expanderExpander = expandableRows
                      && expandableRowExpanded
                      && expandableRowExpanded(row);

                    const expanderDisabled = expandableRows
                      && expandableRowDisabled
                      && expandableRowDisabled(row);

                    return (
                      <TableRow
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
                        onRowExpandToggled={onRowExpandToggled}
                        defaultExpanderDisabled={expanderDisabled}
                        defaultExpanded={expanderExpander}
                        onRowClicked={handleRowClicked}
                        onRowDoubleClicked={handleRowDoubleClicked}
                        conditionalRowStyles={conditionalRowStyles}
                        selected={selected}
                        selectableRowsHighlight={selectableRowsHighlight}
                      />
                    );
                  })}
                </TableBody>
              )}
            </Table>

            {enabledPagination && (
              <Pagination
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                rowCount={paginationTotalRows || data.length}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
              />
            )}
          </TableWrapper>
        </ResponsiveWrapper>
      </DataTableProvider>
    </ThemeProvider>
  );
});

DataTable.propTypes = propTypes;
DataTable.defaultProps = defaultProps;

export default DataTable;
