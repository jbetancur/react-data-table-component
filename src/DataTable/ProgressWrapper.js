import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const ProgressWrapperStyle = styled.div`
  text-align: center;
  position: relative;
  ${props => props.centered && css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  `};
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
