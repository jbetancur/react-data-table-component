import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ProgressWrapperStyle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  ${props => props.theme.progress.style};
`;

const ProgressWrapper = ({ children }) => (
  <ProgressWrapperStyle>
    {children}
  </ProgressWrapperStyle>
);

ProgressWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};

export default ProgressWrapper;
