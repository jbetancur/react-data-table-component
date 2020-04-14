import React, { cloneElement } from 'react';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';
import { detectRTL } from './util';

const Title = styled.div`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
  height: 100%;
  color: ${props => props.theme.contextMenu.fontColor};
  font-size: ${props => props.theme.contextMenu.fontSize};
  font-weight: 400;
`;

const ContextActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
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
  ${props => props.theme.contextMenu.style};
  ${props => props.visible && props.theme.contextMenu.activeStyle};
`;

const generateDefaultContextTitle = (contextMessage, selectedCount, direction) => {
  if (selectedCount === 0) {
    return null;
  }

  const datumName = selectedCount === 1 ? contextMessage.singular : contextMessage.plural;

  // TODO: add mock document rtl tests
  if (detectRTL(direction)) {
    return `${selectedCount} ${contextMessage.message || ''} ${datumName}`;
  }

  return `${selectedCount} ${datumName} ${contextMessage.message || ''}`;
};

const ContextMenu = () => {
  const { contextMessage, contextActions, contextComponent, selectedCount, direction } = useTableContext();
  const visible = selectedCount > 0;

  if (contextComponent) {
    return (
      <ContextMenuStyle visible={visible}>
        {cloneElement(contextComponent, { selectedCount })}
      </ContextMenuStyle>
    );
  }

  return (
    <ContextMenuStyle visible={visible}>
      <Title>
        {generateDefaultContextTitle(contextMessage, selectedCount, direction)}
      </Title>
      <ContextActions>
        {contextActions}
      </ContextActions>
    </ContextMenuStyle>
  );
};

export default ContextMenu;
