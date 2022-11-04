import * as React from 'react';
import styled, { CSSObject } from 'styled-components';
import { ComponentProps, ExpandableRowsComponent } from './types';
import { TableRowProps } from './TableRow';

const ExpanderRowStyle = styled.div<{
	extendedRowStyle: CSSObject;
}>`
	width: 100%;
	box-sizing: border-box;
	${({ theme }) => theme.expanderRow.style};
	${({ extendedRowStyle }) => extendedRowStyle};
`;

type ExpanderRowProps<T> = {
	data: T;
	rowProps: TableRowProps<T>;
	ExpanderComponent: ExpandableRowsComponent<T>;
	extendedRowStyle: CSSObject;
	extendedClassNames: string;
	expanderComponentProps: ComponentProps;
};

function ExpanderRow<T>({
	data,
	rowProps,
	ExpanderComponent,
	expanderComponentProps,
	extendedRowStyle,
	extendedClassNames,
}: ExpanderRowProps<T>): JSX.Element {
	// we need to strip of rdt_TableRow from extendedClassNames
	const classNamesSplit = extendedClassNames.split(' ').filter(c => c !== 'rdt_TableRow');
	const classNames = ['rdt_ExpanderRow', ...classNamesSplit].join(' ');

	return (
		<ExpanderRowStyle className={classNames} extendedRowStyle={extendedRowStyle}>
			<ExpanderComponent data={data} rowProps={rowProps} {...expanderComponentProps} />
		</ExpanderRowStyle>
	);
}

export default React.memo(ExpanderRow) as typeof ExpanderRow;
