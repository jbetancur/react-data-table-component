import * as React from 'react';
import { Direction } from './constants';
import { ContextMessage } from './types';
declare type HeaderProps = {
    title?: string | React.ReactNode;
    actions?: React.ReactNode | React.ReactNode[];
    direction: Direction;
    selectedCount: number;
    showMenu?: boolean;
    contextMessage: ContextMessage;
    contextActions: React.ReactNode | React.ReactNode[];
    contextComponent: React.ReactNode | null;
};
declare const Header: ({ title, actions, contextMessage, contextActions, contextComponent, selectedCount, direction, showMenu, }: HeaderProps) => JSX.Element;
export default Header;
