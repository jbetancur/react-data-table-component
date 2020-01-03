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
  box-sizing: border-box;
  align-items: center;
  padding: 4px 16px 4px 24px;
  width: 100%;
  justify-content: ${props => alignMap[props.align]};
  flex-wrap: ${props => (props.wrapContent ? 'wrap' : 'nowrap')};
  ${props => props.theme.subHeader.style}
`;

const TableSubheader = ({ align, wrapContent, children }) => (
  <SubheaderWrapper align={align} wrapContent={wrapContent}>
    {children}
  </SubheaderWrapper>
);

TableSubheader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  align: PropTypes.oneOf(['center', 'left', 'right']),
  wrapContent: PropTypes.bool,
};

TableSubheader.defaultProps = {
  children: null,
  align: 'right',
  wrapContent: true,
};

export default TableSubheader;
