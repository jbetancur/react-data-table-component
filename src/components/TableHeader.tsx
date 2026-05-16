import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';

type HeaderProps = {
	title?: string | React.ReactNode;
	actions?: React.ReactNode | React.ReactNode[];
};

export default function Header({ title, actions = null }: HeaderProps): JSX.Element {
	const customStyles = useStyles();
	return (
		<div className="rdt_TableHeader" style={customStyles.header?.style}>
			<div className="rdt_header">
				<div className="rdt_headerTitle">{title}</div>
				{actions && <div className="rdt_headerActions">{actions}</div>}
			</div>
		</div>
	);
}
