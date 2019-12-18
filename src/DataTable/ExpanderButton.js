import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';

const ButtonStyle = styled.button`
  display: inline-flex;
  align-items: center;
  user-select: none;
  white-space: nowrap;
  outline: none;
  border: none;
  background-color: transparent;
  height: 100%;
  width: 100%;
  ${props => props.theme.expanderButton.style};
`;

const ExpanderButton = ({ expanded, row, onToggled, disabled }) => {
  const { expandableIcon, keyField } = useTableContext();
  const icon = expanded
    ? expandableIcon.expanded
    : expandableIcon.collapsed;
  const handleToggle = e => onToggled && onToggled(row, e);

  return (
    <ButtonStyle
      onClick={handleToggle}
      data-testid={`expander-button-${row[keyField]}`}
      disabled={disabled}
      role="button"
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
