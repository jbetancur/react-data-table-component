import React, { memo, useReducer, useMemo, useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import merge from 'lodash/merge';
import { DataTableProvider } from './DataTableContext';
import { tableReducer } from './tableReducer';
import Table from './Table';
import TableHead from './TableHead';
import TableFooter from './TableFooter';
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
import NoData from './NoData';
import NativePagination from './Pagination';
import useDidUpdateEffect from './useDidUpdateEffect';
import { propTypes, defaultProps } from './propTypes';
import { sort, decorateColumns, getSortDirection, getNumberOfPages } from './util';
import getDefaultTheme from '../themes/default';

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
  selectableRowsDisabledField,
  selectableRowsPreSelectedField,
  selectableRowsComponent,
  selectableRowsComponentProps,
  onRowSelected,
  expandableIcon,
  onChangeRowsPerPage,
  onChangePage,
  paginationServer,
  paginationTotalRows,
  paginationDefaultPage,
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
  progressCentered,
  noDataComponent,
  disabled,
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
  sortIcon,
  onSort,
  sortFunction,
  sortServer,
  expandableRowsComponent,
  expandableDisabledField,
  defaultExpandedField,
  defaultSortField,
  defaultSortAsc,
  clearSelectedRows,
  onTableUpdate, // Deprecated
}) => {
  const preSelectedRows = selectableRowsPreSelectedField
    ? data.filter(row => row[selectableRowsPreSelectedField])
    : [];
  const initialState = {
    allSelected: preSelectedRows.length === data.length,
    selectedCount: preSelectedRows.length,
    selectedRows: preSelectedRows,
    sortColumn: defaultSortField,
    selectedColumn: {},
    sortDirection: getSortDirection(defaultSortAsc),
    selectedRowsFlag: false,
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
    selectedRowsFlag,
  }, dispatch] = useReducer(tableReducer, initialState);

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

  /* istanbul ignore next */
  if (onTableUpdate) {
    // eslint-disable-next-line no-console
    console.error('Warning: onTableUpdate has been deprecated. Please switch to onRowSelected.');

    useDidUpdateEffect(() => {
      onTableUpdate({ allSelected, selectedCount, selectedRows, sortColumn, sortDirection });
    }, [allSelected, selectedCount, selectedRows, sortColumn, sortDirection]);
  }

  useDidUpdateEffect(() => {
    onRowSelected({ allSelected, selectedCount, selectedRows });
  }, [allSelected, selectedCount, selectedRows]);

  useDidUpdateEffect(() => {
    onChangePage(currentPage, paginationTotalRows || data.length);
  }, [currentPage]);

  useDidUpdateEffect(() => {
    onChangeRowsPerPage(rowsPerPage, currentPage);
  }, [rowsPerPage]);

  useDidUpdateEffect(() => {
    onSort(selectedColumn, sortDirection);
  }, [sortColumn, sortDirection]);

  if (clearSelectedRows !== selectedRowsFlag) {
    dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
  }

  const enabledPagination = pagination && !progressPending && data.length > 0;
  const Pagination = paginationComponent || NativePagination;
  const columnsMemo = useMemo(() => decorateColumns(columns), [columns]);
  const theme = useMemo(() => merge(getDefaultTheme(), customTheme), [customTheme]);
  const expandableRowsComponentMemo = useMemo(() => expandableRowsComponent, [expandableRowsComponent]);
  const handleRowClicked = useCallback((row, e) => onRowClicked(row, e), [onRowClicked]);
  const handleChangePage = page => dispatch({ type: 'CHANGE_PAGE', page, paginationServer });

  // for client-side pagination it should navigate back one page when there is only 1 item on the last page and it is removed from the data set
  // as long as there is data and the calculated rows (the rows calculated for the current page slice) are 0
  if (pagination && !paginationServer && data.length > 0 && calculatedRows.length === 0) {
    handleChangePage(currentPage - 1);
  }

  const handleChangeRowsPerPage = newRowsPerPage => {
    const rowCount = paginationTotalRows || calculatedRows.length;
    const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
    const recalculatedPage = Math.min(currentPage, updatedPage);

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
    paginationComponentOptions,
  };

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
              title={title}
              actions={actions}
              pending={progressPending}
            />
          )}

          {subHeader && (
            <TableSubheader
              align={subHeaderAlign}
              wrapContent={subHeaderWrap}
              component={subHeaderComponent}
            />
          )}

          <TableWrapper>
            {progressPending && (
              <ProgressWrapper component={progressComponent} centered={progressCentered} />
            )}

            {!data.length > 0 && !progressPending &&
              <NoData component={noDataComponent} />}

            {data.length > 0 && !progressPending && (
              <Table disabled={disabled} className="rdt_Table">
                <TableHead className="rdt_TableHead">
                  <TableHeadRow className="rdt_TableHeadRow" dense={dense}>
                    {selectableRows && <TableColCheckbox />}
                    {expandableRows && <CellBase style={{ flex: '0 0 56px' }} />}
                    {columnsMemo.map(column => (
                      <TableCol
                        key={column.id}
                        column={column}
                        sortIcon={sortIcon}
                      />
                    ))}
                  </TableHeadRow>
                </TableHead>

                <TableBody
                  fixedHeader={fixedHeader}
                  fixedHeaderScrollHeight={fixedHeaderScrollHeight}
                  hasOffset={overflowY}
                  offset={overflowYOffset}
                  className="rdt_TableBody"
                >
                  {calculatedRows.map((row, i) => {
                    const id = row[keyField] || i;
                    const defaultExpanded = row[defaultExpandedField] || false;

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
                        expandableRowsComponent={expandableRowsComponentMemo}
                        expandableDisabledField={expandableDisabledField}
                        defaultExpanded={defaultExpanded}
                        onRowClicked={handleRowClicked}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            )}

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
});

DataTable.propTypes = propTypes;
DataTable.defaultProps = defaultProps;

export default DataTable;
