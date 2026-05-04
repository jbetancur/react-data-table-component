import * as React from 'react';
import './DataTable.css';
import { useStyles } from './StylesContext';
import useRTL from '../hooks/useRTL';
import { Direction } from './constants';
import { ContextMessage } from './types';

function generateTitle(contextMessage: ContextMessage, selectedCount: number, rtl: boolean): string | null {
	if (selectedCount === 0) return null;
	const datumName = selectedCount === 1 ? contextMessage.singular : contextMessage.plural;
	return rtl
		? `${selectedCount} ${contextMessage.message || ''} ${datumName}`
		: `${selectedCount} ${datumName} ${contextMessage.message || ''}`;
}

type ContextMenuProps = {
	contextMessage: ContextMessage;
	contextActions: React.ReactNode | React.ReactNode[];
	contextComponent: React.ReactNode | null;
	selectedCount: number;
	direction: Direction;
};

export default function ContextMenu({ contextMessage, contextActions, contextComponent, selectedCount, direction }: ContextMenuProps): JSX.Element {
	const customStyles = useStyles();
	const isRTL = useRTL(direction);
	const visible = selectedCount > 0;
	const className = [
		'rdt_contextMenu',
		visible && 'rdt_contextMenuVisible',
		isRTL && 'rdt_contextMenuRTL',
	].filter(Boolean).join(' ');
	const style = { ...customStyles.contextMenu?.style, ...(visible && customStyles.contextMenu?.activeStyle) };

	if (contextComponent) {
		return (
			<div className={className} style={style}>
				{React.cloneElement(contextComponent as React.ReactElement, { selectedCount })}
			</div>
		);
	}

	return (
		<div className={className} style={style}>
			<div className="rdt_contextTitle">{generateTitle(contextMessage, selectedCount, isRTL)}</div>
			<div className="rdt_contextActions">{contextActions}</div>
		</div>
	);
}
