import React, { PureComponent, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

// Make "data" available on our any child component
// eslint-disable-next-line arrow-body-style
const renderChildren = (children, data) => {
  return Children.map(children, child => cloneElement(child, { data }));
};

const ExpanderRowStyle = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: ${props => props.theme.expander.backgroundColor};
`;

class ExpanderRow extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
  };

  static defaultProps = {
    data: {},
    children: null,
  };

  render() {
    const {
      data,
      children,
    } = this.props;

    return (
      <ExpanderRowStyle>
        {renderChildren(children, data)}
      </ExpanderRowStyle>
    );
  }
}

export default withTheme(ExpanderRow);
