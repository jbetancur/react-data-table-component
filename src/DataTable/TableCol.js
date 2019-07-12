import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Cell } from './Cell';
import { DataTableContext } from './DataTableContext';

const nativeSortASC = css`
  content: '\\25B2';
`;

const nativeSortDESC = css`
  content: '\\25BC';
`;

const activeColCSS = css`
  font-weight: 600;
  color: ${props => props.theme.header.fontColorActive};
`;

const TableColStyle = styled(Cell)`
  user-select: none;
  font-size: ${props => props.theme.header.fontSize};
  font-weight: 500;
  white-space: nowrap;
  min-height: ${props => props.theme.header.height};
  color: ${props => props.theme.header.fontColor};
`;

const ColumnSortable = styled.div`
  display: inline-flex;
  align-items: center;
  height: 100%;

  span {
    line-height: 1;
    display: inline-flex;
    align-items: center;
    ${props => props.sortActive && activeColCSS};

    &:hover {
      ${({ column }) => column.sortable && 'cursor: pointer'};
    }

    ${({ column, sortActive, sortDirection, sortIcon }) => sortActive && !sortIcon &&
    (column.right
      ? css`
        &::before {
          padding-right: 2px;
          ${sortDirection === 'asc' ? nativeSortASC : nativeSortDESC};
        }`
      : css`
        &::after {
          padding-left: 2px;
          ${sortDirection === 'asc' ? nativeSortASC : nativeSortDESC};
        }
      `)};
  }
`;

const SortIcon = styled.span`
  line-height: 1;
  user-select: none;

  i,
  svg {
    color: inherit;
    font-size: 18px !important;
    height: 18px !important;
    width: 18px !important;
    flex-grow: 0;
    flex-shrink: 0;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    transition-duration: 150ms;
    transition-property: transform;
  }

  &.asc i,
  &.asc svg {
    padding-right: 4px;
    transform: rotate(180deg);
  }
`;

class TableCol extends PureComponent {
  static propTypes = {
    onColumnClick: PropTypes.func.isRequired,
    column: PropTypes.object.isRequired,
  };

  static contextType = DataTableContext;

  onColumnClick = e => {
    const { column, onColumnClick } = this.props;
    const { sortDirection } = this.context;

    onColumnClick(column, sortDirection, e);
  }

  renderCustomSortIcon() {
    const { sortIcon, sortDirection } = this.context;

    return (
      <SortIcon className={sortDirection}>
        {sortIcon}
      </SortIcon>
    );
  }

  render() {
    const { column } = this.props;
    const { sortIcon, sortColumn, sortDirection, internalCell } = this.context;
    const sortActive = column.sortable && sortColumn === column.selector;
    const customSortIconLeft = sortActive && sortIcon && !column.right;
    const customSortIconRight = sortActive && sortIcon && column.right;

    return (
      <TableColStyle
        className="rdt_TableCol"
        column={column} // required by Cell.js
        internalCell={internalCell} // required by Cell.js
      >
        {column.name && (
          <ColumnSortable
            id={`column-${column.selector}`}
            onClick={this.onColumnClick}
            sortActive={sortActive}
            sortDirection={sortDirection}
            sortIcon={sortIcon}
            column={column}
          >
            {customSortIconRight && this.renderCustomSortIcon()}
            <span>
              {column.name}
            </span>
            {customSortIconLeft && this.renderCustomSortIcon()}
          </ColumnSortable>
        )}
      </TableColStyle>
    );
  }
}

export default TableCol;
