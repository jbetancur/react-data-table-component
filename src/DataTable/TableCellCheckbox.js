import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';

const TableCellCheckboxStyle = styled(CellBase)`
  flex: 0 0 48px;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
`;

const TableCellCheckbox = ({ name, row }) => {
  const { dispatch, data, selectedRows, selectableRowsComponent, selectableRowsComponentProps, selectableRowsDisabledField } = useTableContext();
  const isRowSelected = selectedRows.some(srow => srow === row);
  const isRowDisabled = row[selectableRowsDisabledField];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnRowSelected = useCallback(() => dispatch({ type: 'SELECT_SINGLE_ROW', row, rows: data, isRowSelected }), [data, isRowSelected, row]);

  return (
    <TableCellCheckboxStyle
      onClick={e => e.stopPropagation()}
      className="rdt_TableCell"
    >
      <Checkbox
        name={name}
        component={selectableRowsComponent}
        componentOptions={selectableRowsComponentProps}
        checked={isRowSelected}
        onClick={handleOnRowSelected}
        disabled={isRowDisabled}
      />
    </TableCellCheckboxStyle>
  );
};

TableCellCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
};

export default TableCellCheckbox;
