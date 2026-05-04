import * as React from 'react';
import './DataTable.css';

export default function Body({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
	return <div className={['rdt_body', className].filter(Boolean).join(' ')} {...rest} />;
}
