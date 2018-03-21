import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProgressWrapperStyle = styled.div`
  position: ${props => (props.centered ? 'absolute' : 'relative')};
  ${props => props.centered && 'align-items: center'};
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ProgressWrapper = ({ component, centered }) => (
  <ProgressWrapperStyle centered={centered}>
    {component}
  </ProgressWrapperStyle>
);

ProgressWrapper.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  centered: PropTypes.bool,
};

ProgressWrapper.defaultProps = {
  centered: false,
};

export default ProgressWrapper;
