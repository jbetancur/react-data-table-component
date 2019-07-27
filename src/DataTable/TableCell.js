import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Cell } from './Cell';
import { getProperty } from './util';

const TableCellStyle = styled(Cell)`
  font-size: ${props => props.theme.rows.fontSize};
  font-weight: 400;
  white-space: ${props => (props.column.wrap ? 'normal' : 'nowrap')};
  min-height: ${props => props.theme.rows.height};

  .react-data-table--cell-content {
    color: inherit;
    overflow: ${props => (props.column.allowOverflow ? 'visible' : 'hidden')};
    text-overflow: ellipsis;
  }
`;

const ClickClip = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const TableCell = memo(({ column, row, rowClickable }) => (
  <TableCellStyle column={column} className="rdt_TableCell">
    {!column.ignoreRowClick && rowClickable && (
      <ClickClip data-tag="___react-data-table--click-clip___" />
    )}

    <div className="react-data-table--cell-content">
      {column.cell ? column.cell(row) : getProperty(row, column.selector, column.format)}
    </div>
  </TableCellStyle>
));

TableCell.propTypes = {
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  rowClickable: PropTypes.bool,
};

TableCell.defaultProps = {
  rowClickable: false,
};

export default TableCell;
