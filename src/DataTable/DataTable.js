import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import orderBy from 'lodash/orderBy';
import pullAllBy from 'lodash/pullAllBy';
import merge from 'lodash/merge';
import shortid from 'shortid';
import Table from './Table';
import TableHead from './TableHead';
import TableRow from './TableRow';
import TableCol from './TableCol';
import TableCell from './TableCell';
import ExpanderRow from './ExpanderRow';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import ResponsiveWrapper from './ResponsiveWrapper';
import ProgressWrapper from './ProgressWrapper';
import TableWrapper from './TableWrapper';
import NoData from './NoData';
import { decorateColumns, insertItem, removeItem, countIfOne, getSortDirection } from './util';
import defaultTheme from '../themes/default';

class DataTable extends PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    selectableRows: PropTypes.bool,
    expandableRows: PropTypes.bool,
    keyField: PropTypes.string,
    progressPending: PropTypes.bool,
    progressComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]),
    progressCentered: PropTypes.bool,
    expanderStateKeyField: PropTypes.string,
    expanderStateField: PropTypes.string,
    expandableRowsComponent: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.func,
    ]),
    selectableRowsComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]),
    selectableRowsComponentProps: PropTypes.object,
    customTheme: PropTypes.object,
    sortIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    striped: PropTypes.bool,
    highlightOnHover: PropTypes.bool,
    onServerSort: PropTypes.func,
    contextTitle: PropTypes.string,
    contextActions: PropTypes.arrayOf(PropTypes.node),
    onTableUpdate: PropTypes.func,
    clearSelectedRows: PropTypes.bool,
    defaultSortField: PropTypes.string,
    defaultSortAsc: PropTypes.bool,
    columns: PropTypes.array,
    data: PropTypes.array,
    className: PropTypes.string,
    style: PropTypes.object,
    responsive: PropTypes.bool,
    overflowY: PropTypes.bool,
    overflowYOffset: PropTypes.string,
    noDataComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]),
  };

  static defaultProps = {
    title: '',
    keyField: 'id',
    selectableRows: false,
    expandableRows: false,
    progressPending: false,
    progressComponent: <h2>Loading...</h2>,
    progressCentered: false,
    expanderStateKeyField: 'id',
    expanderStateField: '$$expander',
    expandableRowsComponent: <div>Add a custom expander component. Use props.data for row data</div>,
    selectableRowsComponent: 'input',
    selectableRowsComponentProps: {},
    customTheme: {},
    sortIcon: false,
    striped: false,
    highlightOnHover: false,
    onServerSort: null,
    contextTitle: '',
    contextActions: [],
    onTableUpdate: null,
    clearSelectedRows: false,
    defaultSortField: null,
    defaultSortAsc: true,
    columns: [],
    data: [],
    className: null,
    style: {},
    responsive: true,
    overflowY: false,
    overflowYOffset: '250px',
    noDataComponent: 'There are no records to display',
  };

  constructor(props) {
    super(props);

    const sortDirection = getSortDirection(props.defaultSortAsc);
    // only initially sort rows if initial sort field is provided
    const sortedRows = props.defaultSortField ?
      orderBy(props.data, props.defaultSortField, sortDirection) : props.data;

    this.state = {
      allSelected: false,
      selectedCount: 0,
      selectedRows: [],
      sortColumn: props.defaultSortField,
      sortDirection,
      rows: sortedRows,
      columns: decorateColumns(props.columns),
    };
  }

  componentWillReceiveProps(nextProps) {
    // allow clearing of rows via passed clearSelectedRows prop
    if (nextProps.clearSelectedRows !== this.props.clearSelectedRows) {
      this.setState(() => ({
        allSelected: false,
        selectedCount: 0,
        selectedRows: [],
      }));
    }

    // Keep data state in sync if it changes
    if (nextProps.data !== this.props.data) {
      this.setState(state => ({ rows: orderBy(nextProps.data, state.sortColumn, state.sortDirection) }));
    }

    // Keep columns state in sync if it changes
    if (nextProps.columns !== this.props.columns) {
      this.setState({ columns: decorateColumns(nextProps.columns) });
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

  calculateSelectedItems() {
    const { contextTitle } = this.props;
    const { selectedCount } = this.state;

    return contextTitle || `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`;
  }

  handleSelectAll = () => {
    this.setState(state => {
      const allSelected = !state.allSelected;

      return {
        allSelected,
        selectedCount: allSelected ? this.state.rows.length : 0,
        selectedRows: allSelected ? this.state.rows : [],
      };
    });
  }

  handleRowChecked = row => {
    if (this.state.selectedRows.find(r => r === row)) {
      this.setState(state => ({
        selectedCount: state.selectedRows.length > 0 ? state.selectedRows.length - 1 : 0,
        allSelected: false,
        selectedRows: removeItem(state.selectedRows, row),
      }));
    } else {
      this.setState(state => ({
        selectedCount: state.selectedRows.length + 1,
        allSelected: state.selectedRows.length + 1 === state.rows.length,
        selectedRows: insertItem(state.selectedRows, row),
      }));
    }
  }

  toggleExpand = row => {
    const {
      keyField,
      expanderStateKeyField,
      expanderStateField,
    } = this.props;

    const expandedRow = this.state.rows.find(r => r[expanderStateField] && r.parent === row[this.props.expanderStateKeyField]);
    const parentRowIndex = this.state.rows.indexOf(row);

    if (expandedRow) {
      this.setState(state => ({
        rows: removeItem(state.rows, expandedRow),
      }));
    } else {
      this.setState(state => ({
        // insert a new expander row
        rows: insertItem(state.rows, {
          [expanderStateKeyField]: shortid.generate(),
          parent: row[keyField],
          [expanderStateField]: true,
        }, parentRowIndex + 1),
      }));
    }
  }

  handleSort = ({ selector, sortable }) => {
    const {
      expandableRows,
      expanderStateField,
      onServerSort,
    } = this.props;

    if (sortable) {
      this.setState(() => {
        const { sortDirection, rows } = this.state;
        const direction = sortDirection === 'asc' ? 'desc' : 'asc';
        const handleRows = () => {
          if (expandableRows) {
            const removedExpands = pullAllBy(rows, rows.filter(r => r[expanderStateField]));

            return orderBy(removedExpands, selector, direction);
          }

          return orderBy(rows, selector, direction);
        };

        return {
          sortColumn: selector,
          sortDirection: direction,
          rows: handleRows(),
        };
      });
    }

    if (sortable && onServerSort) {
      this.props.onServerSort(this.state.sortColumn, this.state.sortDirection);
    }
  }

  renderColumns() {
    const {
      sortIcon,
    } = this.props;

    return (
      this.state.columns.map(col => (
        <TableCol
          key={col.id}
          type="column"
          column={col}
          width={col.width}
          onColumnClick={this.handleSort}
          sortable={col.sortable && this.state.sortColumn === col.selector}
          sortField={this.state.sortColumn}
          sortDirection={this.state.sortDirection}
          sortIcon={sortIcon}
        />))
    );
  }

  renderRows() {
    const {
      selectableRows,
      expandableRows,
      expandableRowsComponent,
      expanderStateKeyField,
      expanderStateField,
      striped,
      highlightOnHover,
    } = this.props;

    const {
      rows,
      columns,
    } = this.state;

    const numColumns =
      columns.length + countIfOne(selectableRows) + countIfOne(expandableRows);
    const getExpanderRowbByParentId = parent => rows.find(r => r.id === parent);

    return (
      rows.map((row, index) => {
        if (row[expanderStateField]) {
          return (
            <ExpanderRow
              key={`expander--${row[expanderStateKeyField]}`}
              numColumns={numColumns}
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
          >
            {selectableRows && this.renderSelectableRows(row, index)}
            {expandableRows && this.renderExpanderCell(row, index)}
            {this.renderCells(row, index)}
          </TableRow>
        );
      })
    );
  }

  renderCells(row, index) {
    return (
      this.state.columns.map(col => (
        <TableCell
          type="cell"
          key={`cell-${col.id}-${row[this.props.keyField] || index}`}
          width={col.width}
          column={col}
          row={row}
        />)));
  }

  renderExpanderCell(row, index) {
    const getExpanderRowParentById = id => this.state.rows.find(r => id === r.parent);

    return (
      <TableCell
        width="42px"
        type="expander"
        onToggled={this.toggleExpand}
        expanded={!!getExpanderRowParentById(row[this.props.keyField])}
        row={row}
        index={index}
      />
    );
  }

  renderSelectableRows(row, index) {
    const {
      selectableRowsComponent,
      selectableRowsComponentProps,
    } = this.props;

    const isChecked = this.state.selectedRows.indexOf(this.state.rows[index]) > -1;

    return (
      <TableCell
        type="checkbox"
        width="42px"
        checked={isChecked}
        checkboxComponent={selectableRowsComponent}
        checkboxComponentOptions={selectableRowsComponentProps}
        onClick={this.handleRowChecked}
        row={row}
      />
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
        <tr>
          {selectableRows &&
            <TableCol
              type="checkbox"
              width="42px"
              onClick={this.handleSelectAll}
              checked={allSelected}
              checkboxComponent={selectableRowsComponent}
              checkboxComponentOptions={selectableRowsComponentProps}
              indeterminate={isIndeterminate}
            />}

          {expandableRows && <TableCol width="42px" />}

          {this.renderColumns()}
        </tr>
      </TableHead>
    );
  }

  render() {
    const {
      title,
      customTheme,
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
          <TableHeader
            title={title}
            showContextMenu={selectedCount > 0}
            contextTitle={this.calculateSelectedItems()}
            contextActions={contextActions}
          />

          <TableWrapper>
            {progressPending &&
              <ProgressWrapper
                component={progressComponent}
                centered={progressCentered}
              />}
            {rows.length > 0 ?
              <Table disabled={progressPending}>
                {this.renderTableHead()}

                <TableBody>
                  {this.renderRows()}
                </TableBody>
              </Table> : <NoData component={noDataComponent} />}
          </TableWrapper>
        </ResponsiveWrapper>
      </ThemeProvider>
    );
  }
}

export default DataTable;
