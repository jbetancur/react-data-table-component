import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { DataTableConsumer } from './DataTableContext';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';

const TableColStyle = styled(CellBase)`
  flex: 0 0 48px;
  align-items: center;
  user-select: none;
  white-space: nowrap;
  font-size: ${props => props.theme.header.fontSize};
  color: ${props => props.theme.header.fontColor};
  height: ${props => props.theme.header.height};
`;

const TableCol = ({
  onClick,
}) => (
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
          indeterminate={selectedRows.length > 0 && !allSelected}
        />
      </TableColStyle>
    )}
  </DataTableConsumer>
);

TableCol.propTypes = {
  onClick: PropTypes.func,
};

TableCol.defaultProps = {
  onClick: null,
};

export default withTheme(TableCol);
