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

  &:hover:enabled {
    cursor: pointer;
  }
`;

const ExpanderButton = ({ expanded, row, onToggled, disabled }) => {
  const { expandableIcon, keyField } = React.useContext(DataTableContext);
  const icon = expanded
    ? expandableIcon.expanded
    : expandableIcon.collapsed;
  const handleToggle = e => onToggled && onToggled(row, e);

  return (
    <ButtonStyle
      onClick={handleToggle}
      data-testid={`expander-button-${row[keyField]}`}
      disabled={disabled}
    >
      {icon}
    </ButtonStyle>
  );
};

ExpanderButton.propTypes = {
  row: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
  onToggled: PropTypes.func,
  disabled: PropTypes.bool,
};

ExpanderButton.defaultProps = {
  onToggled: null,
  expanded: false,
  disabled: false,
};

export default ExpanderButton;
