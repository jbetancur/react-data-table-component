import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const ButtonStyle = styled.button`
  outline: none;
  border: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-image: url(${props => props.theme.expander[props.expanded ? 'expandedButton' : 'collapsedButton']});
  background-position: center center;
  background-repeat: no-repeat;

  &:hover {
    cursor: pointer;
  }
`;

const ExpanderButton = ({ expanded, children, row, onToggled }) => {
  const handleToggle = e => onToggled && onToggled(row, e);

  return (
    <ButtonStyle
      onClick={handleToggle}
      expanded={expanded}
      data-testid="expander-button"
    >
      {children}
    </ButtonStyle>
  );
};

ExpanderButton.propTypes = {
  row: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
  onToggled: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

ExpanderButton.defaultProps = {
  onToggled: null,
  children: null,
  expanded: false,
};

export default withTheme(ExpanderButton);
