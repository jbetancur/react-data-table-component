import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import orderBy from 'lodash/orderBy';
import merge from 'lodash/merge';
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
import { handleSelectAll, handleRowChecked, toggleExpand, handleSort, clearSelectedRows } from './statemgmt';
import defaultTheme from '../themes/default';

class DataTable extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

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
      rows: props.defaultSortField ? orderBy(props.data, props.defaultSortField, sortDirection) : props.data,
    };
  }

  componentWillReceiveProps(nextProps) {
    // allow clearing of rows via passed clearSelectedRows prop
    if (nextProps.clearSelectedRows !== this.props.clearSelectedRows) {
      this.setState(() => clearSelectedRows());
    }

    // Keep data state in sync if it changes
    if (nextProps.data !== this.props.data) {
      this.setState(state => ({ rows: orderBy(nextProps.data, state.sortColumn, state.sortDirection) }));
    }

    // Keep sort default states in sync if it changes
    if (nextProps.defaultSortAsc !== this.props.defaultSortAsc
      || nextProps.defaultSortField !== this.props.defaultSortField) {
      this.setState({
        sortDirection: getSortDirection(nextProps.defaultSortAsc),
        sortColumn: nextProps.defaultSortField,
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.onTableUpdate && nextState !== this.state) {
      nextProps.onTableUpdate(nextState);
    }
  }

  generateDefaultContextTitle() {
    const { contextTitle } = this.props;
    const { selectedCount } = this.state;

    return contextTitle || `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`;
  }

  handleSelectAll = () => {
    this.setState(state => handleSelectAll(state));
  }

  handleRowChecked = row => {
    this.setState(state => handleRowChecked(row, state));
  }

  handleRowClicked = (row, index, e) => {
    if (this.props.onRowClicked) {
      this.props.onRowClicked(row, index, e);
    }
  }

  toggleExpand = row => {
    this.setState((state, props) => toggleExpand(props, row, state));
  }

  handleSort = ({ selector, sortable }) => {
    this.setState((state, props) => handleSort(props, selector, sortable, state));

    if (sortable && this.props.onServerSort) {
      this.props.onServerSort(this.state.sortColumn, this.state.sortDirection);
    }
  }

  renderColumns() {
    const {
      selectableRows,
      expandableRows,
      sortIcon,
    } = this.props;

    const {
      sortColumn,
      sortDirection,
    } = this.state;

    const firstCellIndex = calcFirstCellIndex(selectableRows, expandableRows);

    return (
      this.columns.map(column => (
        <TableCol
          key={column.id}
          column={column}
          onColumnClick={this.handleSort}
          sortField={sortColumn}
          sortDirection={sortDirection}
          sortIcon={sortIcon}
          firstCellIndex={firstCellIndex}
        />))
    );
  }

  renderRows() {
    const {
      selectableRows,
      expandableRows,
      expandableRowsComponent,
      expanderStateField,
      striped,
      highlightOnHover,
      keyField,
      pointerOnHover,
      selectableRowsComponent,
      selectableRowsComponentProps,
    } = this.props;

    const {
      rows,
    } = this.state;
    const getExpanderRowbByParentId = parent => rows.find(r => r.id === parent);
    const firstCellIndex = calcFirstCellIndex(selectableRows, expandableRows);

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
            key={row[this.props.keyField] || index}
            striped={striped}
            highlightOnHover={highlightOnHover}
            pointerOnHover={pointerOnHover}
            columns={this.columns}
            rows={this.state.rows}
            row={row}
            index={index}
            keyField={keyField}
            onRowClicked={this.handleRowClicked}
            checkboxComponent={selectableRowsComponent}
            checkboxComponentOptions={selectableRowsComponentProps}
            onRowSelected={this.handleRowChecked}
            selectableRows={selectableRows}
            selectedRows={this.state.selectedRows}
            expandableRows={expandableRows}
            onToggled={this.toggleExpand}
            firstCellIndex={firstCellIndex}
          />
        );
      })
    );
  }

  renderTableHead() {
    const {
      selectableRows,
      selectableRowsComponent,
      selectableRowsComponentProps,
      expandableRows,
    } = this.props;

    const {
      selectedRows,
      allSelected,
    } = this.state;

    const isIndeterminate = selectedRows.length > 0 && !allSelected;

    return (
      <TableHead>
        <TableHeadRow>
          {selectableRows &&
            <TableColCheckbox
              onClick={this.handleSelectAll}
              checked={allSelected}
              checkboxComponent={selectableRowsComponent}
              checkboxComponentOptions={selectableRowsComponentProps}
              indeterminate={isIndeterminate}
            />}
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
      contextActions,
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
    } = this.props;

    const {
      rows,
      selectedCount,
    } = this.state;

    const theme = merge(defaultTheme, customTheme);

    return (
      <ThemeProvider theme={theme}>
        <ResponsiveWrapper
          responsive={responsive}
          className={className}
          style={style}
          overflowYOffset={overflowYOffset}
          overflowY={overflowY}
        >
          {!noHeader &&
            <TableHeader
              title={title}
              showContextMenu={selectedCount > 0}
              contextTitle={this.generateDefaultContextTitle()}
              contextActions={contextActions}
              actions={actions}
            />}

          <TableWrapper>
            {progressPending &&
              <ProgressWrapper
                component={progressComponent}
                centered={progressCentered}
              />}

            {!rows.length > 0 && !progressPending &&
              <NoData component={noDataComponent} />}

            {rows.length > 0 &&
              <Table disabled={disabled}>
                {this.renderTableHead()}

                <TableBody>
                  {this.renderRows()}
                </TableBody>
              </Table>}
          </TableWrapper>
        </ResponsiveWrapper>
      </ThemeProvider>
    );
  }
}

export default DataTable;
