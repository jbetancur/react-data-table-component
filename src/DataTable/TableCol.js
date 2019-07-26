import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Cell } from './Cell';
import { DataTableStateContext } from './DataTableContext';
import NativeSortIcon from '../icons/NativeSortIcon';

const activeColCSS = css`
  color: ${props => props.theme.header.fontColorActive};
`;

const TableColStyle = styled(Cell)`
  min-height: ${props => props.theme.header.height};
`;

const ColumnSortable = styled.div`
  color: ${props => props.theme.header.fontColor};
  font-size: ${props => props.theme.header.fontSize};
  font-weight: ${props => props.theme.header.fontWeight};
  display: inline-flex;
  align-items: center;
  height: 100%;
  line-height: 1;
  user-select: none;
  ${props => props.sortActive && activeColCSS};

  span.__rdt_custom_sort_icon__ {
    i,
    svg {
      ${props => (props.sortActive ? 'opacity: 1' : 'opacity: 0')};
      color: inherit;
      font-size: 18px !important;
      height: 18px !important;
      width: 18px !important;
      backface-visibility: hidden;
      transform-style: preserve-3d;
      transition-duration: 125ms;
      transition-property: transform;
    }

    &.asc i,
    &.asc svg {
      transform: rotate(180deg);
    }
  }

  &:hover {
    ${({ column }) => column.sortable && 'cursor: pointer'};
    ${({ column }) => column.sortable && activeColCSS};
    ${({ sortActive, column }) => !sortActive && column.sortable && 'opacity: 1'};

    span,
    span.__rdt_custom_sort_icon__ * {
      ${({ sortActive, column }) => !sortActive && column.sortable && 'opacity: 0.60'};
    }
  }
`;


const TableCol = ({
  column,
  onColumnClick,
  sortIcon,
}) => {
  const { sortColumn, sortDirection } = useContext(DataTableStateContext);

  const handleColumnClick = e => {
    onColumnClick(column, sortDirection, e);
  };

  const renderNativeSortIcon = sortActive => (
    <NativeSortIcon
      column={column}
      sortActive={sortActive}
      sortDirection={sortDirection}
    />
  );

  const renderCustomSortIcon = () => (
    <span className={[sortDirection, '__rdt_custom_sort_icon__'].join(' ')}>
      {sortIcon}
    </span>
  );

  const sortActive = column.sortable && sortColumn === column.selector;
  const nativeSortIconLeft = !sortIcon && !column.right;
  const nativeSortIconRight = !sortIcon && column.right;
  const customSortIconLeft = sortIcon && !column.right;
  const customSortIconRight = sortIcon && column.right;

  return (
    <TableColStyle
      className="rdt_TableCol"
      column={column} // required by Cell.js
    >
      {column.name && (
        <ColumnSortable
          id={`column-${column.selector}`}
          role="button"
          className="rdt_TableCol_Sortable"
          onClick={handleColumnClick}
          sortActive={sortActive}
          column={column}
        >
          {customSortIconRight && renderCustomSortIcon()}
          {nativeSortIconRight && renderNativeSortIcon(sortActive)}
          <div>
            {column.name}
          </div>
          {customSortIconLeft && renderCustomSortIcon()}
          {nativeSortIconLeft && renderNativeSortIcon(sortActive)}
        </ColumnSortable>
      )}
    </TableColStyle>
  );
};

TableCol.propTypes = {
  onColumnClick: PropTypes.func.isRequired,
  column: PropTypes.object.isRequired,
  sortIcon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default TableCol;
