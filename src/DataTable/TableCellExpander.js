import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import ExpanderButton from './ExpanderButton';

const TableCellExpanderStyle = styled.div`
  display: flex;
  flex: 0 0 42px;
  align-items: center;
  box-sizing: border-box;
  vertical-align: middle;
  white-space: nowrap;
  line-height: normal;
  font-weight: 400;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
  height: ${props => props.theme.rows.height};
  padding: 0;
`;

class TableCellExpander extends PureComponent {
  static propTypes = {
    column: PropTypes.object,
    row: PropTypes.object,
    index: PropTypes.number,
    type: PropTypes.oneOf(['checkbox', 'cell', 'expander']),
    onToggled: PropTypes.func,
    expanded: PropTypes.bool,
  };

  static defaultProps = {
    column: {},
    row: {},
    index: null,
    type: null,
    onToggled: null,
    expanded: false,
  };

  handleCellClick = e => {
    e.stopPropagation();
  };

  render() {
    const {
      column,
      row,
      type,
      onToggled,
      expanded,
      index,
    } = this.props;

    return (
      <TableCellExpanderStyle
        type={type}
        column={column}
        onClick={this.handleCellClick}
      >
        <ExpanderButton
          onToggled={onToggled}
          data={row}
          expanded={expanded}
          index={index}
        />
      </TableCellExpanderStyle>
    );
  }
}

export default withTheme(TableCellExpander);
