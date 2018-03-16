import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const Title = styled.div`
  color: ${props => props.theme.header.contextMenu.fontColor};
  font-size: ${props => props.theme.header.contextMenu.fontSize};
  font-weight: 400;
`;

const ContextMenuStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.header.contextMenu.backgroundColor};
  z-index: 1;
  transform: ${props => (props.visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)')};
  transition-duration: ${props => props.theme.header.contextMenu.transitionTime};
  transition-property: transform;
  align-items: center;
  justify-content: space-between;
  display: flex;
  padding: 16px;
`;

const ContextMenu = ({ visible, title, actions }) => (
  <ContextMenuStyle visible={visible}>
    <Title>
      {title}
    </Title>

    <div>
      {actions}
    </div>
  </ContextMenuStyle>
);

ContextMenu.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.node),
};

ContextMenu.defaultProps = {
  visible: false,
  title: null,
  actions: [],
};

export default withTheme(ContextMenu);
