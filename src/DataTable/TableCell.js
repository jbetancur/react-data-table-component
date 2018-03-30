import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import { getProperty } from './util';

const TableCellStyle = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: ${props => (props.column.grow === 0 ? 0 : props.column.grow || 1)} 0 0;
  align-items: center;
  max-width: ${props => props.column.maxWidth || '100%'};
  min-width: ${props => (props.column.minWidth || '100px')};
  ${props => props.column.width && css`
    min-width: ${props.column.width};
    max-width: ${props.column.width};
  `};
  line-height: normal;
  font-size: ${props => props.theme.rows.fontSize};
  font-weight: 400;
  white-space: ${props => (props.column.wrap ? 'normal' : 'nowrap')};

  .react-data-table--cell-content {
    overflow: ${props => (props.column.allowOverflow ? 'visible' : 'hidden')};
    text-overflow: ellipsis;
  }

  color: ${props => props.theme.rows.fontColor};
  min-height: ${props => props.theme.rows.height};
  ${props => props.column.right && 'justify-content: flex-end'};
  ${props => props.column.center && 'justify-content: center'};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 2);
  padding-right: calc(${props => props.theme.cells.cellPadding} / 2);
  ${props => props.firstCellIndex > 0 && css`
    &:nth-child(${props.firstCellIndex + 1}) {
      padding-left: calc(${props.theme.cells.cellPadding} / 6);
    }
  `};
  ${props => props.column.compact && `padding: calc(${props.theme.cells.cellPadding} / 8)`};
`;

class TableCell extends PureComponent {
  static propTypes = {
    column: PropTypes.object,
    row: PropTypes.object,
    firstCellIndex: PropTypes.number,
  };

  static defaultProps = {
    column: {},
    row: {},
    firstCellIndex: 0,
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
      firstCellIndex,
    } = this.props;

    return (
      <TableCellStyle
        column={column}
        onClick={this.handleCellClick}
        firstCellIndex={firstCellIndex}
      >
        <div className="react-data-table--cell-content">
          {column.cell ? column.cell(row) : getProperty(row, column.selector, column.format)}
        </div>
      </TableCellStyle>
    );
  }
}

export default withTheme(TableCell);
