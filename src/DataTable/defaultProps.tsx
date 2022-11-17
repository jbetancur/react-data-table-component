import React from 'react';
import FirstPageIcon from '../icons/FirstPage';
import LastPageIcon from '../icons/LastPage';
import LeftIcon from '../icons/Left';
import RightIcon from '../icons/Right';
import ExpanderCollapsedIcon from '../icons/ExpanderCollapsedIcon';
import ExpanderExpandedIcon from '../icons/ExpanderExpandedIcon';
import { noop } from './util';
import { Alignment, Direction } from './constants';

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
	expandableIcon: {
		collapsed: <ExpanderCollapsedIcon />,
		expanded: <ExpanderExpandedIcon />,
	},
	expandableRowsComponentProps: {},
	progressPending: false,
	progressComponent: <div style={{ fontSize: '24px', fontWeight: 700, padding: '24px' }}>Loading...</div>,
	persistTableHead: false,
	sortIcon: null,
	sortFunction: null,
	sortServer: false,
	striped: false,
	highlightOnHover: false,
	pointerOnHover: false,
	noContextMenu: false,
	contextMessage: { singular: 'item', plural: 'items', message: 'selected' },
	actions: null,
	contextActions: null,
	contextComponent: null,
	defaultSortFieldId: null,
	defaultSortAsc: true,
	responsive: true,
	noDataComponent: <div style={{ padding: '24px' }}>There are no records to display</div>,
	disabled: false,
	noTableHead: false,
	noHeader: false,
	subHeader: false,
	subHeaderAlign: Alignment.RIGHT,
	subHeaderWrap: true,
	subHeaderComponent: null,
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
	paginationRowsPerPageOptions: [10, 15, 20, 25, 30],
	paginationComponent: null,
	paginationComponentOptions: {},
	paginationIconFirstPage: <FirstPageIcon />,
	paginationIconLastPage: <LastPageIcon />,
	paginationIconNext: <RightIcon />,
	paginationIconPrevious: <LeftIcon />,
	dense: false,
	conditionalRowStyles: [],
	theme: 'default' as const,
	customStyles: {},
	direction: Direction.AUTO,
	onChangePage: noop,
	onChangeRowsPerPage: noop,
	onRowClicked: noop,
	onRowDoubleClicked: noop,
	onRowMouseEnter: noop,
	onRowMouseLeave: noop,
	onRowExpandToggled: noop,
	onSelectedRowsChange: noop,
	onSort: noop,
	onColumnOrderChange: noop,
};
