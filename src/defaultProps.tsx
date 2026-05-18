import React from 'react';
import FirstPageIcon from './icons/FirstPage';
import LastPageIcon from './icons/LastPage';
import LeftIcon from './icons/Left';
import RightIcon from './icons/Right';
import ExpanderCollapsedIcon from './icons/ExpanderCollapsedIcon';
import ExpanderExpandedIcon from './icons/ExpanderExpandedIcon';
import { noop } from './util';
import { Alignment, Direction } from './constants';
import type { PaginationIcons, ExpandableIcon } from './types';

export const DEFAULT_PAGINATION_ICONS: Required<PaginationIcons> = {
	first: <FirstPageIcon />,
	last: <LastPageIcon />,
	next: <RightIcon />,
	previous: <LeftIcon />,
};

export const DEFAULT_EXPANDABLE_ICON: Required<ExpandableIcon> = {
	collapsed: <ExpanderCollapsedIcon />,
	expanded: <ExpanderExpandedIcon />,
};

export const defaultProps = {
	columns: [],
	data: [],
	title: '',
	keyField: 'id',
	selectableRows: false,
	selectableRowsHighlight: false,
	selectableRowsNoSelectAll: false,
	selectableRowSelected: null,
	selectableRowDisabled: null,
	selectableRowsComponent: 'input' as const,
	selectableRowsComponentProps: {},
	selectableRowsVisibleOnly: false,
	selectableRowsSingle: false,
	clearSelectedRows: false,
	expandableRows: false,
	expandableRowDisabled: null,
	expandableRowExpanded: null,
	expandOnRowClicked: false,
	expandableRowsHideExpander: false,
	expandOnRowDoubleClicked: false,
	expandableInheritConditionalStyles: false,
	expandableRowsComponent: function DefaultExpander(): JSX.Element {
		return (
			<div>
				To add an expander pass in a component instance via <strong>expandableRowsComponent</strong>. You can then
				access props.data from this component.
			</div>
		);
	},
	expandableIcon: DEFAULT_EXPANDABLE_ICON,
	expandableRowsComponentProps: {},
	progressPending: false,
	progressComponent: (
		<div
			style={{
				width: 28,
				height: 28,
				borderRadius: '50%',
				border: '3px solid var(--rdt-color-divider, rgba(0,0,0,0.12))',
				borderTopColor: 'var(--rdt-color-text-primary, rgba(0,0,0,0.87))',
				animation: 'rdt_spin 0.7s linear infinite',
			}}
		/>
	),
	persistTableHead: false,
	sortIcon: null,
	sortFunction: null,
	sortServer: false,
	striped: false,
	highlightOnHover: false,
	pointerOnHover: false,
	actions: null,
	defaultSortFieldId: null,
	defaultSortAsc: true,
	responsive: true,
	noDataComponent: <div style={{ padding: '24px' }}>There are no records to display</div>,
	disabled: false,
	noTableHead: false,
	noHeader: false,
	subHeader: undefined,
	subHeaderAlign: Alignment.RIGHT,
	subHeaderWrap: true,
	fixedHeader: false,
	fixedHeaderScrollHeight: '100vh',
	pagination: false,
	paginationServer: false,
	paginationServerOptions: {
		persistSelectedOnSort: false,
		persistSelectedOnPageChange: false,
	},
	paginationDefaultPage: 1,
	paginationResetDefaultPage: false,
	paginationTotalRows: 0,
	paginationPerPage: 10,
	paginationPosition: 'bottom' as const,
	paginationRowsPerPageOptions: [10, 15, 20, 25, 30],
	paginationComponent: null,
	paginationComponentOptions: {},
	paginationIcons: DEFAULT_PAGINATION_ICONS,
	dense: false,
	conditionalRowStyles: [],
	theme: 'default' as const,
	colorMode: 'light' as const,
	customStyles: {},
	direction: Direction.AUTO,
	onChangePage: noop,
	onChangeRowsPerPage: noop,
	onRowClicked: noop,
	onRowDoubleClicked: noop,
	onRowMiddleClicked: noop,
	onRowMouseEnter: noop,
	onRowMouseLeave: noop,
	onRowExpandToggled: noop,
	onSelectedRowsChange: noop,
	onSort: noop,
	onColumnOrderChange: noop,
};
