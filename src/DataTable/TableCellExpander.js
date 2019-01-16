import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
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

const TableCellExpander = ({
  column,
  row,
  type,
  expanded,
  onExpandToggled,
}) => (
  <TableCellExpanderStyle
    type={type}
    column={column}
    onClick={e => e.stopPropagation()}
  >
    <ExpanderButton
      onToggled={onExpandToggled}
      row={row}
      expanded={expanded}
    />
  </TableCellExpanderStyle>
);

TableCellExpander.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  type: PropTypes.oneOf(['checkbox', 'cell', 'expander']),
  expanded: PropTypes.bool,
  onExpandToggled: PropTypes.func.isRequired,
};

TableCellExpander.defaultProps = {
  column: {},
  row: {},
  type: null,
  expanded: false,
};

export default withTheme(TableCellExpander);
