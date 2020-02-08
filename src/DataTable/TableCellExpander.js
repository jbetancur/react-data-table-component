import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CellBase } from './Cell';
import ExpanderButton from './ExpanderButton';

const TableCellExpanderStyle = styled(CellBase)`
  white-space: nowrap;
  font-weight: 400;
  ${props => props.theme.expanderCell.style};
`;

const TableCellExpander = ({
  column,
  row,
  expanded,
  onRowExpandToggled,
  disabled,
}) => (
  <TableCellExpanderStyle
    column={column}
    onClick={e => e.stopPropagation()}
    noPadding
  >
    <ExpanderButton
      onToggled={onRowExpandToggled}
      row={row}
      expanded={expanded}
      disabled={disabled}
    />
  </TableCellExpanderStyle>
);

TableCellExpander.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  expanded: PropTypes.bool,
  onRowExpandToggled: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TableCellExpander.defaultProps = {
  column: {},
  row: {},
  expanded: false,
  disabled: false,
};

export default TableCellExpander;
