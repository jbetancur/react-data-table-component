import React from 'react';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';

const TableColStyle = styled(CellBase)`
  flex: 0 0 48px;
  user-select: none;
  white-space: nowrap;
  font-size: ${props => props.theme.header.fontSize};
  color: ${props => props.theme.header.fontColor};
  min-height: ${props => props.theme.header.height};
`;

const TableCol = () => {
  const {
    dispatch,
    data,
    selectedRows,
    allSelected,
    selectableRowsComponent,
    selectableRowsComponentProps,
    selectableRowsDisabledField,
  } = useTableContext();
  const indeterminate = selectedRows.length > 0 && !allSelected;
  const handleSelectAll = () =>
    dispatch({ type: 'SELECT_ALL', rows: data, selectableRowsDisabledField });

  return (
    <TableColStyle className="rdt_TableCol">
      <Checkbox
        name="select-all-rows"
        component={selectableRowsComponent}
        componentOptions={selectableRowsComponentProps}
        onClick={handleSelectAll}
        checked={allSelected}
        indeterminate={indeterminate}
      />
    </TableColStyle>
  );
};

export default TableCol;
