import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const alignMap = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
};

const SubheaderWrapper = styled.header`
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  padding: 0 16px 8px 24px;
  width: 100%;
  background-color: ${props => props.theme.title.backgroundColor};
  justify-content: ${props => alignMap[props.align]};
  flex-wrap: ${props => (props.wrapContent ? 'wrap' : 'nowrap')};
`;

const TableSubheader = ({ align, wrapContent, component }) => (
  <SubheaderWrapper align={align} wrapContent={wrapContent}>
    {component}
  </SubheaderWrapper>
);

TableSubheader.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  align: PropTypes.oneOf(['center', 'left', 'right']),
  wrapContent: PropTypes.bool,
};

TableSubheader.defaultProps = {
  component: null,
  align: 'right',
  wrapContent: true,
};

export default TableSubheader;
