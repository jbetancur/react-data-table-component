import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { tableReducer } from './tableReducer';
import Table from './Table';
import TableHead from './TableHead';
import TableHeadRow from './TableHeadRow';
import TableRow from './TableRow';
import TableCol from './TableCol';
import TableColCheckbox from './TableColCheckbox';
import TableHeader from './TableHeader';
import TableSubheader from './TableSubheader';
import TableBody from './TableBody';
import ResponsiveWrapper from './ResponsiveWrapper';
import ProgressWrapper from './ProgressWrapper';
import TableWrapper from './TableWrapper';
import TableColExpander from './TableColExpander';
import { CellBase } from './Cell';
import NoData from './NoDataWrapper';
import NativePagination from './Pagination';
import useDidUpdateEffect from '../hooks/useDidUpdateEffect';
import {
	decorateColumns,
	getColumnById,
	getNumberOfPages,
	getSortDirection,
	isEmpty,
	isRowSelected,
	recalculatePage,
	sort,
} from './util';
import { defaultProps } from './defaultProps';
import { createStyles } from './styles';
import { Action, AllRowsAction, SingleRowAction, RowRecord, SortAction, TableProps, TableState, FilterAction } from './types';

function DataTable<T extends RowRecord>(props: TableProps<T>): JSX.Element {
	const {
		data = defaultProps.data,
		columns = defaultProps.columns,
		title = defaultProps.title,
		actions = defaultProps.actions,
		keyField = defaultProps.keyField,
		striped = defaultProps.striped,
		highlightOnHover = defaultProps.highlightOnHover,
		pointerOnHover = defaultProps.pointerOnHover,
		dense = defaultProps.dense,
		selectableRows = defaultProps.selectableRows,
		selectableRowsHighlight = defaultProps.selectableRowsHighlight,
		selectableRowsNoSelectAll = defaultProps.selectableRowsNoSelectAll,
		selectableRowsVisibleOnly = defaultProps.selectableRowsVisibleOnly,
		selectableRowSelected = defaultProps.selectableRowSelected,
		selectableRowDisabled = defaultProps.selectableRowDisabled,
		selectableRowsComponent = defaultProps.selectableRowsComponent,
		selectableRowsComponentProps = defaultProps.selectableRowsComponentProps,
		onRowExpandToggled = defaultProps.onRowExpandToggled,
		onSelectedRowsChange = defaultProps.onSelectedRowsChange,
		expandableIcon = defaultProps.expandableIcon,
		onChangeRowsPerPage = defaultProps.onChangeRowsPerPage,
		onChangePage = defaultProps.onChangePage,
		paginationServer = defaultProps.paginationServer,
		paginationServerOptions = defaultProps.paginationServerOptions,
		paginationTotalRows = defaultProps.paginationTotalRows,
		paginationDefaultPage = defaultProps.paginationDefaultPage,
		paginationResetDefaultPage = defaultProps.paginationResetDefaultPage,
		paginationPerPage = defaultProps.paginationPerPage,
		paginationRowsPerPageOptions = defaultProps.paginationRowsPerPageOptions,
		paginationIconLastPage = defaultProps.paginationIconLastPage,
		paginationIconFirstPage = defaultProps.paginationIconFirstPage,
		paginationIconNext = defaultProps.paginationIconNext,
		paginationIconPrevious = defaultProps.paginationIconPrevious,
		paginationComponent = defaultProps.paginationComponent,
		paginationComponentOptions = defaultProps.paginationComponentOptions,
		responsive = defaultProps.responsive,
		overflowY = defaultProps.overflowY,
		overflowYOffset = defaultProps.overflowYOffset,
		progressPending = defaultProps.progressPending,
		progressComponent = defaultProps.progressComponent,
		persistTableHead = defaultProps.persistTableHead,
		noDataComponent = defaultProps.noDataComponent,
		disabled = defaultProps.disabled,
		noTableHead = defaultProps.noTableHead,
		noHeader = defaultProps.noHeader,
		fixedHeader = defaultProps.fixedHeader,
		fixedHeaderScrollHeight = defaultProps.fixedHeaderScrollHeight,
		pagination = defaultProps.pagination,
		subHeader = defaultProps.subHeader,
		subHeaderAlign = defaultProps.subHeaderAlign,
		subHeaderWrap = defaultProps.subHeaderWrap,
		subHeaderComponent = defaultProps.subHeaderComponent,
		noContextMenu = defaultProps.noContextMenu,
		contextMessage = defaultProps.contextMessage,
		contextActions = defaultProps.contextActions,
		contextComponent = defaultProps.contextComponent,
		expandableRows = defaultProps.expandableRows,
		onRowClicked = defaultProps.onRowClicked,
		onRowDoubleClicked = defaultProps.onRowDoubleClicked,
		sortIcon = defaultProps.sortIcon,
		onSort = defaultProps.onSort,
		onFilter = defaultProps.onFilter,
		sortFunction = defaultProps.sortFunction,
		sortServer = defaultProps.sortServer,
		filterServer = defaultProps.filterServer,
		expandableRowsComponent = defaultProps.expandableRowsComponent,
		expandableRowDisabled = defaultProps.expandableRowDisabled,
		expandableRowsHideExpander = defaultProps.expandableRowsHideExpander,
		expandOnRowClicked = defaultProps.expandOnRowClicked,
		expandOnRowDoubleClicked = defaultProps.expandOnRowDoubleClicked,
		expandableRowExpanded = defaultProps.expandableRowExpanded,
		expandableInheritConditionalStyles = defaultProps.expandableInheritConditionalStyles,
		defaultSortFieldId = defaultProps.defaultSortFieldId,
		defaultSortAsc = defaultProps.defaultSortAsc,
		clearSelectedRows = defaultProps.clearSelectedRows,
		conditionalRowStyles = defaultProps.conditionalRowStyles,
		theme = defaultProps.theme,
		customStyles = defaultProps.customStyles,
		direction = defaultProps.direction,
	} = props;

	// decorate columns with additional metadata required by RDT
	const columnsMemo = React.useMemo(() => decorateColumns<T>(columns), [columns]);
	const defaultSortDirection = getSortDirection(defaultSortAsc);
	const defaultSortColumn = React.useMemo(() => getColumnById<T>(defaultSortFieldId, columnsMemo), [
		columnsMemo,
		defaultSortFieldId,
	]);

	// Run once
	const initialState: TableState<T> = React.useMemo(
		() => ({
			allSelected: false,
			allRows: [],
			filterActive: false,
			filters: {},
			rows: defaultSortColumn?.selector
				? sort(data, defaultSortColumn.selector, defaultSortDirection, sortFunction)
				: data,
			selectedCount: 0,
			selectedRows: [],
			selectedColumn: defaultSortColumn || { name: '' },
			sortDirection: defaultSortDirection,
			currentPage: paginationDefaultPage,
			rowsPerPage: paginationPerPage,
			selectedRowsFlag: false,
			contextMessage: defaultProps.contextMessage,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const [
		{ rowsPerPage, rows, currentPage, selectedRows, allSelected, selectedCount,
			selectedColumn, sortDirection, filters, filterActive },
		dispatch,
	] = React.useReducer<React.Reducer<TableState<T>, Action<T>>>(tableReducer, initialState);

	const { persistSelectedOnSort = false, persistSelectedOnPageChange = false } = paginationServerOptions;
	const mergeSelections = !!(paginationServer && (persistSelectedOnPageChange || persistSelectedOnSort));
	const enabledPagination = pagination && !progressPending && data.length > 0;
	const Pagination = paginationComponent || NativePagination;

	const currentTheme = React.useMemo(() => createStyles(customStyles, theme), [customStyles, theme]);
	const expandableRowsComponentMemo = React.useMemo(() => expandableRowsComponent, [expandableRowsComponent]);
	const wrapperProps = React.useMemo(() => ({ ...(direction !== 'auto' && { dir: direction }) }), [direction]);

	const calculatedRows = React.useMemo(() => {
		if (pagination && !paginationServer) {
			// when using client-side pagination we can just slice the rows set
			const lastIndex = currentPage * rowsPerPage;
			const firstIndex = lastIndex - rowsPerPage;

			return rows.slice(firstIndex, lastIndex);
		}

		return rows;
	}, [currentPage, pagination, paginationServer, rows, rowsPerPage]);

	const handleSort = (action: SortAction<T>) => {
		dispatch(action);
	};

	const handleFilter = (action: FilterAction<T>) => {
		dispatch(action);
	};

	const handleSelectAllRows = (action: AllRowsAction<T>) => {
		dispatch(action);
	};

	const handleSelectedRow = (action: SingleRowAction<T>) => {
		dispatch(action);
	};

	const handleRowClicked = React.useCallback((row, e) => onRowClicked(row, e), [onRowClicked]);

	const handleRowDoubleClicked = React.useCallback((row, e) => onRowDoubleClicked(row, e), [onRowDoubleClicked]);

	const handleChangePage = (page: number) =>
		dispatch({
			type: 'CHANGE_PAGE',
			page,
			paginationServer,
			visibleOnly: selectableRowsVisibleOnly,
			persistSelectedOnPageChange,
		});

	const handleChangeRowsPerPage = (newRowsPerPage: number) => {
		const rowCount = paginationTotalRows || calculatedRows.length;
		const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
		const recalculatedPage = recalculatePage(currentPage, updatedPage);

		// update the currentPage for client-side pagination
		// server - side should be handled by onChangeRowsPerPage
		if (!paginationServer) {
			handleChangePage(recalculatedPage);
		}

		dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
	};

	const showTableHead = () => {
		if (noTableHead) {
			return false;
		}

		if (persistTableHead) {
			return true;
		}

		return filterActive || (rows.length > 0 && !progressPending);
	};

	const showHeader = () => {
		if (noHeader) {
			return false;
		}

		if (title) {
			return true;
		}

		if (actions) {
			return true;
		}

		return false;
	};

	// recalculate the pagination and currentPage if the rows length changes
	if (pagination && !paginationServer && rows.length > 0 && calculatedRows.length === 0) {
		const updatedPage = getNumberOfPages(rows.length, rowsPerPage);
		const recalculatedPage = recalculatePage(currentPage, updatedPage);

		handleChangePage(recalculatedPage);
	}

	useDidUpdateEffect(() => {
		onSelectedRowsChange({ allSelected, selectedCount, selectedRows });
	}, [selectedCount]);

	useDidUpdateEffect(() => {
		onChangePage(currentPage, paginationTotalRows || rows.length);
	}, [currentPage]);

	useDidUpdateEffect(() => {
		onChangeRowsPerPage(rowsPerPage, currentPage);
	}, [rowsPerPage]);

	useDidUpdateEffect(() => {
		onSort(selectedColumn, sortDirection);
	}, [selectedColumn, sortDirection]);

	useDidUpdateEffect(() => {
		onFilter(filters)
	}, [filters]);

	useDidUpdateEffect(() => {
		handleChangePage(paginationDefaultPage);
	}, [paginationDefaultPage, paginationResetDefaultPage]);

	useDidUpdateEffect(() => {
		if (pagination && paginationServer && paginationTotalRows > 0) {
			const updatedPage = getNumberOfPages(paginationTotalRows, rowsPerPage);
			const recalculatedPage = recalculatePage(currentPage, updatedPage);
			if (currentPage !== recalculatedPage) {
				handleChangePage(recalculatedPage);
			}
		}
	}, [paginationTotalRows]);

	React.useEffect(() => {
		dispatch({
			type: 'UPDATE_ROWS',
			rows: defaultSortColumn?.selector
				? sort(data, defaultSortColumn.selector, defaultSortDirection, sortFunction)
				: data,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	React.useEffect(() => {
		dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
	}, [clearSelectedRows]);

	React.useEffect(() => {
		if (selectableRowSelected) {
			const preSelectedRows = rows.filter(row => selectableRowSelected(row));

			dispatch({ type: 'SELECT_MULTIPLE_ROWS', keyField, selectedRows: preSelectedRows, rows: rows, mergeSelections });
		}
		// We only want to re-render if the rows changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rows]);

	const rowData = selectableRowsVisibleOnly ? calculatedRows : rows;
	const showSelectAll = persistSelectedOnPageChange || selectableRowsNoSelectAll;

	return (
		<ThemeProvider theme={currentTheme}>
			{showHeader() && (
				<TableHeader
					title={title}
					actions={actions}
					showMenu={!noContextMenu}
					selectedCount={selectedCount}
					direction={direction}
					contextActions={contextActions}
					contextComponent={contextComponent}
					contextMessage={contextMessage}
				/>
			)}

			{subHeader && (
				<TableSubheader align={subHeaderAlign} wrapContent={subHeaderWrap}>
					{subHeaderComponent}
				</TableSubheader>
			)}

			<ResponsiveWrapper
				responsive={responsive}
				overflowYOffset={overflowYOffset}
				overflowY={overflowY}
				{...wrapperProps}
			>
				<TableWrapper>
					{progressPending && !persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

					<Table disabled={disabled} className="rdt_Table" role="table">
						{showTableHead() && (
							<TableHead className="rdt_TableHead" role="rowgroup">
								<TableHeadRow className="rdt_TableHeadRow" role="row" dense={dense}>
									{selectableRows &&
										(showSelectAll ? (
											<CellBase style={{ flex: '0 0 48px' }} />
										) : (
											<TableColCheckbox
												allSelected={allSelected}
												selectedRows={selectedRows}
												selectableRowsComponent={selectableRowsComponent}
												selectableRowsComponentProps={selectableRowsComponentProps}
												selectableRowDisabled={selectableRowDisabled}
												rowData={rowData}
												keyField={keyField}
												mergeSelections={mergeSelections}
												onSelectAllRows={handleSelectAllRows}
											/>
										))}
									{expandableRows && !expandableRowsHideExpander && <TableColExpander />}
									{columnsMemo.map(column => (
										<TableCol
											key={column.id}
											column={column}
											disabled={progressPending || rows.length === 0}
											rows={rows}
											pagination={pagination}
											paginationServer={paginationServer}
											persistSelectedOnSort={persistSelectedOnSort}
											selectableRowsVisibleOnly={selectableRowsVisibleOnly}
											selectedColumn={selectedColumn}
											sortFunction={sortFunction}
											sortDirection={sortDirection}
											sortIcon={sortIcon}
											sortServer={sortServer}
											filterServer={ filterServer }
											onSort={handleSort}
											onFilter={handleFilter}
										/>
									))}
								</TableHeadRow>
							</TableHead>
						)}

						{!rows.length && !progressPending && !filterActive && <NoData>{noDataComponent}</NoData>}

						{progressPending && persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

						{!progressPending && rows.length > 0 && (
							<TableBody
								fixedHeader={fixedHeader}
								fixedHeaderScrollHeight={fixedHeaderScrollHeight}
								hasOffset={overflowY}
								offset={overflowYOffset}
								className="rdt_TableBody"
								role="rowgroup"
							>
								{calculatedRows.map((row, i) => {
									const id = isEmpty(row[keyField]) ? i : row[keyField];
									const selected = isRowSelected(row, selectedRows, keyField);
									const expanderExpander = !!(expandableRows && expandableRowExpanded && expandableRowExpanded(row));
									const expanderDisabled = !!(expandableRows && expandableRowDisabled && expandableRowDisabled(row));

									return (
										<TableRow
											id={id}
											key={id}
											keyField={keyField}
											row={row}
											columns={columnsMemo}
											selectableRows={selectableRows}
											expandableRows={expandableRows}
											expandableIcon={expandableIcon}
											highlightOnHover={highlightOnHover}
											pointerOnHover={pointerOnHover}
											dense={dense}
											expandOnRowClicked={expandOnRowClicked}
											expandOnRowDoubleClicked={expandOnRowDoubleClicked}
											expandableRowsComponent={expandableRowsComponentMemo}
											expandableRowsHideExpander={expandableRowsHideExpander}
											defaultExpanderDisabled={expanderDisabled}
											defaultExpanded={expanderExpander}
											expandableInheritConditionalStyles={expandableInheritConditionalStyles}
											conditionalRowStyles={conditionalRowStyles}
											rowCount={rows.length}
											rowIndex={i}
											selected={selected}
											selectableRowsHighlight={selectableRowsHighlight}
											selectableRowsComponent={selectableRowsComponent}
											selectableRowsComponentProps={selectableRowsComponentProps}
											selectableRowDisabled={selectableRowDisabled}
											striped={striped}
											onRowExpandToggled={onRowExpandToggled}
											onRowClicked={handleRowClicked}
											onRowDoubleClicked={handleRowDoubleClicked}
											onSelectedRow={handleSelectedRow}
										/>
									);
								})}
							</TableBody>
						)}
					</Table>
				</TableWrapper>
			</ResponsiveWrapper>

			{enabledPagination && (
				<div>
					<Pagination
						onChangePage={handleChangePage}
						onChangeRowsPerPage={handleChangeRowsPerPage}
						rowCount={paginationTotalRows || rows.length}
						currentPage={currentPage}
						rowsPerPage={rowsPerPage}
						direction={direction}
						paginationRowsPerPageOptions={paginationRowsPerPageOptions}
						paginationIconLastPage={paginationIconLastPage}
						paginationIconFirstPage={paginationIconFirstPage}
						paginationIconNext={paginationIconNext}
						paginationIconPrevious={paginationIconPrevious}
						paginationComponentOptions={paginationComponentOptions}
					/>
				</div>
			)}
		</ThemeProvider>
	);
}

export default React.memo(DataTable) as typeof DataTable;
