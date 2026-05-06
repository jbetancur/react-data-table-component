import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';

export default function NoDataWrapper({ style, ...rest }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
	const customStyles = useStyles();
	return <div className="rdt_noData" style={{ ...customStyles.noData?.style, ...style }} {...rest} />;
}
