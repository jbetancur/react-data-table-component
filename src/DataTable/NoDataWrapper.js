import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const NoDataWrapperStyle = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  ${props => props.theme.noData.style};
`;

const NoDataWrapper = ({ children }) => (
  <NoDataWrapperStyle>
    {children}
  </NoDataWrapperStyle>
);

NoDataWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
};

export default NoDataWrapper;
