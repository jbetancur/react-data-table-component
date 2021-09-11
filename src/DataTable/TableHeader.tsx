import * as React from 'react';
import styled from 'styled-components';
import ContextMenu from './ContextMenu';
import { Direction } from './constants';
import { ContextMessage } from './types';

const HeaderStyle = styled.div`
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex: 1 1 auto;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	flex-wrap: wrap;
	${({ theme }) => theme.header.style}
`;

const Title = styled.div`
	flex: 1 0 auto;
	color: ${({ theme }) => theme.header.fontColor};
	font-size: ${({ theme }) => theme.header.fontSize};
	font-weight: 400;
`;

const Actions = styled.div`
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * {
		margin-left: 5px;
	}
`;

type HeaderProps = {
	title?: string | React.ReactNode;
	actions?: React.ReactNode | React.ReactNode[];
	direction: Direction;
	selectedCount: number;
	showMenu?: boolean;
	contextMessage: ContextMessage;
	contextActions: React.ReactNode | React.ReactNode[];
	contextComponent: React.ReactNode | null;
};

const Header = ({
	title,
	actions = null,
	contextMessage,
	contextActions,
	contextComponent,
	selectedCount,
	direction,
	showMenu = true,
}: HeaderProps): JSX.Element => (
	<HeaderStyle className="rdt_TableHeader" role="heading" aria-level={1}>
		<Title>{title}</Title>
		{actions && <Actions>{actions}</Actions>}

		{showMenu && (
			<ContextMenu
				contextMessage={contextMessage}
				contextActions={contextActions}
				contextComponent={contextComponent}
				direction={direction}
				selectedCount={selectedCount}
			/>
		)}
	</HeaderStyle>
);

export default Header;
