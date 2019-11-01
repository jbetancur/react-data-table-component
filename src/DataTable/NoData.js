import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const NoDataWrapperMessage = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 16px;
`;

const NoDataWrapper = ({ component }) => (
  <NoDataWrapperMessage>
    {component}
  </NoDataWrapperMessage>
);

NoDataWrapper.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
};

export default NoDataWrapper;
