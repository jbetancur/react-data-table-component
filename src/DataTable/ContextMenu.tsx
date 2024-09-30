import * as React from 'react';
import styled from 'styled-components';
import useRTL from '../hooks/useRTL';
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
	$rtl?: boolean;
	$visible: boolean;
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
	${({ $rtl }) => $rtl && 'direction: rtl'};
	${({ theme }) => theme.contextMenu.style};
	${({ theme, $visible }) => $visible && theme.contextMenu.activeStyle};
`;

const generateDefaultContextTitle = (contextMessage: ContextMessage, selectedCount: number, rtl: boolean) => {
	if (selectedCount === 0) {
		return null;
	}

	const datumName = selectedCount === 1 ? contextMessage.singular : contextMessage.plural;

	// TODO: add mock document rtl tests
	if (rtl) {
		return `${selectedCount} ${contextMessage.message || ''} ${datumName}`;
	}

	return `${selectedCount} ${datumName} ${contextMessage.message || ''}`;
};

type ContextMenuProps = {
	contextMessage: ContextMessage;
	contextActions: React.ReactNode | React.ReactNode[];
	contextComponent: React.ReactNode | null;
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
	const isRTL = useRTL(direction);
	const visible = selectedCount > 0;

	if (contextComponent) {
		return (
			<ContextMenuStyle $visible={visible}>
				{React.cloneElement(contextComponent as React.ReactElement, { selectedCount })}
			</ContextMenuStyle>
		);
	}

	return (
		<ContextMenuStyle $visible={visible} $rtl={isRTL}>
			<Title>{generateDefaultContextTitle(contextMessage, selectedCount, isRTL)}</Title>
			<ContextActions>{contextActions}</ContextActions>
		</ContextMenuStyle>
	);
}

export default ContextMenu;
