import * as React from 'react';
import styled, { CSSObject } from 'styled-components';
import { ComponentProps, ExpandableRowsComponent } from './types';

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
	component: ExpandableRowsComponent;
	extendedRowStyle: CSSObject;
	componentProps: ComponentProps;
};

function ExpanderRow<T>({ data, component, componentProps, extendedRowStyle }: ExpanderRowProps<T>): JSX.Element {
	const ExpandableComponent = component;

	return (
		<ExpanderRowStyle className="rdt_ExpanderRow" extendedRowStyle={extendedRowStyle}>
			<ExpandableComponent data={data} {...componentProps} />
		</ExpanderRowStyle>
	);
}

export default React.memo(ExpanderRow);
