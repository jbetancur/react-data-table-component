import React, { memo, useReducer, useMemo, useCallback } from 'react';
import { ThemeProvider } from 'styled-components';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
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
  searchEnabled,
  selectableRowsComponent,
  selectableRowsComponentProps,
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
  selectableRows,
  expandableRows,
  onRowClicked,
  sortIcon,
  onSort,
  sortFunction,
  expandableRowsComponent,
  expandableDisabledField,
  defaultExpandedField,
  defaultSortField,
  defaultSortAsc,
  clearSelectedRows,
  onTableUpdate, // Deprecated
  onRowSelected,
}) => {
  const initialState = {
    allSelected: false,
    selectedCount: 0,
    selectedRows: [],
    sortColumn: defaultSortField,
    selectedColumn: {},
    sortDirection: getSortDirection(defaultSortAsc),
    selectedRowsFlag: false,
    searchText: '',
    searchedData: data,
    currentPage: paginationDefaultPage,
    rowsPerPage: paginationPerPage,
    data,
  };

  const [{
    rowsPerPage,
    searchText,
    currentPage,
    selectedRows,
    allSelected,
    selectedCount,
    sortColumn,
    selectedColumn,
    sortDirection,
    selectedRowsFlag,
  }, dispatch] = useReducer(tableReducer, initialState);

  /* istanbul ignore next */
  if (onTableUpdate) {
    // eslint-disable-next-line no-console
    console.error('Warning: onTableUpdate has been deprecated. Please switch to onRowSelected.');

    useDidUpdateEffect(() => {
      onTableUpdate({ allSelected, selectedCount, selectedRows, sortColumn, sortDirection });
    }, [allSelected, onTableUpdate, selectedCount, selectedRows, sortColumn, sortDirection]);
  }
  useDidUpdateEffect(() => {
    onRowSelected({ allSelected, selectedCount, selectedRows });
  }, [allSelected, onTableUpdate, selectedCount, selectedRows]);

  useDidUpdateEffect(() => {
    onChangePage(currentPage, paginationTotalRows || searchedData.length);
  }, [currentPage, onChangePage]);

  useDidUpdateEffect(() => {
    onChangeRowsPerPage(rowsPerPage, currentPage);
  }, [rowsPerPage, onChangeRowsPerPage]);

  useDidUpdateEffect(() => {
    onSort(selectedColumn, sortDirection);
  }, [onSort, sortColumn, sortDirection]);

  if (clearSelectedRows !== selectedRowsFlag) {
    dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
  }

  const init = {
    allSelected,
    selectedRows,
    selectedCount,
    sortColumn,
    sortDirection,
    keyField,
    contextTitle,
    contextActions,
    onTableUpdate,
    dispatch,
    selectableRowsComponent,
    selectableRowsComponentProps,
    expandableIcon,
    paginationRowsPerPageOptions,
    paginationIconLastPage,
    paginationIconFirstPage,
    paginationIconNext,
    paginationIconPrevious,
    paginationComponentOptions,
  };

  const enabledPagination = pagination && !progressPending && searchedData.length > 0;
  const Pagination = paginationComponent || NativePagination;
  const columnsMemo = useMemo(() => decorateColumns(columns), [columns]);

  // Filter sortedData by searchText
  // No conditional is required because if search is not enabled then the value will always be default ''
  // which will always match every value
  // searchedData takes a fresh copy of the original data set stored in data
  const columnKeys = columns.map(c => { return c.selector })
  const searchedData = data
    .filter(row => {
      // for each row, return an object containing only the same properties as the table itself
      // then check if at least one value in that object, stringified and case-agnostic, matches searchText
      return Object
        .values(pick(row, columnKeys))
        .map(v => { return v.toString().toLowerCase() })
        .some(v => { return v.includes(searchText.toLowerCase()) })
    })
  // From here on, use searchedData instead of original data

  const sortedData = useMemo(() => sort(searchedData, sortColumn, sortDirection, sortFunction), [searchedData, sortColumn, sortDirection, sortFunction]);
  const theme = useMemo(() => merge(getDefaultTheme(), customTheme), [customTheme]);
  const expandableRowsComponentMemo = useMemo(() => expandableRowsComponent, [expandableRowsComponent]);
  const handleRowClicked = useCallback((row, e) => onRowClicked(row, e), [onRowClicked]);
  const handleChangePage = page => dispatch({ type: 'CHANGE_PAGE', page });

  const handleChangeRowsPerPage = newRowsPerPage => {
    const rowCount = paginationTotalRows || searchedData.length;
    const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
    const recalculatedPage = Math.min(currentPage, updatedPage);

    // update the currentPage for client-side pagination
    // server - side should be handled by onChangeRowsPerPage
    if (!paginationServer) {
      handleChangePage(recalculatedPage);
    }

    dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
  };

  const calculatedRows = useMemo(() => {
    if (pagination && !paginationServer) {
      // when using client-side pagination we can just slice the data set
      const lastIndex = currentPage * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;

      return sortedData.slice(firstIndex, lastIndex);
    }

    return sortedData;
  }, [currentPage, pagination, paginationServer, rowsPerPage, sortedData]);

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

            {searchEnabled && (
              <input
                type="text"
                placeholder='Search...'
                value={searchText}
                onChange={(e) => { dispatch({ type: 'UPDATE_SEARCH_TEXT', text: e.target.value }) }}
              />
            )}

            {!searchedData.length > 0 && !progressPending &&
              <NoData component={noDataComponent} />}

            {searchedData.length > 0 && !progressPending && (
              <Table disabled={disabled} className="rdt_Table">
                <TableHead className="rdt_TableHead">
                  <TableHeadRow className="rdt_TableHeadRow">
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
                  rowCount={paginationTotalRows || searchedData.length}
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
