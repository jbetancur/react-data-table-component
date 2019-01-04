import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { DataTableConsumer } from './DataTableContext';
import Checkbox from './Checkbox';

const TableColStyle = styled.div`
  display: flex;
  flex: 0 0 42px;
  align-items: center;
  box-sizing: border-box;
  user-select: none;
  white-space: nowrap;
  height: ${props => props.theme.header.height};
  font-size: ${props => props.theme.header.fontSize};
  color: ${props => props.theme.header.fontColor};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
  padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
`;

class TableCol extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
  };

  isIndeterminate = (selectedRows, allSelected) => selectedRows.length > 0 && !allSelected;

  render() {
    const {
      onClick,
    } = this.props;

    return (
      <DataTableConsumer>
        {({ selectableRowsComponent, selectableRowsComponentProps, selectedRows, allSelected }) => (
          <TableColStyle>
            <Checkbox
              name="select-all-rows"
              aria-label="select-all-rows"
              component={selectableRowsComponent}
              componentOptions={selectableRowsComponentProps}
              onClick={onClick}
              checked={allSelected}
              indeterminate={this.isIndeterminate(selectedRows, allSelected)}
            />
          </TableColStyle>
        )}
      </DataTableConsumer>
    );
  }
}

export default withTheme(TableCol);
