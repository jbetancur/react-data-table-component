import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Cell } from './Cell';
import { getProperty } from './util';

const TableCellStyle = styled(Cell)`
  font-size: ${props => props.theme.rows.fontSize};
  font-weight: 400;
  min-height: ${props => props.theme.rows.height};

  div:first-child {
    white-space: ${props => (props.column.wrap ? 'normal' : 'nowrap')};
    overflow: ${props => (props.column.allowOverflow ? 'visible' : 'hidden')};
    text-overflow: ellipsis;
  }
`;

const TableCell = memo(({ id, column, row }) => {
  // apply a tag that TableRow will use to stop event propogation when TableCell is clicked
  const dataTag = column.ignoreRowClick || column.button ? null : '___react-data-table-allow-propagation___';

  return (
    <TableCellStyle id={id} column={column} data-tag={dataTag} className="rdt_TableCell">
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
