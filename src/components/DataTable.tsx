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
} from '../util';
import { defaultProps } from '../defaultProps';
import { createStyles } from '../styles';
import { Action, AllRowsAction, SingleRowAction, RowRecord, SortAction, TableProps, TableState } from '../types';
import { Direction } from '../constants';

function DataTable<T extends RowRecord>({
	data = defaultProps.data,
	columns = defaultProps.columns,
	title = defaultProps.title,
	options = defaultProps.options,
	progressPending = defaultProps.progressPending,
	disabled = defaultProps.disabled,
	actions = defaultProps.actions,
	contextActions = defaultProps.contextActions,
	clearSelectedRows = defaultProps.clearSelectedRows,
	onRowExpandToggled = defaultProps.onRowExpandToggled,
	onSelectedRowsChange = defaultProps.onSelectedRowsChange,
	onChangeRowsPerPage = defaultProps.onChangeRowsPerPage,
	onChangePage = defaultProps.onChangePage,
	onRowClicked = defaultProps.onRowClicked,
	onRowDoubleClicked = defaultProps.onRowDoubleClicked,
	onSort = defaultProps.onSort,
}: TableProps<T>): JSX.Element {
	// merge object based related properties
	const optionsMerged = { ...defaultProps.options, ...options };
	const paginationOptionsMerged = { ...defaultProps.options.paginationOptions, ...options.paginationOptions };
	const paginationServerOptionsMerged = {
		...defaultProps.options.paginationServerOptions,
		...options.paginationServerOptions,
	};

	// decorate columns with additional metadata required by RDT
	const columnsMemo = React.useMemo(() => decorateColumns<T>(columns), [columns]);
	const defaultSortDirection = getSortDirection(optionsMerged.defaultSortAsc);
	const defaultSortColumn = React.useMemo(() => getColumnById<T>(optionsMerged.defaultSortFieldId, columnsMemo), [
		columnsMemo,
		optionsMerged.defaultSortFieldId,
	]);

	// Bootstrap the initial table state
	const initialState: TableState<T> = React.useMemo(
		() => ({
			allSelected: false,
			rows: defaultSortColumn?.selector
				? sort(data, defaultSortColumn.selector, defaultSortDirection, optionsMerged.sortFunction)
				: data,
			selectedCount: 0,
			selectedRows: [],
			selectedColumn: defaultSortColumn || { name: '' },
			sortDirection: defaultSortDirection,
			currentPage: paginationOptionsMerged.defaultPage,
			rowsPerPage: paginationOptionsMerged.perPage,
			selectedRowsFlag: false,
			contextMessage: optionsMerged.contextMessage,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const [
		{ rowsPerPage, rows, currentPage, selectedRows, allSelected, selectedCount, selectedColumn, sortDirection },
		dispatch,
	] = React.useReducer<React.Reducer<TableState<T>, Action<T>>>(tableReducer, initialState);

	const mergeSelections = !!(
		optionsMerged.paginationServer &&
		(paginationServerOptionsMerged.persistSelectedOnPageChange || paginationServerOptionsMerged.persistSelectedOnSort)
	);
	const enabledPagination = optionsMerged.pagination && !progressPending && data.length > 0;
	const Pagination = paginationOptionsMerged.component || NativePagination;

	const currentTheme = React.useMemo(() => createStyles(optionsMerged.customStyles, optionsMerged.theme), [
		optionsMerged.customStyles,
		optionsMerged.theme,
	]);
	const expandableRowsComponentMemo = React.useMemo(() => optionsMerged.expandableRowsComponent, [
		optionsMerged.expandableRowsComponent,
	]);
	const wrapperProps = React.useMemo(
		() => ({ ...(optionsMerged.direction !== Direction.AUTO && { dir: optionsMerged.direction }) }),
		[optionsMerged.direction],
	);

	const calculatedRows = React.useMemo(() => {
		if (optionsMerged.pagination && !optionsMerged.paginationServer) {
			// when using client-side pagination we can just slice the rows set
			const lastIndex = currentPage * rowsPerPage;
			const firstIndex = lastIndex - rowsPerPage;

			return rows.slice(firstIndex, lastIndex);
		}

		return rows;
	}, [currentPage, optionsMerged.pagination, optionsMerged.paginationServer, rows, rowsPerPage]);

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
			paginationServer: optionsMerged.paginationServer,
			visibleOnly: optionsMerged.selectableRowsVisibleOnly,
			persistSelectedOnPageChange: paginationServerOptionsMerged.persistSelectedOnPageChange || false,
		});

	const handleChangeRowsPerPage = (newRowsPerPage: number) => {
		const rowCount = paginationServerOptionsMerged.totalRows || calculatedRows.length;
		const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
		const recalculatedPage = recalculatePage(currentPage, updatedPage);

		// update the currentPage for client-side pagination
		// server - side should be handled by onChangeRowsPerPage
		if (!optionsMerged.paginationServer) {
			handleChangePage(recalculatedPage);
		}

		dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
	};

	const showTableHead = () => {
		if (optionsMerged.noTableHead) {
			return false;
		}

		if (optionsMerged.persistTableHead) {
			return true;
		}

		return rows.length > 0 && !progressPending;
	};

	const showHeader = () => {
		if (optionsMerged.noHeader) {
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
	if (optionsMerged.pagination && !optionsMerged.paginationServer && rows.length > 0 && calculatedRows.length === 0) {
		const updatedPage = getNumberOfPages(rows.length, rowsPerPage);
		const recalculatedPage = recalculatePage(currentPage, updatedPage);

		handleChangePage(recalculatedPage);
	}

	useDidUpdateEffect(() => {
		onSelectedRowsChange({ allSelected, selectedCount, selectedRows });
	}, [selectedCount]);

	useDidUpdateEffect(() => {
		onChangePage({
			page: currentPage,
			totalRows: paginationServerOptionsMerged.totalRows || rows.length,
			selectedColumn,
			sortDirection,
		});
	}, [currentPage]);

	useDidUpdateEffect(() => {
		onChangeRowsPerPage({ rowsPerPage, page: currentPage });
	}, [rowsPerPage]);

	useDidUpdateEffect(() => {
		onSort({ selectedColumn, sortDirection });
	}, [selectedColumn, sortDirection]);

	useDidUpdateEffect(() => {
		handleChangePage(paginationOptionsMerged.defaultPage || 1);
	}, [paginationOptionsMerged.defaultPage, paginationOptionsMerged.resetDefaultPage]);

	useDidUpdateEffect(() => {
		if (optionsMerged.pagination && optionsMerged.paginationServer) {
			const updatedPage = getNumberOfPages(optionsMerged.paginationServerOptions?.totalRows || 0, rowsPerPage);
			const recalculatedPage = recalculatePage(currentPage, updatedPage);

			if (currentPage !== recalculatedPage) {
				handleChangePage(recalculatedPage);
			}
		}
	}, [paginationServerOptionsMerged.totalRows]);

	React.useEffect(() => {
		dispatch({
			type: 'UPDATE_ROWS',
			rows: defaultSortColumn?.selector
				? sort(data, defaultSortColumn.selector, defaultSortDirection, optionsMerged.sortFunction)
				: data,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	React.useEffect(() => {
		dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
	}, [clearSelectedRows]);

	React.useEffect(() => {
		if (optionsMerged.selectableRowSelected) {
			const preSelectedRows = rows.filter(
				row => typeof optionsMerged.selectableRowSelected === 'function' && optionsMerged.selectableRowSelected(row),
			);

			dispatch({
				type: 'SELECT_MULTIPLE_ROWS',
				keyField: optionsMerged.keyField,
				selectedRows: preSelectedRows,
				rows: rows,
				mergeSelections,
			});
		}
		// We only want to re-render if the rows changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rows]);

	const rowData = optionsMerged.selectableRowsVisibleOnly ? calculatedRows : rows;
	const showSelectAll =
		optionsMerged.paginationServerOptions.persistSelectedOnPageChange || optionsMerged.selectableRowsNoSelectAll;

	return (
		<ThemeProvider theme={currentTheme}>
			{showHeader() && (
				<TableHeader
					title={title}
					actions={actions}
					showMenu={!optionsMerged.noContextMenu}
					selectedCount={selectedCount}
					direction={optionsMerged.direction}
					contextActions={contextActions}
					contextComponent={optionsMerged.contextComponent}
					contextMessage={optionsMerged.contextMessage}
				/>
			)}

			{optionsMerged.subHeader && (
				<TableSubheader align={optionsMerged.subHeaderAlign} wrapContent={optionsMerged.subHeaderWrap}>
					{optionsMerged.subHeaderComponent}
				</TableSubheader>
			)}

			<ResponsiveWrapper responsive={optionsMerged.responsive} {...wrapperProps}>
				<TableWrapper>
					{progressPending && !optionsMerged.persistTableHead && (
						<ProgressWrapper>{optionsMerged.progressComponent}</ProgressWrapper>
					)}

					<Table disabled={disabled} className="rdt_Table" role="table">
						{showTableHead() && (
							<TableHead className="rdt_TableHead" role="rowgroup">
								<TableHeadRow className="rdt_TableHeadRow" role="row" dense={optionsMerged.dense}>
									{optionsMerged.selectableRows &&
										(showSelectAll ? (
											<CellBase style={{ flex: '0 0 48px' }} />
										) : (
											<TableColCheckbox
												allSelected={allSelected}
												selectedRows={selectedRows}
												selectableRowsComponent={optionsMerged.selectableRowsComponent}
												selectableRowsComponentProps={optionsMerged.selectableRowsComponentProps}
												selectableRowDisabled={optionsMerged.selectableRowDisabled}
												rowData={rowData}
												keyField={optionsMerged.keyField}
												mergeSelections={mergeSelections}
												onSelectAllRows={handleSelectAllRows}
											/>
										))}

									{optionsMerged.expandableRows && !optionsMerged.expandableRowsHideExpander && <TableColExpander />}

									{columnsMemo.map(column => (
										<TableCol
											key={column.id}
											column={column}
											disabled={progressPending || rows.length === 0}
											rows={rows}
											pagination={optionsMerged.pagination}
											paginationServer={optionsMerged.paginationServer}
											persistSelectedOnSort={paginationServerOptionsMerged.persistSelectedOnSort || false}
											selectableRowsVisibleOnly={optionsMerged.selectableRowsVisibleOnly}
											selectedColumn={selectedColumn}
											sortFunction={optionsMerged.sortFunction}
											sortDirection={sortDirection}
											sortIcon={optionsMerged.sortIcon}
											sortServer={optionsMerged.sortServer}
											onSort={handleSort}
										/>
									))}
								</TableHeadRow>
							</TableHead>
						)}

						{!rows.length && !progressPending && <NoData>{optionsMerged.noDataComponent}</NoData>}

						{progressPending && optionsMerged.persistTableHead && (
							<ProgressWrapper>{optionsMerged.progressComponent}</ProgressWrapper>
						)}

						{!progressPending && rows.length > 0 && (
							<TableBody
								fixedHeader={optionsMerged.fixedHeader}
								fixedHeaderScrollHeight={optionsMerged.fixedHeaderScrollHeight}
								className="rdt_TableBody"
								role="rowgroup"
							>
								{calculatedRows.map((row, i) => {
									const id = isEmpty(row[optionsMerged.keyField]) ? i : row[optionsMerged.keyField];
									const selected = isRowSelected(row, selectedRows, optionsMerged.keyField);
									const expanderExpander = !!(
										optionsMerged.expandableRows &&
										optionsMerged.expandableRowExpanded &&
										optionsMerged.expandableRowExpanded(row)
									);
									const expanderDisabled = !!(
										optionsMerged.expandableRows &&
										optionsMerged.expandableRowDisabled &&
										optionsMerged.expandableRowDisabled(row)
									);

									return (
										<TableRow
											id={id}
											key={id}
											keyField={optionsMerged.keyField}
											row={row}
											columns={columnsMemo}
											selectableRows={optionsMerged.selectableRows}
											expandableRows={optionsMerged.expandableRows}
											expandableIcon={optionsMerged.expandableIcon}
											highlightOnHover={optionsMerged.highlightOnHover}
											pointerOnHover={optionsMerged.pointerOnHover}
											dense={optionsMerged.dense}
											expandOnRowClicked={optionsMerged.expandOnRowClicked}
											expandOnRowDoubleClicked={optionsMerged.expandOnRowDoubleClicked}
											expandableRowsComponent={expandableRowsComponentMemo}
											expandableRowsHideExpander={optionsMerged.expandableRowsHideExpander}
											defaultExpanderDisabled={expanderDisabled}
											defaultExpanded={expanderExpander}
											expandableInheritConditionalStyles={optionsMerged.expandableInheritConditionalStyles}
											conditionalRowStyles={optionsMerged.conditionalRowStyles}
											rowCount={rows.length}
											rowIndex={i}
											selected={selected}
											selectableRowsHighlight={optionsMerged.selectableRowsHighlight}
											selectableRowsComponent={optionsMerged.selectableRowsComponent}
											selectableRowsComponentProps={optionsMerged.selectableRowsComponentProps}
											selectableRowDisabled={optionsMerged.selectableRowDisabled}
											striped={optionsMerged.striped}
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
						rowCount={paginationServerOptionsMerged.totalRows || rows.length}
						currentPage={currentPage}
						rowsPerPage={rowsPerPage}
						direction={optionsMerged.direction}
						paginationOptions={paginationOptionsMerged}
					/>
				</div>
			)}
		</ThemeProvider>
	);
}

export default React.memo(DataTable) as typeof DataTable;
