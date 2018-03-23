import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import TableCell from './TableCell';

const TableRowStyle = styled.tr`
  border-top: 1px solid ${props => props.theme.rows.borderColor};
  ${props => props.striped && css`
      &:nth-child(odd) {
        background-color: ${props.theme.rows.stripedColor};
      }
  `};
  ${props => props.highlightOnHover && css`
      &:hover {
        background-color: ${props.theme.rows.hoverColor};
        transition-duration: 0.15s;
        transition-property: background-color;
      }
  `};
`;

const TableRow = ({ striped, highlightOnHover, children, columns, keyField, row, index, onRowClicked }) => {
  const handleRowClick = e =>
    onRowClicked && onRowClicked(row, index, e);

  return (
    <TableRowStyle
      striped={striped}
      highlightOnHover={highlightOnHover}
      onClick={handleRowClick}
    >
      {children}
      {columns.map(col => (
        <TableCell
          type="cell"
          key={`cell-${col.id}-${row[keyField] || index}`}
          width={col.width}
          column={col}
          row={row}
        />))}
    </TableRowStyle>
  );
};

TableRow.propTypes = {
  striped: PropTypes.bool,
  highlightOnHover: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  columns: PropTypes.array.isRequired,
  keyField: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onRowClicked: PropTypes.func,
};

TableRow.defaultProps = {
  striped: false,
  highlightOnHover: false,
  children: null,
  onRowClicked: null,
};

export default withTheme(TableRow);
