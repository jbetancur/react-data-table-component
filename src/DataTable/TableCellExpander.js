import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CellBase } from './Cell';
import ExpanderButton from './ExpanderButton';

const TableCellExpanderStyle = styled(CellBase)`
  flex: 0 0 48px;
  white-space: nowrap;
  font-weight: 400;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
  min-height: ${props => props.theme.rows.height};

  &:not(:first-child) {
    padding-left: 0;
  }
`;

const TableCellExpander = memo(({
  column,
  row,
  expanded,
  onExpandToggled,
  disabled,
}) => (
  <TableCellExpanderStyle
    column={column}
    onClick={e => e.stopPropagation()}
  >
    <ExpanderButton
      onToggled={onExpandToggled}
      row={row}
      expanded={expanded}
      disabled={disabled}
    />
  </TableCellExpanderStyle>
));

TableCellExpander.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  expanded: PropTypes.bool,
  onExpandToggled: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TableCellExpander.defaultProps = {
  column: {},
  row: {},
  expanded: false,
  disabled: false,
};

export default TableCellExpander;
