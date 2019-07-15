import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Cell } from './Cell';
import { DataTableContext } from './DataTableContext';
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

class TableCol extends PureComponent {
  static propTypes = {
    onColumnClick: PropTypes.func.isRequired,
    column: PropTypes.object.isRequired,
    sortIcon: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]).isRequired,
  };

  static contextType = DataTableContext;

  onColumnClick = e => {
    const { column, onColumnClick } = this.props;
    const { sortDirection } = this.context;

    onColumnClick(column, sortDirection, e);
  }

  renderNativeSortIcon(sortActive) {
    const { column } = this.props;
    const { sortDirection } = this.context;

    return (
      <NativeSortIcon
        column={column}
        sortActive={sortActive}
        sortDirection={sortDirection}
      />
    );
  }

  renderCustomSortIcon() {
    const { sortIcon } = this.props;
    const { sortDirection } = this.context;

    return (
      <span className={[sortDirection, '__rdt_custom_sort_icon__'].join(' ')}>
        {sortIcon}
      </span>
    );
  }

  render() {
    const { column, sortIcon } = this.props;
    const { sortColumn } = this.context;
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
            onClick={this.onColumnClick}
            sortActive={sortActive}
            column={column}
          >
            {customSortIconRight && this.renderCustomSortIcon()}
            {nativeSortIconRight && this.renderNativeSortIcon(sortActive)}
            <div>
              {column.name}
            </div>
            {customSortIconLeft && this.renderCustomSortIcon()}
            {nativeSortIconLeft && this.renderNativeSortIcon(sortActive)}
          </ColumnSortable>
        )}
      </TableColStyle>
    );
  }
}

export default TableCol;
