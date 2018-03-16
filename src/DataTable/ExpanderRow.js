import React, { PureComponent, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

// Make "data" available on our any child component
// eslint-disable-next-line arrow-body-style
const renderChildren = (children, data) => {
  return Children.map(children, child => cloneElement(child, { data }));
};

const ExpanderRowStyle = styled.tr`
  box-sizing: border-box;
  background-color: ${props => props.theme.expander.backgroundColor};
`;

class ExpanderRow extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    numColumns: PropTypes.number,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
  };

  static defaultProps = {
    data: {},
    numColumns: 0,
    children: null,
  };

  render() {
    const {
      data,
      numColumns,
      children,
    } = this.props;

    return (
      <ExpanderRowStyle>
        <td colSpan={numColumns}>
          {renderChildren(children, data)}
        </td>
      </ExpanderRowStyle>
    );
  }
}

export default withTheme(ExpanderRow);
