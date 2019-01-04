import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import { DataTableConsumer } from './DataTableContext';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import { isExpandedRow } from './util';

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
    index: PropTypes.number.isRequired,
    onRowClicked: PropTypes.func.isRequired,
    onRowSelected: PropTypes.func.isRequired,
    onToggled: PropTypes.func.isRequired,
  };

  handleRowChecked = row => {
    const { onRowSelected } = this.props;

    if (onRowSelected) {
      onRowSelected(row);
    }
  }

  handleRowClick = e => {
    const { index, onRowClicked, row } = this.props;

    // use event delegation allow events to propogate only when the element with data-tag __react-data-table--click-clip___ is present
    if (e.target && e.target.getAttribute('data-tag') === '___react-data-table--click-clip___') {
      onRowClicked(row, index, e);
    }
  };

  isChecked = (rows, selectedRows) => {
    const { index } = this.props;

    return selectedRows.indexOf(rows[index]) > -1;
  }

  render() {
    const {
      row,
      index,
      onToggled,
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
                checked={this.isChecked(rows, selectedRows)}
                onClick={this.handleRowChecked}
                row={row}
              />
            )}

            {expandableRows && (
              <TableCellExpander
                onToggled={onToggled}
                expanded={isExpandedRow(row, rows, keyField)}
                row={row}
                index={index}
              />
            )}

            {columns.map(col => (
              <TableCell
                type="cell"
                key={`cell-${col.id}-${row[keyField] || index}`}
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
