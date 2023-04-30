import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { tableReducer } from './tableReducer';
import Table from './Table';
import Head from './TableHead';
import HeadRow from './TableHeadRow';
import Row from './TableRow';
import Column from './TableCol';
import ColumnCheckbox from './TableColCheckbox';
import Header from './TableHeader';
import Subheader from './TableSubheader';
import Body from './TableBody';
import ResponsiveWrapper from './ResponsiveWrapper';
import ProgressWrapper from './ProgressWrapper';
import Wrapper from './TableWrapper';
import ColumnExpander from './TableColExpander';
import { CellBase } from './Cell';
import NoData from './NoDataWrapper';
import NativePagination from './Pagination';
import useDidUpdateEffect from '../hooks/useDidUpdateEffect';
import { prop, getNumberOfPages, sort, isEmpty, isRowSelected, recalculatePage } from './util';
import { defaultProps } from './defaultProps';
import { createStyles } from './styles';
import {
	Action,
	AllRowsAction,
	SingleRowAction,
	TableRow,
	SortAction,
	TableProps,
	TableState,
	SortOrder,
} from './types';
import useColumns from '../hooks/useColumns';

function DataTable<T>(props: TableProps<T>): JSX.Element {
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
		onRowRightClicked = defaultProps.onRowRightClicked,
		onRowDoubleClicked = defaultProps.onRowDoubleClicked,
		onRowMouseEnter = defaultProps.onRowMouseEnter,
		onRowMouseLeave = defaultProps.onRowMouseLeave,
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
		className,
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

	const sortedData = React.useMemo(() => {
		// server-side sorting bypasses internal sorting
		if (sortServer) {
			return data;
		}

		if (selectedColumn?.sortFunction && typeof selectedColumn.sortFunction === 'function') {
			const sortFn = selectedColumn.sortFunction;
			const customSortFunction = sortDirection === SortOrder.ASC ? sortFn : (a: T, b: T) => sortFn(a, b) * -1;

			return [...data].sort(customSortFunction);
		}

		return sort(data, selectedColumn?.selector, sortDirection, sortFunction);
	}, [sortServer, selectedColumn, sortDirection, data, sortFunction]);

	const tableRows = React.useMemo(() => {
		if (pagination && !paginationServer) {
			// when using client-side pagination we can just slice the rows set
			const lastIndex = currentPage * rowsPerPage;
			const firstIndex = lastIndex - rowsPerPage;

			return sortedData.slice(firstIndex, lastIndex);
		}

		return sortedData;
	}, [currentPage, pagination, paginationServer, rowsPerPage, sortedData]);

	const handleSort = React.useCallback((action: SortAction<T>) => {
		dispatch(action);
	}, []);

	const handleSelectAllRows = React.useCallback((action: AllRowsAction<T>) => {
		dispatch(action);
	}, []);

	const handleSelectedRow = React.useCallback((action: SingleRowAction<T>) => {
		dispatch(action);
	}, []);

	const handleRowClicked = React.useCallback((row, e) => onRowClicked(row, e), [onRowClicked]);

	const handleRowRightClicked = React.useCallback((row, e) => onRowRightClicked(row, e), [onRowRightClicked]);

	const handleRowDoubleClicked = React.useCallback((row, e) => onRowDoubleClicked(row, e), [onRowDoubleClicked]);

	const handleRowMouseEnter = React.useCallback((row, e) => onRowMouseEnter(row, e), [onRowMouseEnter]);

	const handleRowMouseLeave = React.useCallback((row, e) => onRowMouseLeave(row, e), [onRowMouseLeave]);

	const handleChangePage = React.useCallback(
		(page: number) =>
			dispatch({
				type: 'CHANGE_PAGE',
				page,
				paginationServer,
				visibleOnly: selectableRowsVisibleOnly,
				persistSelectedOnPageChange,
			}),
		[paginationServer, persistSelectedOnPageChange, selectableRowsVisibleOnly],
	);

	const handleChangeRowsPerPage = React.useCallback(
		(newRowsPerPage: number) => {
			const rowCount = paginationTotalRows || tableRows.length;
			const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
			const recalculatedPage = recalculatePage(currentPage, updatedPage);

			// update the currentPage for client-side pagination
			// server - side should be handled by onChangeRowsPerPage
			if (!paginationServer) {
				handleChangePage(recalculatedPage);
			}

			dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
		},
		[currentPage, handleChangePage, paginationServer, paginationTotalRows, tableRows.length],
	);

	const showTableHead = () => {
		if (noTableHead) {
			return false;
		}

		if (persistTableHead) {
			return true;
		}

		return sortedData.length > 0 && !progressPending;
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
	if (pagination && !paginationServer && sortedData.length > 0 && tableRows.length === 0) {
		const updatedPage = getNumberOfPages(sortedData.length, rowsPerPage);
		const recalculatedPage = recalculatePage(currentPage, updatedPage);

		handleChangePage(recalculatedPage);
	}

	useDidUpdateEffect(() => {
		onSelectedRowsChange({ allSelected, selectedCount, selectedRows: selectedRows.slice(0) });
		// onSelectedRowsChange trigger is controlled by toggleOnSelectedRowsChange state
	}, [toggleOnSelectedRowsChange]);

	useDidUpdateEffect(() => {
		onSort(selectedColumn, sortDirection, sortedData.slice(0));
		// do not update on sortedData
	}, [selectedColumn, sortDirection]);

	useDidUpdateEffect(() => {
		onChangePage(currentPage, paginationTotalRows || sortedData.length);
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

	React.useEffect(() => {
		dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
	}, [selectableRowsSingle, clearSelectedRows]);

	React.useEffect(() => {
		if (!selectableRowSelected) {
			return;
		}

		const preSelectedRows = sortedData.filter(row => selectableRowSelected(row));
		// if selectableRowsSingle mode then return the first match
		const selected = selectableRowsSingle ? preSelectedRows.slice(0, 1) : preSelectedRows;

		dispatch({
			type: 'SELECT_MULTIPLE_ROWS',
			keyField,
			selectedRows: selected,
			totalRows: sortedData.length,
			mergeSelections,
		});

		// We only want to update the selectedRowState if data changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, selectableRowSelected]);

	const visibleRows = selectableRowsVisibleOnly ? tableRows : sortedData;
	const showSelectAll = persistSelectedOnPageChange || selectableRowsSingle || selectableRowsNoSelectAll;

	return (
		<ThemeProvider theme={currentTheme}>
			{showHeader() && (
				<Header
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
				<Subheader align={subHeaderAlign} wrapContent={subHeaderWrap}>
					{subHeaderComponent}
				</Subheader>
			)}

			<ResponsiveWrapper
				responsive={responsive}
				fixedHeader={fixedHeader}
				fixedHeaderScrollHeight={fixedHeaderScrollHeight}
				className={className}
				{...wrapperProps}
			>
				<Wrapper>
					{progressPending && !persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

					<Table disabled={disabled} className="rdt_Table" role="table">
						{showTableHead() && (
							<Head className="rdt_TableHead" role="rowgroup" fixedHeader={fixedHeader}>
								<HeadRow className="rdt_TableHeadRow" role="row" dense={dense}>
									{selectableRows &&
										(showSelectAll ? (
											<CellBase style={{ flex: '0 0 48px' }} />
										) : (
											<ColumnCheckbox
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
									{expandableRows && !expandableRowsHideExpander && <ColumnExpander />}
									{tableColumns.map(column => (
										<Column
											key={column.id}
											column={column}
											selectedColumn={selectedColumn}
											disabled={progressPending || sortedData.length === 0}
											pagination={pagination}
											paginationServer={paginationServer}
											persistSelectedOnSort={persistSelectedOnSort}
											selectableRowsVisibleOnly={selectableRowsVisibleOnly}
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
								</HeadRow>
							</Head>
						)}

						{!sortedData.length && !progressPending && <NoData>{noDataComponent}</NoData>}

						{progressPending && persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

						{!progressPending && sortedData.length > 0 && (
							<Body className="rdt_TableBody" role="rowgroup">
								{tableRows.map((row, i) => {
									const key = prop(row as TableRow, keyField) as string | number;
									const id = isEmpty(key) ? i : key;
									const selected = isRowSelected(row, selectedRows, keyField);
									const expanderExpander = !!(expandableRows && expandableRowExpanded && expandableRowExpanded(row));
									const expanderDisabled = !!(expandableRows && expandableRowDisabled && expandableRowDisabled(row));

									return (
										<Row
											id={id}
											key={id}
											keyField={keyField}
											data-row-id={id}
											columns={tableColumns}
											row={row}
											rowCount={sortedData.length}
											rowIndex={i}
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
											selected={selected}
											selectableRowsHighlight={selectableRowsHighlight}
											selectableRowsComponent={selectableRowsComponent}
											selectableRowsComponentProps={selectableRowsComponentProps}
											selectableRowDisabled={selectableRowDisabled}
											selectableRowsSingle={selectableRowsSingle}
											striped={striped}
											onRowExpandToggled={onRowExpandToggled}
											onRowClicked={handleRowClicked}
											onRowRightClicked={handleRowRightClicked}
											onRowDoubleClicked={handleRowDoubleClicked}
											onRowMouseEnter={handleRowMouseEnter}
											onRowMouseLeave={handleRowMouseLeave}
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
							</Body>
						)}
					</Table>
				</Wrapper>
			</ResponsiveWrapper>

			{enabledPagination && (
				<div>
					<Pagination
						onChangePage={handleChangePage}
						onChangeRowsPerPage={handleChangeRowsPerPage}
						rowCount={paginationTotalRows || sortedData.length}
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
