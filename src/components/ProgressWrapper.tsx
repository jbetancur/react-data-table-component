import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';

export default function ProgressWrapper({ style, ...rest }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
	const customStyles = useStyles();
	return <div className="rdt_progress" style={{ ...customStyles.progress?.style, ...style }} {...rest} />;
}
