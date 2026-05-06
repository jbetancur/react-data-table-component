import * as React from 'react';
import '../DataTable.css';
import { TableColumnBase } from '../types';

export type CellProps = Pick<
	TableColumnBase,
	'button' | 'grow' | 'maxWidth' | 'minWidth' | 'width' | 'right' | 'center' | 'compact' | 'hide' | 'allowOverflow'
>;

type CellBaseProps = React.HTMLAttributes<HTMLDivElement> & {
	$headCell?: boolean;
	$noPadding?: boolean;
	headStyle?: React.CSSProperties;
	cellStyle?: React.CSSProperties;
};

export function CellBase({
	$headCell,
	$noPadding,
	headStyle,
	cellStyle,
	className,
	style,
	...rest
}: CellBaseProps): JSX.Element {
	const baseClass = ['rdt_cellBase', $headCell && 'rdt_cellBaseHead', $noPadding && 'rdt_cellNoPadding', className]
		.filter(Boolean)
		.join(' ');
	return <div className={baseClass} style={{ ...($headCell ? headStyle : cellStyle), ...style }} {...rest} />;
}

export function buildCellStyle(props: CellProps): React.CSSProperties {
	const { button, grow, maxWidth, minWidth, width, right, center, compact } = props;
	return {
		flexGrow: grow === 0 || button ? 0 : (grow ?? 1),
		flexShrink: 0,
		flexBasis: 0,
		maxWidth: width ?? maxWidth ?? '100%',
		minWidth: width ?? minWidth ?? '100px',
		justifyContent: right ? 'flex-end' : center || button ? 'center' : undefined,
		padding: compact || button ? 0 : undefined,
	};
}

export function buildHideClass(hide: CellProps['hide']): string {
	if (!hide) return '';
	if (hide === 'sm') return 'rdt_hideOnSm';
	if (hide === 'md') return 'rdt_hideOnMd';
	if (hide === 'lg') return 'rdt_hideOnLg';
	return '';
}

type CellExtendedProps = React.HTMLAttributes<HTMLDivElement> &
	CellProps & {
		$headCell?: boolean;
		$noPadding?: boolean;
		headStyle?: React.CSSProperties;
		cellStyle?: React.CSSProperties;
	};

export function CellExtended({
	button,
	grow,
	maxWidth,
	minWidth,
	width,
	right,
	center,
	compact,
	hide,
	allowOverflow,
	$headCell,
	$noPadding,
	headStyle,
	cellStyle,
	className,
	style,
	...rest
}: CellExtendedProps): JSX.Element {
	const cellProps: CellProps = { button, grow, maxWidth, minWidth, width, right, center, compact, hide, allowOverflow };
	const computedStyle = buildCellStyle(cellProps);
	const hideClass = buildHideClass(hide);
	const baseClass = [
		'rdt_cellBase',
		$headCell && 'rdt_cellBaseHead',
		$noPadding && 'rdt_cellNoPadding',
		hideClass,
		className,
	]
		.filter(Boolean)
		.join(' ');
	return (
		<div
			className={baseClass}
			style={{ ...($headCell ? headStyle : cellStyle), ...computedStyle, ...style }}
			{...rest}
		/>
	);
}
