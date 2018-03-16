import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';

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

const TableRow = ({ striped, highlightOnHover, children }) => (
  <TableRowStyle
    striped={striped}
    highlightOnHover={highlightOnHover}
  >
    {children}
  </TableRowStyle>
);

TableRow.propTypes = {
  striped: PropTypes.bool,
  highlightOnHover: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

TableRow.defaultProps = {
  striped: false,
  highlightOnHover: false,
  children: null,
};

export default withTheme(TableRow);
