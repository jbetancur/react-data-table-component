import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Cell } from './Cell';
import { DataTableConsumer } from './DataTableContext';

const TableColStyle = styled(Cell)`
  font-size: ${props => props.theme.header.fontSize};
  user-select: none;
  font-weight: 500;
  white-space: nowrap;
  color: ${props => props.theme.header.fontColor};
  min-height: ${props => props.theme.header.height};
  ${props => props.sortable && 'cursor: pointer'};

  &::before {
    font-size: 12px;
    padding-right: 4px;
  }

  ${props => props.sortable && props.sortDirection === 'asc' && !props.sortIcon &&
    css`
      &::before {
        content: '\\25BC';
      }
  `};
  ${props => props.sortable && props.sortDirection === 'desc' && !props.sortIcon &&
    css`
      &::before {
        content: '\\25B2';
      }
  `};
`;

const ColumnCellWrapper = styled.div`
  margin-left: -3px;
  display: inline-flex;
  align-items: center;
  ${props => props.active && 'font-weight: 800'};
`;

const SortIcon = styled.span`
  i,
  svg {
    font-size: 18px !important;
    line-height: 24px;
    flex-grow: 0;
    flex-shrink: 0;
    transition-duration: 0.1s;
    transition-property: transform;
  }

  &.desc i,
  svg {
    transform: rotate(180deg);
  }
`;

class TableCol extends PureComponent {
  static propTypes = {
    onColumnClick: PropTypes.func,
    column: PropTypes.object,
  };

  static defaultProps = {
    onColumnClick: () => {},
    column: {},
  };

  onColumnClick = e => {
    const {
      column,
      onColumnClick,
    } = this.props;

    if (onColumnClick) {
      onColumnClick(column, e);
    }
  }

  render() {
    const {
      column,
    } = this.props;

    return (
      <DataTableConsumer>
        {({ sortIcon, sortColumn, sortDirection, internalCell }) => {
          const sortable = column.sortable && sortColumn === column.selector;

          return (
            <TableColStyle
              id={`column-${column.selector}`}
              onClick={this.onColumnClick}
              sortable={sortable}
              sortDirection={sortDirection}
              sortIcon={sortIcon}
              column={column}
              internalCell={internalCell}
            >
              {column.name && (
                <ColumnCellWrapper active={sortable}>
                  {sortable && sortIcon && (
                    <SortIcon className={sortDirection === 'asc' ? 'asc' : 'desc'}>
                      {sortIcon}
                    </SortIcon>
                  )}
                  {column.name}
                </ColumnCellWrapper>
              )}
            </TableColStyle>
          );
        }}
      </DataTableConsumer>
    );
  }
}

export default TableCol;
