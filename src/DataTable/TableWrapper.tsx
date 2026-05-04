import * as React from 'react';
import './DataTable.css';
import { useStyles } from './StylesContext';

export default function Wrapper({ style, ...rest }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
	const customStyles = useStyles();
	return <div className="rdt_wrapper" style={{ ...customStyles.tableWrapper?.style, ...style }} {...rest} />;
}
