import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import Checkbox from './Checkbox';
import ExpanderButton from './ExpanderButton';
import { getProperty } from './util';

const TableCellStyle = styled.td`
  box-sizing: border-box;
  vertical-align: middle;
  white-space: nowrap;
  line-height: normal;
  font-weight: 400;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
  height: ${props => props.theme.rows.height};
  width: ${props => props.width};
  ${props => props.column.number && 'text-align: right'};
  ${props => props.column.center && 'text-align: center'};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 2);
  padding-right: calc(${props => props.theme.cells.cellPadding} / 2);

  &:first-child {
    padding-left: ${props => props.theme.cells.firstCellPadding};
    ${props => props.type === 'checkbox' && 'padding-left: 8px'};
    ${props => props.type === 'checkbox' && 'padding-right: 0'};
    ${props => props.type === 'expander' && 'padding: 0'};
  }

  &:nth-child(2) {
    /* when compact or expander is not first child (table is selectable) */
    ${props => props.type === 'expander' && 'padding: 0'};
    ${props => props.type === 'cell' && 'padding-left: 8px'};
  }

  ${props => props.column.compact && 'padding: 0'};

  &:last-child {
    padding-right: ${props => props.theme.cells.lastCellPadding};
  }
`;

class TableCell extends PureComponent {
  static propTypes = {
    column: PropTypes.object,
    row: PropTypes.object,
    index: PropTypes.number,
    width: PropTypes.string,
    colSpan: PropTypes.number,
    type: PropTypes.oneOf(['checkbox', 'cell', 'expander']),
    checked: PropTypes.bool,
    checkboxComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    checkboxComponentOptions: PropTypes.object,
    onClick: PropTypes.func,
    onToggled: PropTypes.func,
    expanded: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
  };

  static defaultProps = {
    column: {},
    row: {},
    index: null,
    width: 'auto',
    colSpan: null,
    type: null,
    checkboxComponent: null,
    checked: false,
    checkboxComponentOptions: {},
    onClick: null,
    onToggled: null,
    expanded: false,
    children: null,
  };

  renderChildren() {
    const {
      column,
      row,
      type,
      checked,
      checkboxComponent,
      checkboxComponentOptions,
      onClick,
      onToggled,
      expanded,
      index,
      children,
    } = this.props;

    switch (type) {
      case 'checkbox':
        return (
          <Checkbox
            name="select-row"
            aria-label="select-row"
            component={checkboxComponent}
            componentOptions={checkboxComponentOptions}
            checked={checked}
            onClick={onClick}
            data={row}
          />
        );
      case 'cell':
        return column.cell ? column.cell(row) : getProperty(row, column.selector, column.format);
      case 'expander':
        return (
          <ExpanderButton
            onToggled={onToggled}
            data={row}
            expanded={expanded}
            index={index}
          />
        );
      default:
        return children;
    }
  }

  render() {
    const {
      column,
      type,
      width,
      colSpan,
    } = this.props;

    return (
      <TableCellStyle
        type={type}
        width={width}
        colSpan={colSpan}
        column={column}
        data-label={column.name}
      >
        {this.renderChildren()}
      </TableCellStyle>
    );
  }
}

export default withTheme(TableCell);
