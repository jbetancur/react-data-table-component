import * as React from 'react';
import styled from 'styled-components';
import { detectRTL } from './util';
import { Direction } from './constants';
import { ContextMessage } from './types';

const Title = styled.div`
	display: flex;
	align-items: center;
	flex: 1 0 auto;
	height: 100%;
	color: ${({ theme }) => theme.contextMenu.fontColor};
	font-size: ${({ theme }) => theme.contextMenu.fontSize};
	font-weight: 400;
`;

const ContextActions = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
`;

const ContextMenuStyle = styled.div<{
	visible: boolean;
}>`
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
	${({ theme }) => theme.contextMenu.style};
	${({ theme, visible }) => visible && theme.contextMenu.activeStyle};
`;

const generateDefaultContextTitle = (contextMessage: ContextMessage, selectedCount: number, direction: Direction) => {
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

type ContextMenuProps = {
	contextMessage: ContextMessage;
	contextActions: React.ReactNode | React.ReactNode[];
	contextComponent: React.ReactElement | null;
	selectedCount: number;
	direction: Direction;
};

function ContextMenu({
	contextMessage,
	contextActions,
	contextComponent,
	selectedCount,
	direction,
}: ContextMenuProps): JSX.Element {
	const visible = selectedCount > 0;

	if (contextComponent) {
		return (
			<ContextMenuStyle visible={visible}>{React.cloneElement(contextComponent, { selectedCount })}</ContextMenuStyle>
		);
	}

	return (
		<ContextMenuStyle visible={visible}>
			<Title>{generateDefaultContextTitle(contextMessage, selectedCount, direction as Direction)}</Title>
			<ContextActions>{contextActions}</ContextActions>
		</ContextMenuStyle>
	);
}

export default ContextMenu;
