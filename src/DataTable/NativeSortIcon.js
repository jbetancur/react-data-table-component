import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Icon = styled.span`
  padding: 2px;
  color: inherit;
  flex-grow: 0;
  flex-shrink: 0;
  ${props => (props.sortActive ? 'opacity: 1' : 'opacity: 0')};
  ${props => props.sortDirection === 'desc' && 'transform: rotate(180deg)'};
`;

const NativeSortIcon = ({ sortActive, sortDirection, sortIcon }) => (
  <Icon sortActive={sortActive} sortDirection={sortDirection}>{sortIcon}</Icon>
);

NativeSortIcon.propTypes = {
  sortDirection: PropTypes.string.isRequired,
  sortActive: PropTypes.bool,
  sortIcon: PropTypes.node,
};

NativeSortIcon.defaultProps = {
  sortActive: false,
  sortIcon: <>&#9650;</>,
};

export default NativeSortIcon;
