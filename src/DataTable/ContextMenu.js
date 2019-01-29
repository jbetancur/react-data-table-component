import React from 'react';
import styled from 'styled-components';
import { DataTableConsumer } from './DataTableContext';

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
  padding: 16px 16px 16px 24px;
`;

const generateDefaultContextTitle = (contextTitle, selectedCount) => {
  if (selectedCount === 0) {
    return null;
  }

  return contextTitle || `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`;
};

const ContextMenu = () => (
  <DataTableConsumer>
    {({ contextTitle, contextActions, selectedCount }) => (
      <ContextMenuStyle visible={selectedCount > 0}>
        <Title>
          {generateDefaultContextTitle(contextTitle, selectedCount)}
        </Title>

        <div>
          {contextActions}
        </div>
      </ContextMenuStyle>
    )}
  </DataTableConsumer>
);

export default ContextMenu;
