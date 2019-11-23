import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';
import { isRowSelected } from './util';

const TableCellCheckboxStyle = styled(CellBase)`
  flex: 0 0 48px;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
`;

const TableCellCheckbox = ({ name, row }) => {
  const { dispatch, data, keyField, selectedRows, selectableRowsComponent, selectableRowsComponentProps, selectableRowsDisabledField } = useTableContext();
  const checked = isRowSelected(row, selectedRows, keyField);
  const disabled = row[selectableRowsDisabledField];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnRowSelected = useCallback(() => dispatch({ type: 'SELECT_SINGLE_ROW', row, rows: data, isRowSelected: checked }), [data, checked, row]);

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
        disabled={disabled}
      />
    </TableCellCheckboxStyle>
  );
};

TableCellCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
};

export default TableCellCheckbox;
