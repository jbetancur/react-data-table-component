import * as React from 'react';
import '../DataTable.css';
import { useStyles } from '../context/StylesContext';
import type { CSSObject, ComponentProps, ExpandableRowsComponent } from '../types';

type ExpanderRowProps<T> = {
	data: T;
	ExpanderComponent: ExpandableRowsComponent<T>;
	extendedRowStyle: CSSObject;
	extendedClassNames: string;
	expanderComponentProps: ComponentProps;
};

function ExpanderRow<T>({
	data,
	ExpanderComponent,
	expanderComponentProps,
	extendedRowStyle,
	extendedClassNames,
}: ExpanderRowProps<T>): JSX.Element {
	const customStyles = useStyles();
	const extraClasses = extendedClassNames.split(' ').filter(c => c !== 'rdt_TableRow');
	const className = ['rdt_ExpanderRow', 'rdt_expanderRow', 'rdt_expanderRowAnimated', ...extraClasses].join(' ');

	return (
		<div
			className={className}
			style={{ ...customStyles.expanderRow?.style, ...(extendedRowStyle as React.CSSProperties) }}
		>
			<ExpanderComponent data={data} {...expanderComponentProps} />
		</div>
	);
}

export default React.memo(ExpanderRow) as typeof ExpanderRow;
