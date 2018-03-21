import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import Checkbox from './Checkbox';

const TableColStyle = styled.th`
  box-sizing: border-box;
  vertical-align: middle;
  user-select: none;
  font-weight: 500;
  white-space: nowrap;
  height: ${props => props.theme.header.height};
  font-size: ${props => props.theme.header.fontSize};
  color: ${props => props.theme.header.fontColor};
  width: ${props => props.width};
  ${props => props.column.number && 'text-align: right'};
  ${props => props.column.center && 'text-align: center'};
  ${props => props.sortable && 'cursor: pointer'};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 2);
  padding-right: calc(${props => props.theme.cells.cellPadding} / 2);

  &:first-child {
    padding-left: ${props => props.theme.cells.firstCellPadding};
    ${props => props.type === 'checkbox' && 'padding-left: 8px'};
    ${props => props.type === 'checkbox' && 'padding-right: 0'};
  }

  &:nth-child(2) {
    /* when compact or expander is not first child (table is selectable) */
    ${props => props.type !== 'checkbox' && 'padding-left: 8px'};
  }

  ${props => props.column.compact && 'padding: 0'};

  &:last-child {
    padding-right: ${props => props.theme.cells.lastCellPadding};
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
    sortable: PropTypes.bool,
    sortDirection: PropTypes.oneOf(['asc', 'desc']),
    sortIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    type: PropTypes.oneOf(['checkbox', 'column']),
    checkboxComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    checkboxComponentOptions: PropTypes.object,
    checked: PropTypes.bool,
    indeterminate: PropTypes.bool,
    onClick: PropTypes.func,
    width: PropTypes.string,
  };

  static defaultProps = {
    onColumnClick: () => {},
    column: {},
    sortable: false,
    sortDirection: 'asc',
    sortIcon: false,
    type: 'column',
    checkboxComponent: null,
    checkboxComponentOptions: {},
    checked: false,
    indeterminate: false,
    onClick: null,
    width: 'auto',
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

  renderChildren() {
    const {
      type,
      column,
      checked,
      checkboxComponent,
      checkboxComponentOptions,
      indeterminate,
      onClick,
      sortable,
      sortIcon,
      sortDirection,
    } = this.props;

    if (type === 'checkbox') {
      return (
        <Checkbox
          name="select-all-rows"
          component={checkboxComponent}
          componentOptions={checkboxComponentOptions}
          onClick={onClick}
          checked={checked}
          indeterminate={indeterminate}
          aria-label="select-all-rows"
        />
      );
    }

    return (
      column.name ?
        <ColumnCellWrapper>
          {sortable && sortIcon &&
          <SortIcon className={sortDirection === 'asc' ? 'asc' : 'desc'}>
            {sortIcon}
          </SortIcon>}
          {column.name}
        </ColumnCellWrapper> : null
    );
  }

  render() {
    const {
      column,
      width,
      sortable,
      sortIcon,
      sortDirection,
      type,
    } = this.props;

    return (
      <TableColStyle
        onClick={this.onColumnClick}
        sortable={sortable}
        sortDirection={sortDirection}
        sortIcon={sortIcon}
        type={type}
        column={column}
        width={width}
      >
        {this.renderChildren()}
      </TableColStyle>
    );
  }
}

export default withTheme(TableCol);
