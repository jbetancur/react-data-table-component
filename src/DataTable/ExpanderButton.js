import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DataTableContext } from './DataTableContext';

const ButtonStyle = styled.button`
  outline: none;
  border: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: transparent;
  color: ${props => props.theme.expander.expanderColor};

  &:disabled {
    color: ${props => props.theme.expander.expanderColorDisabled};
  }

  &:hover {
    cursor: pointer;
  }
`;

const ExpanderButton = ({ expanded, row, onToggled }) => {
  const { expandableIcon } = React.useContext(DataTableContext);
  const icon = expanded
    ? expandableIcon.expanded
    : expandableIcon.collapsed;
  const handleToggle = e => onToggled && onToggled(row, e);

  return (
    <ButtonStyle
      onClick={handleToggle}
      data-testid="expander-button"
    >
      {icon}
    </ButtonStyle>
  );
};

ExpanderButton.propTypes = {
  row: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
  onToggled: PropTypes.func,
};

ExpanderButton.defaultProps = {
  onToggled: null,
  expanded: false,
};

export default ExpanderButton;
