import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Cell } from './Cell';
import { getProperty, getConditionalStyle } from './util';

const TableCellStyle = styled(Cell)`
  font-size: ${props => props.theme.rows.fontSize};
  font-weight: 400;

  div:first-child {
    white-space: ${props => (props.column.wrap ? 'normal' : 'nowrap')};
    overflow: ${props => (props.column.allowOverflow ? 'visible' : 'hidden')};
    text-overflow: ellipsis;
  }

  ${props => props.column.style};
  ${props => props.extendedCellStyle};
`;

const TableCell = memo(({ id, index, column, row }) => {
  // apply a tag that TableRow will use to stop event propagation when TableCell is clicked
  const dataTag = column.ignoreRowClick || column.button ? null : '___react-data-table-allow-propagation___';
  const extendedCellStyle = getConditionalStyle(row, column.conditionalCellStyles);

  return (
    <TableCellStyle
      role="cell"
      aria-colindex={index}
      id={id}
      column={column}
      data-tag={dataTag}
      className="rdt_TableCell"
      extendedCellStyle={extendedCellStyle}
    >
      {!column.cell && (
        <div data-tag={dataTag}>
          {getProperty(row, column.selector, column.format)}
        </div>
      )}
      {column.cell && column.cell(row)}
    </TableCellStyle>
  );
});

TableCell.propTypes = {
  id: PropTypes.string.isRequired,
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
};

export default TableCell;
