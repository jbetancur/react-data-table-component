import React from 'react';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';

const Title = styled.div`
  color: ${props => props.theme.contextMenu.fontColor};
  font-size: ${props => props.theme.contextMenu.fontSize};
  font-weight: 400;
`;

const ContextMenuStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.contextMenu.backgroundColor};
  z-index: 1;
  transform: ${props => (props.visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)')};
  transition-duration: ${props => props.theme.contextMenu.transitionTime};
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-delay: 0;
  will-change: transform;
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

const ContextMenu = () => {
  const { contextTitle, contextActions, selectedCount } = useTableContext();

  return (
    <ContextMenuStyle visible={selectedCount > 0}>
      <Title>
        {generateDefaultContextTitle(contextTitle, selectedCount)}
      </Title>

      <div>
        {contextActions}
      </div>
    </ContextMenuStyle>
  );
};

export default ContextMenu;
