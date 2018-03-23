import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const ButtonStyle = styled.button`
  outline: none;
  border: none;
  display: block;
  width: 42px;
  height: 42px;
  background-color: transparent;
  background-image: url(${props => props.theme.expander[props.expanded ? 'expandedButton' : 'collapsedButton']});
  background-position: center center;
  background-repeat: no-repeat;

  &:hover {
    cursor: pointer;
  }
`;

const ExpanderButton = ({ expanded, children, data, index, onToggled }) => {
  const handleToggle = e =>
    onToggled && onToggled(data, index, e);

  return (
    <ButtonStyle
      onClick={handleToggle}
      expanded={expanded}
    >
      {children}
    </ButtonStyle>
  );
};

ExpanderButton.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
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
