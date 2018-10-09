import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';

const TableColStyle = styled.div`
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
  white-space: nowrap;
  font-size: ${props => props.theme.header.fontSize};
  user-select: none;
  font-weight: 500;
  color: ${props => props.theme.header.fontColor};
  min-height: ${props => props.theme.header.height};
  ${props => props.sortable && 'cursor: pointer'};
  ${props => props.column.right && 'justify-content: flex-end'};
  ${props => props.column.center && 'justify-content: center'};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 2);
  padding-right: calc(${props => props.theme.cells.cellPadding} / 2);
  ${props => props.firstCellIndex > 0 && css`
    &:nth-child(${props.firstCellIndex + 1}) {
      padding-left: calc(${props.theme.cells.cellPadding} / 6);
    }
  `};
  ${props => props.column.compact && `padding: calc(${props.theme.cells.cellPadding} / 8)`};

  &::before {
    font-size: 12px;
    padding-right: 4px;
  }

  /* default sorting when no icon is specified */
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
    sortField: PropTypes.string,
    sortDirection: PropTypes.oneOf(['asc', 'desc']),
    sortIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    firstCellIndex: PropTypes.number,
  };

  static defaultProps = {
    onColumnClick: () => {},
    column: {},
    sortField: null,
    sortDirection: 'asc',
    sortIcon: false,
    firstCellIndex: 0,
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
      sortIcon,
      sortDirection,
      sortField,
      firstCellIndex,
    } = this.props;

    const sortable = column.sortable && sortField === column.selector;

    return (
      <TableColStyle
        onClick={this.onColumnClick}
        sortable={sortable}
        sortDirection={sortDirection}
        sortIcon={sortIcon}
        column={column}
        firstCellIndex={firstCellIndex}
      >
        {column.name &&
          <ColumnCellWrapper active={sortable}>
            {sortable && sortIcon &&
              <SortIcon className={sortDirection === 'asc' ? 'asc' : 'desc'}>
                {sortIcon}
              </SortIcon>}
            {column.name}
          </ColumnCellWrapper>}
      </TableColStyle>
    );
  }
}

export default withTheme(TableCol);
