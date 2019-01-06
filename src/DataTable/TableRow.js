import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import { DataTableConsumer } from './DataTableContext';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import { determineExpanderRowIdentifier } from './util';

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
    row: PropTypes.object.isRequired,
    onRowClicked: PropTypes.func.isRequired,
    onRowSelected: PropTypes.func.isRequired,
  };

  handleRowSelected = row => {
    const { onRowSelected } = this.props;

    onRowSelected(row);
  }

  handleRowClick = e => {
    // use event delegation allow events to propogate only when the element with data-tag __react-data-table--click-clip___ is present
    if (e.target && e.target.getAttribute('data-tag') === '___react-data-table--click-clip___') {
      const { onRowClicked, row } = this.props;

      onRowClicked(row, e);
    }
  };

  isChecked = (row, selectedRows) => selectedRows.some(srow => srow === row);

  isExpandedRow = (row, rows, keyField) => {
    const rowIdentifier = determineExpanderRowIdentifier(row, keyField);

    return rows.findIndex(r => rowIdentifier === r.parent) > -1;
  }

  render() {
    const {
      row,
      onRowClicked,
    } = this.props;

    return (
      <DataTableConsumer>
        {({ keyField, columns, rows, selectedRows, selectableRows, expandableRows, striped, highlightOnHover, pointerOnHover }) => (
          <TableRowStyle
            striped={striped}
            highlightOnHover={highlightOnHover}
            pointerOnHover={pointerOnHover}
            onClick={this.handleRowClick}
          >
            {selectableRows && (
              <TableCellCheckbox
                checked={this.isChecked(row, selectedRows)}
                onClick={this.handleRowSelected}
                row={row}
              />
            )}

            {expandableRows && (
              <TableCellExpander
                expanded={this.isExpandedRow(row, rows, keyField)}
                row={row}
              />
            )}

            {columns.map(col => (
              <TableCell
                type="cell"
                key={`cell-${col.id}-${row[keyField]}`}
                column={col}
                row={row}
                rowClickable={!!onRowClicked}
              />
            ))}
          </TableRowStyle>
        )}
      </DataTableConsumer>
    );
  }
}

export default withTheme(TableRow);
