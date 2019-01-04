import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { DataTableProvider } from './DataTableContext';
import Table from './Table';
import TableHead from './TableHead';
import TableHeadRow from './TableHeadRow';
import TableRow from './TableRow';
import TableCol from './TableCol';
import TableColCheckbox from './TableColCheckbox';
import ExpanderRow from './ExpanderRow';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import ResponsiveWrapper from './ResponsiveWrapper';
import ProgressWrapper from './ProgressWrapper';
import TableWrapper from './TableWrapper';
import NoData from './NoData';
import { propTypes, defaultProps } from './DataTablePropTypes';
import { decorateColumns, getSortDirection, calcFirstCellIndex } from './util';
import { handleSelectAll, handleRowChecked, toggleExpand, handleSort, clearSelected } from './statemgmt';
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
      clearSelectedRows: false,
      defaultSortAsc: props.defaultSortAsc,
      defaultSortField: props.defaultSortField,
      data: props.data,
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

  handleRowChecked = row => {
    this.setState(state => handleRowChecked(row, state));
  }

  handleRowClicked = (row, index, e) => {
    const { onRowClicked } = this.props;

    if (onRowClicked) {
      onRowClicked(row, index, e);
    }
  }

  toggleExpand = row => {
    this.setState((state, props) => toggleExpand(props, row, state));
  }

  handleSort = ({ selector, sortable }) => {
    const { onServerSort } = this.props;
    const { sortColumn, sortDirection } = this.state;

    this.setState((state, props) => handleSort(props, selector, sortable, state));

    if (sortable && onServerSort) {
      onServerSort(sortColumn, sortDirection);
    }
  }

  generateDefaultContextTitle() {
    const { contextTitle } = this.props;
    const { selectedCount } = this.state;

    return contextTitle || `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`;
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
      expandableRowsComponent,
      expanderStateField,
      keyField,
    } = this.props;

    const {
      rows,
    } = this.state;

    const getExpanderRowbByParentId = parent => rows.find(r => r.id === parent);

    return (
      rows.map((row, index) => {
        if (row[expanderStateField]) {
          return (
            <ExpanderRow
              key={`expander--${row[keyField]}`}
              data={getExpanderRowbByParentId(row.parent)}
            >
              {expandableRowsComponent}
            </ExpanderRow>
          );
        }

        return (
          <TableRow
            key={row[keyField] || index}
            row={row}
            index={index}
            onRowClicked={this.handleRowClicked}
            onRowSelected={this.handleRowChecked}
            onToggled={this.toggleExpand}
          />
        );
      })
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
          {selectableRows && (
            <TableColCheckbox
              onClick={this.handleSelectAll}
            />
          )}
          {expandableRows && <div style={{ width: '42px' }} />}
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
    } = this.props;

    const {
      rows,
      selectableRows,
      expandableRows,
    } = this.state;

    const theme = merge(defaultTheme, customTheme);
    const init = {
      ...this.props,
      ...this.state,
      ...{ columns: this.columns },
      ...{ firstCellIndex: calcFirstCellIndex(selectableRows, expandableRows) },
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
                contextTitle={this.generateDefaultContextTitle()}
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
            </TableWrapper>
          </ResponsiveWrapper>
        </DataTableProvider>
      </ThemeProvider>
    );
  }
}

export default DataTable;
