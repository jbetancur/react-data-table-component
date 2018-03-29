import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';

const TableColStyle = styled.th`
  box-sizing: border-box;
  vertical-align: middle;
  line-height: normal;
  white-space: nowrap;
  font-size: ${props => props.theme.header.fontSize};
  user-select: none;
  font-weight: 500;
  color: ${props => props.theme.header.fontColor};
  height: ${props => props.theme.header.height};
  width: ${props => props.column.width};
  ${props => props.sortable && 'cursor: pointer'};
  ${props => props.column.number && 'text-align: right'};
  ${props => props.column.center && 'text-align: center'};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 2);
  padding-right: calc(${props => props.theme.cells.cellPadding} / 2);

  &:nth-child(n+2) {
    padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
  }

  &::before {
    font-size: 12px;
    padding-right: 4px;
    padding-bottom: 5px;
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
  };

  static defaultProps = {
    onColumnClick: () => {},
    column: {},
    sortField: null,
    sortDirection: 'asc',
    sortIcon: false,
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
    } = this.props;

    const sortable = column.sortable && sortField === column.selector;

    return (
      <TableColStyle
        onClick={this.onColumnClick}
        sortable={sortable}
        sortDirection={sortDirection}
        sortIcon={sortIcon}
        column={column}
      >
        {column.name ?
          <ColumnCellWrapper>
            {sortable && sortIcon &&
              <SortIcon className={sortDirection === 'asc' ? 'asc' : 'desc'}>
                {sortIcon}
              </SortIcon>}
            {column.name}
          </ColumnCellWrapper> : null}
      </TableColStyle>
    );
  }
}

export default withTheme(TableCol);
