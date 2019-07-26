import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DataTableStateContext } from './DataTableContext';
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

const TableCol = ({ onClick, checked }) => {
  const { selectableRowsComponent, selectableRowsComponentProps, indeterminate } = useContext(DataTableStateContext);

  return (
    <TableColStyle className="rdt_TableCol">
      <Checkbox
        name="select-all-rows"
        component={selectableRowsComponent}
        componentOptions={selectableRowsComponentProps}
        onClick={onClick}
        checked={checked}
        indeterminate={indeterminate}
      />
    </TableColStyle>
  );
};

TableCol.propTypes = {
  onClick: PropTypes.func,
  checked: PropTypes.bool,
};

TableCol.defaultProps = {
  onClick: null,
  checked: false,
};

export default TableCol;
