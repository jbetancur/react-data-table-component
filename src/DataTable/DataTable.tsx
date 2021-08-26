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
import { getNumberOfPages, setRowData, isEmpty, isRowSelected, recalculatePage } from './util';
import { defaultProps } from './defaultProps';
import { createStyles } from './styles';
import { Action, AllRowsAction, SingleRowAction, RowRecord, SortAction, TableProps, TableState } from './types';
import useColumns from '../hooks/useColumns';

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
		selectableRowsSingle = defaultProps.selectableRowsSingle,
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
		sortFunction = defaultProps.sortFunction,
		sortServer = defaultProps.sortServer,
		expandableRowsComponent = defaultProps.expandableRowsComponent,
		expandableRowsComponentProps = defaultProps.expandableRowsComponentProps,
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
		onColumnOrderChange = defaultProps.onColumnOrderChange,
	} = props;

	const {
		tableColumns,
		draggingColumnId,
		handleDragStart,
		handleDragEnter,
		handleDragOver,
		handleDragLeave,
		handleDragEnd,
		defaultSortDirection,
		defaultSortColumn,
	} = useColumns(columns, onColumnOrderChange, defaultSortFieldId, defaultSortAsc);

	const [
		{
			rowsPerPage,
			rows,
			currentPage,
			selectedRows,
			allSelected,
			selectedCount,
			selectedColumn,
			sortDirection,
			toggleOnSelectedRowsChange,
		},
		dispatch,
	] = React.useReducer<React.Reducer<TableState<T>, Action<T>>>(tableReducer, {
		rows: setRowData(data, defaultSortColumn?.selector, defaultSortDirection, sortServer, sortFunction),
		allSelected: false,
		selectedCount: 0,
		selectedRows: [],
		selectedColumn: defaultSortColumn,
		toggleOnSelectedRowsChange: false,
		sortDirection: defaultSortDirection,
		currentPage: paginationDefaultPage,
		rowsPerPage: paginationPerPage,
		selectedRowsFlag: false,
		contextMessage: defaultProps.contextMessage,
	});

	const { persistSelectedOnSort = false, persistSelectedOnPageChange = false } = paginationServerOptions;
	const mergeSelections = !!(paginationServer && (persistSelectedOnPageChange || persistSelectedOnSort));
	const enabledPagination = pagination && !progressPending && data.length > 0;
	const Pagination = paginationComponent || NativePagination;

	const currentTheme = React.useMemo(() => createStyles(customStyles, theme), [customStyles, theme]);
	const wrapperProps = React.useMemo(() => ({ ...(direction !== 'auto' && { dir: direction }) }), [direction]);

	const tableRows = React.useMemo(() => {
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
		const rowCount = paginationTotalRows || tableRows.length;
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

		return rows.length > 0 && !progressPending;
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
	if (pagination && !paginationServer && rows.length > 0 && tableRows.length === 0) {
		const updatedPage = getNumberOfPages(rows.length, rowsPerPage);
		const recalculatedPage = recalculatePage(currentPage, updatedPage);

		handleChangePage(recalculatedPage);
	}

	useDidUpdateEffect(() => {
		onSelectedRowsChange({ allSelected, selectedCount, selectedRows });
		// onSelectedRowsChange trigger is controlled by toggleOnSelectedRowsChange state
	}, [toggleOnSelectedRowsChange]);

	useDidUpdateEffect(() => {
		onSort(selectedColumn, sortDirection);
	}, [selectedColumn, sortDirection]);

	useDidUpdateEffect(() => {
		onChangePage(currentPage, paginationTotalRows || rows.length);
	}, [currentPage]);

	useDidUpdateEffect(() => {
		onChangeRowsPerPage(rowsPerPage, currentPage);
	}, [rowsPerPage]);

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

	useDidUpdateEffect(() => {
		dispatch({
			type: 'UPDATE_ROWS',
			rows: setRowData(data, defaultSortColumn?.selector, defaultSortDirection, sortServer, sortFunction),
		});
	}, [data]);

	React.useEffect(() => {
		dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
	}, [selectableRowsSingle, clearSelectedRows]);

	React.useEffect(() => {
		if (selectableRowSelected && !selectableRowsSingle) {
			const preSelectedRows = rows.filter(row => selectableRowSelected(row));

			dispatch({ type: 'SELECT_MULTIPLE_ROWS', keyField, selectedRows: preSelectedRows, rows: rows, mergeSelections });
		}
		// We only want to update the selectedRowState if data changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const visibleRows = selectableRowsVisibleOnly ? tableRows : rows;
	const showSelectAll = persistSelectedOnPageChange || selectableRowsSingle || selectableRowsNoSelectAll;

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
				fixedHeader={fixedHeader}
				fixedHeaderScrollHeight={fixedHeaderScrollHeight}
				{...wrapperProps}
			>
				<TableWrapper>
					{progressPending && !persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

					<Table disabled={disabled} className="rdt_Table" role="table">
						{showTableHead() && (
							<TableHead className="rdt_TableHead" role="rowgroup" fixedHeader={fixedHeader}>
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
												rowData={visibleRows}
												keyField={keyField}
												mergeSelections={mergeSelections}
												onSelectAllRows={handleSelectAllRows}
											/>
										))}
									{expandableRows && !expandableRowsHideExpander && <TableColExpander />}
									{tableColumns.map(column => (
										<TableCol
											key={column.id}
											column={column}
											selectedColumn={selectedColumn}
											disabled={progressPending || rows.length === 0}
											rows={rows}
											pagination={pagination}
											paginationServer={paginationServer}
											persistSelectedOnSort={persistSelectedOnSort}
											selectableRowsVisibleOnly={selectableRowsVisibleOnly}
											sortFunction={sortFunction}
											sortDirection={sortDirection}
											sortIcon={sortIcon}
											sortServer={sortServer}
											onSort={handleSort}
											onDragStart={handleDragStart}
											onDragOver={handleDragOver}
											onDragEnd={handleDragEnd}
											onDragEnter={handleDragEnter}
											onDragLeave={handleDragLeave}
											draggingColumnId={draggingColumnId}
										/>
									))}
								</TableHeadRow>
							</TableHead>
						)}

						{!rows.length && !progressPending && <NoData>{noDataComponent}</NoData>}

						{progressPending && persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

						{!progressPending && rows.length > 0 && (
							<TableBody className="rdt_TableBody" role="rowgroup">
								{tableRows.map((row, i) => {
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
											data-row-id={row[keyField]}
											columns={tableColumns}
											selectableRows={selectableRows}
											expandableRows={expandableRows}
											expandableIcon={expandableIcon}
											highlightOnHover={highlightOnHover}
											pointerOnHover={pointerOnHover}
											dense={dense}
											expandOnRowClicked={expandOnRowClicked}
											expandOnRowDoubleClicked={expandOnRowDoubleClicked}
											expandableRowsComponent={expandableRowsComponent}
											expandableRowsComponentProps={expandableRowsComponentProps}
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
											selectableRowsSingle={selectableRowsSingle}
											striped={striped}
											onRowExpandToggled={onRowExpandToggled}
											onRowClicked={handleRowClicked}
											onRowDoubleClicked={handleRowDoubleClicked}
											onSelectedRow={handleSelectedRow}
											draggingColumnId={draggingColumnId}
											onDragStart={handleDragStart}
											onDragOver={handleDragOver}
											onDragEnd={handleDragEnd}
											onDragEnter={handleDragEnter}
											onDragLeave={handleDragLeave}
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
