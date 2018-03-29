import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { getProperty } from './util';

const TableCellStyle = styled.td`
  box-sizing: border-box;
  vertical-align: middle;
  line-height: normal;
  white-space: nowrap;
  font-size: ${props => props.theme.rows.fontSize};
  font-weight: 400;
  color: ${props => props.theme.rows.fontColor};
  height: ${props => props.theme.rows.height};
  width: ${props => props.column.width};
  ${props => props.column.number && 'text-align: right'};
  ${props => props.column.center && 'text-align: center'};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 2);
  padding-right: calc(${props => props.theme.cells.cellPadding} / 2);

  &:nth-child(n+2) {
    padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
  }

  ${props => props.column.compact && 'padding: 0'};
`;

class TableCell extends PureComponent {
  static propTypes = {
    column: PropTypes.object,
    row: PropTypes.object,
  };

  static defaultProps = {
    column: {},
    row: {},
  };

  handleCellClick = e => {
    const { column } = this.props;

    if (column.ignoreRowClick) {
      e.stopPropagation();
    }
  };

  render() {
    const {
      column,
      row,
    } = this.props;

    return (
      <TableCellStyle
        column={column}
        onClick={this.handleCellClick}
      >
        {column.cell ? column.cell(row) : getProperty(row, column.selector, column.format)}
      </TableCellStyle>
    );
  }
}

export default withTheme(TableCell);
