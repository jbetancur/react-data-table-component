import * as React from 'react';
import './DataTable.css';
import { useStyles } from './StylesContext';
import ContextMenu from './ContextMenu';
import { Direction } from './constants';
import { ContextMessage } from './types';

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

export default function Header({ title, actions = null, contextMessage, contextActions, contextComponent, selectedCount, direction, showMenu = true }: HeaderProps): JSX.Element {
	const customStyles = useStyles();
	return (
		<div className="rdt_TableHeader" style={customStyles.header?.style}>
			<div className="rdt_header">
				<div className="rdt_headerTitle">{title}</div>
				{actions && <div className="rdt_headerActions">{actions}</div>}
				{showMenu && (
					<ContextMenu
						contextMessage={contextMessage}
						contextActions={contextActions}
						contextComponent={contextComponent}
						direction={direction}
						selectedCount={selectedCount}
					/>
				)}
			</div>
		</div>
	);
}
