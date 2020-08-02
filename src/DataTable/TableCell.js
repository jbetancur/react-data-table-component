import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Cell } from './Cell';
import { getProperty, getConditionalStyle } from './util';

const overflowCSS = css`
  div:first-child {
    white-space: ${props => (props.column.wrap ? 'normal' : 'nowrap')};
    overflow: ${props => (props.column.allowOverflow ? 'visible' : 'hidden')};
    text-overflow: ellipsis;
  }
`;

const TableCellStyle = styled(Cell)`
  font-size: ${props => props.theme.rows.fontSize};
  font-weight: 400;
  ${props => !props.column.cell && overflowCSS};
  ${props => props.column.style};
  ${props => props.extendedCellStyle};
`;

const TableCell = memo(({ id, rowIndex, column, row }) => {
  if (column.omit) {
    return null;
  }

  // apply a tag that TableRow will use to stop event propagation when TableCell is clicked
  const dataTag = column.ignoreRowClick || column.button ? null : '___react-data-table-allow-propagation___';
  const extendedCellStyle = getConditionalStyle(row, column.conditionalCellStyles);

  return (
    <TableCellStyle
      id={id}
      role="cell"
      column={column}
      data-tag={dataTag}
      className="rdt_TableCell"
      extendedCellStyle={extendedCellStyle}
    >
      {!column.cell && (
        <div data-tag={dataTag}>
          {getProperty(row, column.selector, column.format, rowIndex)}
        </div>
      )}
      {column.cell && column.cell(row, rowIndex, column, id)}
    </TableCellStyle>
  );
});

TableCell.propTypes = {
  id: PropTypes.string.isRequired,
  rowIndex: PropTypes.number.isRequired,
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
};

export default TableCell;
