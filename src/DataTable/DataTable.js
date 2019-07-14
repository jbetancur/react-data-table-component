import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import memoize from 'memoize-one';
import merge from 'lodash/merge';
import { DataTableProvider } from './DataTableContext';
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
import Pagination from './Pagination';
import { propTypes, defaultProps } from './propTypes';
import { sort, decorateColumns, getSortDirection, getNumberOfPages } from './util';
import { handleSelectAll, handleRowSelected, handleSort, clearSelected } from './statemgmt';
import getDefaultTheme from '../themes/default';

class DataTable extends Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  static getDerivedStateFromProps(props, state) {
    // allow clearing of rows via passed clearSelectedRows toggle prop
    if (props.clearSelectedRows !== state.clearSelectedRows) {
      return clearSelected(props.clearSelectedRows);
    }

    return null;
  }

  constructor(props) {
    super(props);

    const sortDirection = getSortDirection(props.defaultSortAsc);
    this.columns = decorateColumns(props.columns);
    this.sortedRows = memoize((rows, defaultSortField, direction) => sort(rows, defaultSortField, direction, props.sortFunction));
    this.mergeTheme = memoize((theme, customTheme) => merge(theme, customTheme));
    this.PaginationComponent = props.paginationComponent || Pagination;
    this.state = {
      allSelected: false,
      selectedCount: 0,
      selectedRows: [],
      sortColumn: props.defaultSortField,
      sortDirection,
      clearSelectedRows: false,
      currentPage: props.paginationDefaultPage,
      rowsPerPage: props.paginationPerPage,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { onTableUpdate } = this.props;
    const { selectedRows, sortDirection, sortColumn } = this.state;

    if (onTableUpdate &&
      (prevState.selectedRows !== selectedRows
      || prevState.sortDirection !== sortDirection
      || prevState.sortColumn !== sortColumn)
    ) {
      const { allSelected, selectedCount, clearSelectedRows } = this.state;

      onTableUpdate({
        allSelected,
        selectedCount,
        selectedRows,
        sortColumn,
        sortDirection,
        clearSelectedRows,
      });
    }
  }

  handleSelectAll = () => {
    const { data } = this.props;

    this.setState(state => handleSelectAll(data, state.allSelected));
  }

  handleRowSelected = row => {
    const { data } = this.props;

    this.setState(state => handleRowSelected(data, row, state.selectedRows));
  }

  handleRowClicked = (row, e) => {
    const { onRowClicked } = this.props;

    if (onRowClicked) {
      onRowClicked(row, e);
    }
  }

  handleSortChange = column => {
    const { onSort } = this.props;

    this.setState(state => {
      const newState = handleSort(column.selector, column.sortable, state);

      if (column.sortable && onSort) {
        onSort(column, newState.sortDirection);
      }

      return newState;
    });
  }

  handleChangePage = currentPage => {
    const { onChangePage, data, paginationTotalRows } = this.props;

    this.setState({ currentPage });

    if (onChangePage) {
      onChangePage(currentPage, paginationTotalRows || data.length);
    }
  }

  handleChangeRowsPerPage = (newRowsPerPage, currentPage) => {
    const { onChangeRowsPerPage, data, paginationTotalRows, paginationServer } = this.props;
    const rowCount = paginationTotalRows || data.length;
    const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
    const recalculatedPage = Math.min(currentPage, updatedPage);

    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(newRowsPerPage, recalculatedPage);
    }

    // update the currentPage for client-side pagination
    // server - side should be handled by onChangeRowsPerPage
    if (!paginationServer) {
      this.handleChangePage(recalculatedPage);
    }

    this.setState({
      rowsPerPage: newRowsPerPage,
      currentPage: recalculatedPage,
    });
  }

  calculateRows() {
    const {
      data,
      pagination,
      paginationServer,
    } = this.props;

    const {
      currentPage,
      rowsPerPage,
      sortDirection,
      sortColumn,
    } = this.state;

    const sortedRows = this.sortedRows(data, sortColumn, sortDirection);

    if (pagination && !paginationServer) {
      // when using client-side pagination we can just slice the data set
      const lastIndex = currentPage * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;

      return sortedRows.slice(firstIndex, lastIndex);
    }

    return sortedRows;
  }

  renderColumns() {
    return (
      this.columns.map(column => (
        <TableCol
          key={column.id}
          column={column}
          onColumnClick={this.handleSortChange}
        />
      ))
    );
  }

  renderRows() {
    const {
      keyField,
      defaultExpandedField,
    } = this.props;

    return (
      this.calculateRows().map((row, i) => (
        <TableRow
          key={row[keyField] || i}
          row={row}
          defaultExpanded={row[defaultExpandedField] || false}
          onRowClicked={this.handleRowClicked}
          onRowSelected={this.handleRowSelected}
        />
      ))
    );
  }

  renderTableHead() {
    const {
      selectableRows,
      expandableRows,
    } = this.props;

    return (
      <TableHead className="rdt_TableHead">
        <TableHeadRow className="rdt_TableHeadRow">
          {selectableRows && <TableColCheckbox onClick={this.handleSelectAll} />}
          {expandableRows && <CellBase style={{ flex: '0 0 56px' }} />}
          {this.renderColumns()}
        </TableHeadRow>
      </TableHead>
    );
  }

  render() {
    const {
      data,
      paginationTotalRows,
      title,
      customTheme,
      actions,
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
      selectableRows,
      expandableRows,
      subHeader,
      subHeaderAlign,
      subHeaderWrap,
      subHeaderComponent,
    } = this.props;

    const {
      rowsPerPage,
      currentPage,
    } = this.state;

    const theme = this.mergeTheme(getDefaultTheme(), customTheme);
    const enabledPagination = pagination && !progressPending && data.length > 0;
    const init = {
      ...this.props,
      ...this.state,
      ...{ columns: this.columns },
      ...{ internalCell: selectableRows || expandableRows },
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
                <ProgressWrapper
                  component={progressComponent}
                  centered={progressCentered}
                />
              )}

              {!data.length > 0 && !progressPending &&
                <NoData component={noDataComponent} />}

              {data.length > 0 && (
                <Table
                  disabled={disabled}
                  className="rdt_Table"
                >
                  {this.renderTableHead()}

                  <TableBody
                    fixedHeader={fixedHeader}
                    fixedHeaderScrollHeight={fixedHeaderScrollHeight}
                    hasOffset={overflowY}
                    offset={overflowYOffset}
                    className="rdt_TableBody"
                  >
                    {this.renderRows()}
                  </TableBody>
                </Table>
              )}

              {enabledPagination && (
                <TableFooter className="rdt_TableFooter">
                  <this.PaginationComponent
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
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
}

export default DataTable;
