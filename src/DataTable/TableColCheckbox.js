import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DataTableContext } from './DataTableContext';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';

const TableColStyle = styled(CellBase)`
  flex: 0 0 48px;
  user-select: none;
  white-space: nowrap;
  font-size: ${props => props.theme.header.fontSize};
  color: ${props => props.theme.header.fontColor};
  height: ${props => props.theme.header.height};
`;

const TableCol = memo(({
  onClick,
}) => {
  const { selectableRowsComponent, selectableRowsComponentProps, selectedRows, allSelected } = useContext(DataTableContext);

  return (
    <TableColStyle className="rdt_TableCol">
      <Checkbox
        name="select-all-rows"
        component={selectableRowsComponent}
        componentOptions={selectableRowsComponentProps}
        onClick={onClick}
        checked={allSelected}
        indeterminate={selectedRows.length > 0 && !allSelected}
      />
    </TableColStyle>
  );
});

TableCol.propTypes = {
  onClick: PropTypes.func,
};

TableCol.defaultProps = {
  onClick: null,
};

export default TableCol;
