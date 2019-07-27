import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';

const TableCellCheckboxStyle = styled(CellBase)`
  flex: 0 0 48px;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
  min-height: ${props => props.theme.rows.height};
`;

const TableCellCheckbox = ({ name, row }) => {
  const { dispatch, selectedRows, selectableRowsComponent, selectableRowsComponentProps } = useTableContext();
  const handleOnRowSelected = () => dispatch({ type: 'ROW_SELECTED', row });
  const isRowSelected = useMemo(() => selectedRows.some(srow => srow === row), [row, selectedRows]);

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
      />
    </TableCellCheckboxStyle>
  );
};

TableCellCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
};

export default TableCellCheckbox;
