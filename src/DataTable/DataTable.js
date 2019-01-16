import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
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
import TableBody from './TableBody';
import ResponsiveWrapper from './ResponsiveWrapper';
import ProgressWrapper from './ProgressWrapper';
import TableWrapper from './TableWrapper';
import NoData from './NoData';
import { propTypes, defaultProps } from './propTypes';
import { decorateColumns, getSortDirection } from './util';
import { handleSelectAll, handleRowSelected, handleSort, clearSelected } from './statemgmt';
import defaultTheme from '../themes/default';

const recalculateRows = ({ defaultSortField, data }, { sortDirection }) =>
  (defaultSortField ? orderBy(data, defaultSortField, sortDirection) : data);

class DataTable extends Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  static getDerivedStateFromProps(props, state) {
    // allow clearing of rows via passed clearSelectedRows toggle prop
    if (props.clearSelectedRows !== state.clearSelectedRows) {
      return clearSelected(props.clearSelectedRows);
    }

    // Keep data state in sync if it changes
    if (!isEqual(props.data, state.data) || !state.rows.length) {
      return {
        data: props.data,
        rows: recalculateRows(props, state),
      };
    }

    if (props.defaultSortAsc !== state.defaultSortAsc
      || props.defaultSortField !== state.defaultSortField) {
      return {
        sortDirection: getSortDirection(props.defaultSortAsc),
        sortColumn: props.defaultSortField,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    const sortDirection = getSortDirection(props.defaultSortAsc);
    this.columns = decorateColumns(props.columns);
    this.state = {
      allSelected: false,
      selectedCount: 0,
      selectedRows: [],
      sortColumn: props.defaultSortField,
      sortDirection,
      rows: [],
      data: props.data,
      clearSelectedRows: false,
      defaultSortAsc: props.defaultSortAsc,
      defaultSortField: props.defaultSortField,
      currentPage: 1,
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
      const { allSelected, selectedCount, rows, clearSelectedRows } = this.state;

      onTableUpdate({
        allSelected,
        selectedCount,
        selectedRows,
        rows,
        sortColumn,
        sortDirection,
        clearSelectedRows,
      });
    }
  }

  handleSelectAll = () => {
    this.setState(state => handleSelectAll(state));
  }

  handleRowSelected = row => {
    this.setState(state => handleRowSelected(row, state));
  }

  handleRowClicked = (row, e) => {
    const { onRowClicked } = this.props;

    if (onRowClicked) {
      onRowClicked(row, e);
    }
  }

  handleSort = ({ selector, sortable }) => {
    const { onSort } = this.props;
    const { sortColumn, sortDirection } = this.state;

    this.setState(state => handleSort(selector, sortable, state));

    if (sortable && onSort) {
      onSort(sortColumn, sortDirection);
    }
  }

  handleChangePage = currentPage => {
    const { onChangePage } = this.props;

    this.setState({
      currentPage,
    });

    if (onChangePage) {
      onChangePage(currentPage);
    }
  }

  handleChangeRowsPerPage = rowsPerPage => {
    const { onChangeRowsPerPage } = this.props;

    this.setState({
      rowsPerPage,
    });

    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(rowsPerPage);
    }
  }

  renderColumns() {
    return (
      this.columns.map(column => (
        <TableCol
          key={column.id}
          column={column}
          onColumnClick={this.handleSort}
        />
      ))
    );
  }

  renderRows() {
    const {
      keyField,
      pagination,
    } = this.props;

    const {
      rows,
      currentPage,
      rowsPerPage,
    } = this.state;

    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;

    const currentRows = pagination
      ? rows.slice(firstIndex, lastIndex)
      : rows;

    return (
      currentRows.map((row, i) => (
        <TableRow
          key={row[keyField] || i}
          row={row}
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
      <TableHead>
        <TableHeadRow>
          {selectableRows && <TableColCheckbox onClick={this.handleSelectAll} />}
          {expandableRows && <div style={{ width: '48px' }} />}
          {this.renderColumns()}
        </TableHeadRow>
      </TableHead>
    );
  }

  render() {
    const {
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
      pagination,
      paginationComponent,
      selectableRows,
      expandableRows,
    } = this.props;

    const Pagination = paginationComponent;

    const {
      rows,
      rowsPerPage,
      currentPage,
    } = this.state;

    const theme = merge(defaultTheme, customTheme);
    const enabledPagination = pagination && !progressPending && rows.length > 0;
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

            <TableWrapper>
              {progressPending && (
                <ProgressWrapper
                  component={progressComponent}
                  centered={progressCentered}
                />
              )}

              {!rows.length > 0 && !progressPending &&
                <NoData component={noDataComponent} />}

              {rows.length > 0 && (
                <Table disabled={disabled}>
                  {this.renderTableHead()}

                  <TableBody
                    fixedHeader={fixedHeader}
                    hasOffset={overflowY}
                    offset={overflowYOffset}
                  >
                    {this.renderRows()}
                  </TableBody>
                </Table>
              )}

              {enabledPagination && (
                <TableFooter>
                  <Pagination
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    rowCount={rows.length}
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
