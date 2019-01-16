import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { DataTableConsumer } from './DataTableContext';
import { CellBase } from './Cell';
import ExpanderButton from './ExpanderButton';

const TableCellExpanderStyle = styled(CellBase)`
  flex: 0 0 42px;
  align-items: center;
  white-space: nowrap;
  font-weight: 400;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
  min-height: ${props => props.theme.rows.height};

  &:not(:first-child) {
    padding-left: 0;
  }
`;

class TableCellExpander extends PureComponent {
  static propTypes = {
    column: PropTypes.object,
    row: PropTypes.object,
    type: PropTypes.oneOf(['checkbox', 'cell', 'expander']),
    expanded: PropTypes.bool,
  };

  static defaultProps = {
    column: {},
    row: {},
    type: null,
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
      expanded,
    } = this.props;

    return (
      <DataTableConsumer>
        {({ onToggled }) => (
          <TableCellExpanderStyle
            type={type}
            column={column}
            onClick={this.handleCellClick}
          >
            <ExpanderButton
              onToggled={onToggled}
              row={row}
              expanded={expanded}
            />
          </TableCellExpanderStyle>
        )}
      </DataTableConsumer>
    );
  }
}

export default withTheme(TableCellExpander);
