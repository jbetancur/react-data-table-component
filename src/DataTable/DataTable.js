import React, { useReducer, useMemo, useCallback } from 'react';
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
import { propTypes, defaultProps } from './propTypes';
import { sort, decorateColumns, getSortDirection, getNumberOfPages } from './util';
import getDefaultTheme from '../themes/default';

const DataTable = ({
  data,
  columns,
  title,
  actions,
  keyField,
  striped,
  highlightOnHover,
  pointerOnHover,
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
  onTableUpdate,
}) => {
  const initialState = {
    allSelected: false,
    selectedCount: 0,
    selectedRows: [],
    sortColumn: defaultSortField,
    sortDirection: getSortDirection(defaultSortAsc),
    selectedRowsFlag: false,
    currentPage: paginationDefaultPage,
    rowsPerPage: paginationPerPage,
    data,
  };

  const [{
    rowsPerPage,
    currentPage,
    selectedRows,
    allSelected,
    selectedCount,
    sortColumn,
    sortDirection,
    selectedRowsFlag,
  }, dispatch] = useReducer(tableReducer, initialState);

  const init = {
    selectedRows,
    selectedCount,
    sortColumn,
    sortDirection,
    keyField,
    selectableRowsComponent: useMemo(() => selectableRowsComponent, [selectableRowsComponent]),
    selectableRowsComponentProps: useMemo(() => selectableRowsComponentProps, [selectableRowsComponentProps]),
    expandableIcon,
    paginationRowsPerPageOptions: useMemo(() => paginationRowsPerPageOptions, [paginationRowsPerPageOptions]),
    paginationIconLastPage,
    paginationIconFirstPage,
    paginationIconNext,
    paginationIconPrevious,
    paginationComponentOptions: useMemo(() => paginationComponentOptions, [paginationComponentOptions]),
    contextTitle,
    contextActions,
    indeterminate: selectedRows.length > 0 && !allSelected,
    dispatch,
  };

  useMemo(() => onTableUpdate({
    allSelected, selectedCount, selectedRows, sortColumn, sortDirection,
  }), [allSelected, onTableUpdate, selectedCount, selectedRows, sortColumn, sortDirection]);

  if (clearSelectedRows !== selectedRowsFlag) {
    dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
  }
  const enabledPagination = pagination && !progressPending && data.length > 0;
  const Pagination = paginationComponent || NativePagination;
  const columnsMemo = useMemo(() => decorateColumns(columns), [columns]);
  const sortedData = useMemo(() => sort(data, sortColumn, sortDirection, sortFunction), [data, sortColumn, sortDirection, sortFunction]);
  const theme = useMemo(() => merge(getDefaultTheme(), customTheme), [customTheme]);
  const expandableRowsComponentMemo = useMemo(() => expandableRowsComponent, [expandableRowsComponent]);
  const handleSelectAll = () => dispatch({ type: 'SELECT_ALL' });
  const handleRowClicked = useCallback((row, e) => onRowClicked(row, e), [onRowClicked]);
  const handleSortChange = column => {
    if (column.sortable) {
      let direction = sortDirection;
      // change sort direction only if sortColumn (currently selected column) is === the newly clicked column
      // otherwise, retain sort direction if the column is swiched
      if (sortColumn === column.selector) {
        direction = sortDirection === 'asc' ? 'desc' : 'asc';
      }

      dispatch({ type: 'SORT_CHANGE', sortDirection: direction, sortColumn: column.selector });
      onSort(column, direction);
    }
  };

  const handleChangePage = page => {
    dispatch({ type: 'CHANGE_PAGE', page });
    onChangePage(page, paginationTotalRows || data.length);
  };

  const handleChangeRowsPerPage = newRowsPerPage => {
    const rowCount = paginationTotalRows || data.length;
    const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
    const recalculatedPage = Math.min(currentPage, updatedPage);

    // update the currentPage for client-side pagination
    // server - side should be handled by onChangeRowsPerPage
    if (!paginationServer) {
      handleChangePage(recalculatedPage);
    }

    dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
    onChangeRowsPerPage(newRowsPerPage, recalculatedPage);
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

            {!data.length > 0 && !progressPending &&
              <NoData component={noDataComponent} />}

            {data.length > 0 && !progressPending && (
              <Table disabled={disabled} className="rdt_Table">
                <TableHead className="rdt_TableHead">
                  <TableHeadRow className="rdt_TableHeadRow">
                    {selectableRows && <TableColCheckbox onClick={handleSelectAll} checked={allSelected} />}
                    {expandableRows && <CellBase style={{ flex: '0 0 56px' }} />}
                    {columnsMemo.map(column => (
                      <TableCol
                        key={column.id}
                        column={column}
                        onColumnClick={handleSortChange}
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
                  {calculatedRows.map((row, i) => (
                    <TableRow
                      key={row[keyField] || i}
                      row={row}
                      columns={columnsMemo}
                      keyField={keyField}
                      selectableRows={selectableRows}
                      expandableRows={expandableRows}
                      striped={striped}
                      highlightOnHover={highlightOnHover}
                      pointerOnHover={pointerOnHover}
                      expandableRowsComponent={expandableRowsComponentMemo}
                      expandableDisabledField={expandableDisabledField}
                      defaultExpanded={row[defaultExpandedField] || false}
                      onRowClicked={handleRowClicked}
                    />
                  ))}
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
};

DataTable.propTypes = propTypes;
DataTable.defaultProps = defaultProps;

export default DataTable;
