import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DataTableStateContext } from './DataTableContext';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';

const TableCellCheckboxStyle = styled(CellBase)`
  flex: 0 0 48px;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
  min-height: ${props => props.theme.rows.height};
`;

const TableCellCheckbox = ({
  name,
  checked,
  row,
}) => {
  const { dispatch, selectableRowsComponent, selectableRowsComponentProps } = useContext(DataTableStateContext);
  const handleOnRowSelected = () => dispatch({ type: 'ROW_SELECTED', row });

  return (
    <TableCellCheckboxStyle
      onClick={e => e.stopPropagation()}
      className="rdt_TableCell"
    >
      <Checkbox
        name={name}
        component={selectableRowsComponent}
        componentOptions={selectableRowsComponentProps}
        checked={checked}
        onClick={handleOnRowSelected}
      />
    </TableCellCheckboxStyle>
  );
};

TableCellCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
  checked: PropTypes.bool,
};

TableCellCheckbox.defaultProps = {
  checked: false,
};

export default TableCellCheckbox;
