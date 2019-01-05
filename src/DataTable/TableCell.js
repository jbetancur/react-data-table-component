import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import { DataTableConsumer } from './DataTableContext';
import { getProperty } from './util';

const TableCellStyle = styled.div`
  position: relative;
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
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: calc(${props => props.theme.cells.cellPadding} / 2);
  padding-right: calc(${props => props.theme.cells.cellPadding} / 2);
  ${props => props.firstCellIndex > 0 && css`
    &:nth-child(${props.firstCellIndex + 1}) {
      padding-left: calc(${props.theme.cells.cellPadding} / 6);
    }
  `};
  ${props => props.column.compact && `padding: calc(${props.theme.cells.cellPadding} / 8)`};
`;

const ClickClip = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const TableCell = memo(({
  column,
  row,
  rowClickable,
}) => (
  <DataTableConsumer>
    {({ firstCellIndex }) => (
      <TableCellStyle
        column={column}
        firstCellIndex={firstCellIndex}
      >
        {!column.ignoreRowClick && rowClickable && <ClickClip data-tag="___react-data-table--click-clip___" />}
        <div className="react-data-table--cell-content">
          {column.cell ? column.cell(row) : getProperty(row, column.selector, column.format)}
        </div>
      </TableCellStyle>
    )}
  </DataTableConsumer>
));

TableCell.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  rowClickable: PropTypes.bool,
};

TableCell.defaultProps = {
  column: {},
  row: {},
  rowClickable: false,
};

export default withTheme(TableCell);
