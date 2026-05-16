import * as React from 'react';
import '../DataTable.css';

const Body = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Body(
	{ className, ...rest },
	ref,
) {
	return <div ref={ref} className={['rdt_body', className].filter(Boolean).join(' ')} {...rest} />;
});

export default Body;
