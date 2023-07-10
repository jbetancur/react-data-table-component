import * as React from 'react';
import { Direction } from './constants';
import { ContextMessage } from './types';
type ContextMenuProps = {
    contextMessage: ContextMessage;
    contextActions: React.ReactNode | React.ReactNode[];
    contextComponent: React.ReactNode | null;
    selectedCount: number;
    direction: Direction;
};
declare function ContextMenu({ contextMessage, contextActions, contextComponent, selectedCount, direction, }: ContextMenuProps): JSX.Element;
export default ContextMenu;
