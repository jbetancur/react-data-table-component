import * as React from 'react';
import styled, { CSSObject } from 'styled-components';

// Make "data" available on our any child component
// eslint-disable-next-line arrow-body-style
function renderChildren<T>(children: React.ReactElement, data: T) {
	return React.Children.map(children, child => React.cloneElement(child, { data }));
}

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
	children: React.ReactElement;
	extendedRowStyle: CSSObject;
};

function ExpanderRow<T>({ data, children, extendedRowStyle }: ExpanderRowProps<T>): JSX.Element {
	return (
		<ExpanderRowStyle className="rdt_ExpanderRow" extendedRowStyle={extendedRowStyle}>
			{renderChildren(children, data)}
		</ExpanderRowStyle>
	);
}

export default ExpanderRow;
