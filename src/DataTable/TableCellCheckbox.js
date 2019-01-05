import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { DataTableConsumer } from './DataTableContext';
import Checkbox from './Checkbox';

const TableCellCheckboxStyle = styled.div`
  display: flex;
  flex: 0 0 42px;
  align-items: center;
  box-sizing: border-box;
  line-height: normal;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
  min-height: ${props => props.theme.rows.height};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
  padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
`;

const TableCellCheckbox = memo(({
  checked,
  row,
  onClick,
}) => (
  <DataTableConsumer>
    {({ selectableRowsComponent, selectableRowsComponentProps }) => (
      <TableCellCheckboxStyle
        onClick={e => e.stopPropagation()}
      >
        <Checkbox
          name="select-row"
          aria-label="select-row"
          component={selectableRowsComponent}
          componentOptions={selectableRowsComponentProps}
          checked={checked}
          onClick={onClick}
          data={row}
        />
      </TableCellCheckboxStyle>
    )}
  </DataTableConsumer>
));

TableCellCheckbox.propTypes = {
  row: PropTypes.object,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
};

TableCellCheckbox.defaultProps = {
  row: {},
  checked: false,
  onClick: null,
};

export default withTheme(TableCellCheckbox);
