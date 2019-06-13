import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Cell } from './Cell';
import { DataTableConsumer } from './DataTableContext';

const TableColStyle = styled(Cell)`
  font-size: ${props => props.theme.header.fontSize};
  user-select: none;
  font-weight: 500;
  font-size: .9rem;
  white-space: nowrap;
  color: ${props => props.theme.header.fontColor};
  min-height: ${props => props.theme.header.height};
  ${props => props.sortable && 'cursor: pointer'};

  &::before {
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
  display: inline-flex;
  align-items: center;
  ${props => props.active && 'font-weight: 800'};
`;

const SortIcon = styled.span`
  line-height: 1;

  i,
  svg {
    font-size: 18px !important;
    height: 18px !important;
    width: 18px !important;
    flex-grow: 0;
    flex-shrink: 0;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    transition-duration: 0.1s;
    transition-property: transform;
  }

  &.desc i,
  &.desc svg {
    transform: rotate(180deg);
  }
`;

class TableCol extends PureComponent {
  static propTypes = {
    onColumnClick: PropTypes.func.isRequired,
    column: PropTypes.object.isRequired,
  };

  onColumnClick = e => {
    const {
      column,
      onColumnClick,
    } = this.props;

    onColumnClick(column, e);
  }

  render() {
    const { column } = this.props;

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
              className="rdt_TableCol"
            >
              {column.name && (
                <ColumnCellWrapper active={sortable}>
                  {sortable && sortIcon && (
                    <SortIcon className={sortDirection}>
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
