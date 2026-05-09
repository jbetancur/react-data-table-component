import * as React from 'react';
import Table from './Table';
import Header from './TableHeader';
import Subheader from './TableSubheader';
import ResponsiveWrapper from './ResponsiveWrapper';
import ProgressWrapper from './ProgressWrapper';
import Wrapper from './TableWrapper';
import NativePagination from './Pagination';
import DataTableHead from './DataTableHead';
import DataTableBody from './DataTableBody';
import TablePaginationFooter from './TablePaginationFooter';
import { getNumberOfPages, recalculatePage } from '../util';
import { defaultProps } from '../defaultProps';
import { createStyles } from '../styles';
import { resolveTheme } from '../themes';
import { TableProps, DataTableHandle } from '../types';
import { StylesContext } from '../context/StylesContext';
import { RowContext } from '../context/RowContext';
import { HeadContext } from '../context/HeadContext';
import useColumns from '../hooks/useColumns';
import useTableState from '../hooks/useTableState';
import useTableData from '../hooks/useTableData';
import useColumnFilter from '../hooks/useColumnFilter';
import useColumnResize from '../hooks/useColumnResize';
import useRowContextValue from '../hooks/useRowContextValue';
import useHeadContextValue from '../hooks/useHeadContextValue';

function DataTableInner<T>(props: TableProps<T>, ref: React.ForwardedRef<DataTableHandle>): JSX.Element {
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
		paginationIcons = defaultProps.paginationIcons,
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

		expandableRows = defaultProps.expandableRows,
		onRowClicked = defaultProps.onRowClicked,
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
		columnGroups,
		filterValues: controlledFilterValues,
		onFilterChange: onFilterChangeProp,
		resizable = false,
		animateRows = false,
		columnSeparator,
		headerSeparator,
		className,
		ariaLabel,
	} = props;

	const tableId = React.useId();
	const [, startTransition] = React.useTransition();
	const { filterValues, handleFilterChange, filteredData } = useColumnFilter(
		columns,
		controlledFilterValues,
		onFilterChangeProp,
	);

	// ── Column resize state ────────────────────────────────────────────────────
	const { columnWidths, handleResizeStart } = useColumnResize();

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

	const {
		tableState,
		handleSort: dispatchSort,
		handleSelectAllRows,
		handleSelectedRow,
		handleChangePage: handleChangePageState,
		handleChangeRowsPerPage: handleChangeRowsPerPageState,
		handleClearSelectedRows,
	} = useTableState({
		data,
		keyField,
		defaultSortColumn,
		defaultSortDirection,
		paginationDefaultPage,
		paginationPerPage,
		paginationServer,
		paginationServerOptions,
		paginationTotalRows,
		pagination,
		selectableRowsSingle,
		selectableRowsVisibleOnly,
		selectableRowSelected,
		clearSelectedRows,
		paginationResetDefaultPage,
		onSelectedRowsChange,
		onSort,
		onChangePage,
		onChangeRowsPerPage,
	});

	React.useImperativeHandle(ref, () => ({ clearSelectedRows: handleClearSelectedRows }), [handleClearSelectedRows]);

	const handleSort = React.useCallback(
		(action: Parameters<typeof dispatchSort>[0]) => startTransition(() => dispatchSort(action)),
		[dispatchSort],
	);

	const { rowsPerPage, currentPage, selectedRows, allSelected, selectedColumn, sortDirection } = tableState;

	const { sortedData, tableRows } = useTableData({
		data,
		columns,
		selectedColumn,
		sortDirection,
		currentPage,
		rowsPerPage,
		pagination,
		paginationServer,
		sortServer,
		sortFunction,
		onSort,
	});

	// ── Client-side column filtering ───────────────────────────────────────────
	const filteredSortedData = React.useMemo(() => filteredData(sortedData), [filteredData, sortedData]);
	const filteredTableRows = React.useMemo(() => filteredData(tableRows), [filteredData, tableRows]);

	const { persistSelectedOnSort = false, persistSelectedOnPageChange = false } = paginationServerOptions;
	const mergeSelections = !!(paginationServer && (persistSelectedOnPageChange || persistSelectedOnSort));
	const enabledPagination = pagination && !progressPending && data.length > 0;
	const Pagination = paginationComponent || NativePagination;
	const tableStyles = React.useMemo(() => createStyles(customStyles), [customStyles]);
	const cssVars = React.useMemo(() => resolveTheme(theme), [theme]);
	const wrapperProps = React.useMemo(() => ({ ...(direction !== 'auto' && { dir: direction }) }), [direction]);
	const isBusy = progressPending;

	const handleChangePage = React.useCallback((page: number) => handleChangePageState(page), [handleChangePageState]);
	const handleChangeRowsPerPage = React.useCallback(
		(newRowsPerPage: number) => handleChangeRowsPerPageState(newRowsPerPage, filteredTableRows.length),
		[handleChangeRowsPerPageState, filteredTableRows.length],
	);

	const showTableHead = !noTableHead && (persistTableHead || (filteredSortedData.length > 0 && !progressPending));
	const showHeader = !noHeader && !!(title || actions);

	if (pagination && !paginationServer && filteredSortedData.length > 0 && filteredTableRows.length === 0) {
		handleChangePage(recalculatePage(currentPage, getNumberOfPages(filteredSortedData.length, rowsPerPage)));
	}

	const visibleRows = selectableRowsVisibleOnly ? filteredTableRows : filteredSortedData;
	const showSelectAll = persistSelectedOnPageChange || selectableRowsSingle || selectableRowsNoSelectAll;

	const rowContextValue = useRowContextValue<T>({
		keyField,
		columns: tableColumns,
		dense,
		striped,
		highlightOnHover,
		pointerOnHover,
		conditionalRowStyles,
		selectableRows,
		selectableRowsComponent,
		selectableRowsComponentProps,
		selectableRowsHighlight,
		selectableRowsSingle,
		selectableRowDisabled,
		expandableRows,
		expandableIcon,
		expandableRowsComponent,
		expandableRowsComponentProps,
		expandableRowsHideExpander,
		expandOnRowClicked,
		expandOnRowDoubleClicked,
		expandableInheritConditionalStyles,
		onRowClicked,
		onRowDoubleClicked,
		onRowMouseEnter,
		onRowMouseLeave,
		onRowExpandToggled,
		onSelectedRow: handleSelectedRow,
		onDragStart: handleDragStart,
		onDragOver: handleDragOver,
		onDragEnd: handleDragEnd,
		onDragEnter: handleDragEnter,
		onDragLeave: handleDragLeave,
		columnWidths,
		animateRows,
	});

	const headContextValue = useHeadContextValue<T>({
		selectedColumn,
		sortDirection,
		sortIcon,
		sortServer,
		pagination,
		paginationServer,
		persistSelectedOnSort,
		selectableRowsVisibleOnly,
		fixedHeader,
		dense,
		draggingColumnId,
		filterValues,
		columnWidths,
		resizable,
		keyField,
		mergeSelections,
		allSelected,
		selectedRows,
		visibleRows,
		selectableRowsComponent,
		selectableRowsComponentProps,
		selectableRowDisabled,
		showSelectAll,
		progressPending,
		sortedData: filteredSortedData,
		onSelectAllRows: handleSelectAllRows,
		onSort: handleSort,
		onFilterChange: handleFilterChange,
		onResizeStart: resizable ? handleResizeStart : undefined,
		onDragStart: handleDragStart,
		onDragOver: handleDragOver,
		onDragEnd: handleDragEnd,
		onDragEnter: handleDragEnter,
		onDragLeave: handleDragLeave,
	});

	const sepClass =
		columnSeparator === 'full' ? 'rdt_colSeparatorFull' : columnSeparator ? 'rdt_colSeparator' : undefined;
	const headSepClass =
		headerSeparator === false ? undefined : headerSeparator === 'full' ? 'rdt_headSeparatorFull' : 'rdt_headSeparator'; // default: true / 'subtle' / omitted all render the subtle separator

	return (
		<StylesContext.Provider value={tableStyles}>
			<HeadContext.Provider value={headContextValue}>
				<RowContext.Provider value={rowContextValue}>
					<div
						style={cssVars as React.CSSProperties}
						className={[sepClass, headSepClass].filter(Boolean).join(' ') || undefined}
					>
						{showHeader && <Header title={title} actions={actions} />}

						{subHeader && (
							<Subheader align={subHeaderAlign} wrapContent={subHeaderWrap}>
								{subHeader}
							</Subheader>
						)}

						<ResponsiveWrapper
							$responsive={responsive}
							$fixedHeader={fixedHeader}
							$fixedHeaderScrollHeight={fixedHeaderScrollHeight}
							className={className}
							{...wrapperProps}
						>
							<Wrapper>
								{progressPending && !persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

								<Table
									id={tableId}
									disabled={disabled}
									className="rdt_Table"
									role="table"
									aria-busy={isBusy}
									{...(ariaLabel && { 'aria-label': ariaLabel })}
								>
									{showTableHead && (
										<DataTableHead
											columns={tableColumns}
											columnGroups={columnGroups}
											selectableRows={selectableRows}
											expandableRows={expandableRows}
											expandableRowsHideExpander={expandableRowsHideExpander}
										/>
									)}

									<DataTableBody
										tableRows={filteredTableRows}
										sortedData={filteredSortedData}
										selectedRows={selectedRows}
										keyField={keyField}
										isBusy={isBusy}
										noDataComponent={noDataComponent}
										progressComponent={progressComponent}
										persistTableHead={persistTableHead}
										expandableRowExpanded={expandableRowExpanded}
										expandableRowDisabled={expandableRowDisabled}
									/>
								</Table>
							</Wrapper>
						</ResponsiveWrapper>

						{enabledPagination && (
							<TablePaginationFooter
								Pagination={Pagination}
								onChangePage={handleChangePage}
								onChangeRowsPerPage={handleChangeRowsPerPage}
								rowCount={paginationTotalRows || filteredSortedData.length}
								currentPage={currentPage}
								rowsPerPage={rowsPerPage}
								direction={direction}
								paginationRowsPerPageOptions={paginationRowsPerPageOptions}
								paginationIcons={paginationIcons}
								paginationComponentOptions={paginationComponentOptions}
							/>
						)}
					</div>
				</RowContext.Provider>
			</HeadContext.Provider>
		</StylesContext.Provider>
	);
}

const DataTable = React.forwardRef(DataTableInner) as <T>(
	props: TableProps<T> & { ref?: React.Ref<DataTableHandle> },
) => JSX.Element;

export default DataTable;
