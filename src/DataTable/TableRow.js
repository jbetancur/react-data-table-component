import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import { determineExpanderRowIdentifier, isExpandedRow } from './util';

const TableRowStyle = styled.div`
  display: flex;
  width: 100%;
  border-top: 1px solid ${props => props.theme.rows.borderColor};
  ${props => props.striped && css`
      &:nth-child(odd) {
        background-color: ${props.theme.rows.stripedColor};
      }
  `};
  ${props => props.highlightOnHover && css`
      &:hover {
        background-color: ${props.theme.rows.hoverColor};
        transition-duration: 0.15s;
        transition-property: background-color;
      }
  `};
  ${props => props.pointerOnHover && css`
      &:hover {
        cursor: pointer;
      }
  `};
`;

class TableRow extends PureComponent {
  static propTypes = {
    striped: PropTypes.bool.isRequired,
    highlightOnHover: PropTypes.bool.isRequired,
    pointerOnHover: PropTypes.bool.isRequired,
    columns: PropTypes.array.isRequired,
    keyField: PropTypes.string.isRequired,
    row: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onRowClicked: PropTypes.func.isRequired,
    rowClickable: PropTypes.bool,
    onRowSelected: PropTypes.func.isRequired,
    selectedRows: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    checkboxComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]).isRequired,
    checkboxComponentOptions: PropTypes.object.isRequired,
    selectableRows: PropTypes.bool.isRequired,
    expandableRows: PropTypes.bool.isRequired,
    onToggled: PropTypes.func.isRequired,
    firstCellIndex: PropTypes.number.isRequired,
  };

  static defaultProps = {
    rowClickable: false,
  }

  isExpanded = () => {
    const rowIdentifier = determineExpanderRowIdentifier(this.props.row, this.props.keyField);
    return this.props.rows.findIndex(r => rowIdentifier === r.parent) > -1;
  }

  handleRowChecked = r => this.props.onRowSelected && this.props.onRowSelected(r);

  handleRowClick = e => {
    // use event delegation allow events to propogate only when the element with data-tag __react-data-table--click-clip___ is present
    if (e.target && e.target.getAttribute('data-tag') === '___react-data-table--click-clip___') {
      this.props.onRowClicked(this.props.row, this.props.index, e);
    }
  };

  isChecked = () => this.props.selectedRows.indexOf(this.props.rows[this.props.index]) > -1;

  render() {
    const {
      striped,
      highlightOnHover,
      pointerOnHover,
      columns,
      keyField,
      row,
      rows,
      index,
      checkboxComponent,
      checkboxComponentOptions,
      selectableRows,
      expandableRows,
      onToggled,
      firstCellIndex,
      rowClickable,
    } = this.props;

    return (
      <TableRowStyle
        striped={striped}
        highlightOnHover={highlightOnHover}
        pointerOnHover={pointerOnHover}
        onClick={this.handleRowClick}
      >
        {selectableRows &&
        <TableCellCheckbox
          checked={this.isChecked()}
          checkboxComponent={checkboxComponent}
          checkboxComponentOptions={checkboxComponentOptions}
          onClick={this.handleRowChecked}
          row={row}
        />}
        {expandableRows &&
        <TableCellExpander
          onToggled={onToggled}
          expanded={isExpandedRow(row, rows, keyField)}
          row={row}
          index={index}
        />}
        {columns.map(col => (
          <TableCell
            type="cell"
            key={`cell-${col.id}-${row[keyField] || index}`}
            column={col}
            row={row}
            firstCellIndex={firstCellIndex}
            rowClickable={rowClickable}
          />))}
      </TableRowStyle>
    );
  }
}

export default withTheme(TableRow);
