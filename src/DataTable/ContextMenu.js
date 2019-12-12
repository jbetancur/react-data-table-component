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
  box-sizing: inherit;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
  display: flex;
  padding: 16px 16px 16px 24px;
  ${props => props.theme.contextMenu.style};
  ${props => props.visible && props.theme.contextMenu.activeStyle};
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
