import * as React from 'react';
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
import { prop, getNumberOfPages, isEmpty, isRowSelected, recalculatePage } from './util';
import { defaultProps } from './defaultProps';
import { createStyles } from './styles';
import { defaultThemes } from './themes';
import { TableRow, TableProps, DataTableHandle } from './types';
import { StylesContext } from './StylesContext';
import { themeToVars } from './themes';
import useColumns from '../hooks/useColumns';
import useTableState from '../hooks/useTableState';
import useTableData from '../hooks/useTableData';

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
		ariaLabel,
	} = props;

	const tableId = React.useId();
	const [isPending, startTransition] = React.useTransition();

	// Column management (drag-and-drop, sorting)
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

	// State management (selection, pagination, sorting)
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

	const {
		rowsPerPage,
		currentPage,
		selectedRows,
		allSelected,
		selectedCount,
		selectedColumn,
		sortDirection,
	} = tableState;

	// Data transformation (sorting, pagination)
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

	// UI state and configuration
	const { persistSelectedOnSort = false, persistSelectedOnPageChange = false } = paginationServerOptions;
	const mergeSelections = !!(paginationServer && (persistSelectedOnPageChange || persistSelectedOnSort));
	const enabledPagination = pagination && !progressPending && data.length > 0;
	const Pagination = paginationComponent || NativePagination;
	const tableStyles = React.useMemo(() => createStyles(customStyles, theme), [customStyles, theme]);
	const cssVars = React.useMemo(
		() => themeToVars(defaultThemes[defaultThemes[theme] ? theme : 'default']),
		[theme],
	);
	const wrapperProps = React.useMemo(() => ({ ...(direction !== 'auto' && { dir: direction }) }), [direction]);
	const isBusy = progressPending || isPending;

	// Stable event handlers
	const handleRowClicked = React.useCallback(
		(row: T, e: React.MouseEvent<Element, MouseEvent>) => onRowClicked(row, e),
		[onRowClicked],
	);

	const handleRowDoubleClicked = React.useCallback(
		(row: T, e: React.MouseEvent<Element, MouseEvent>) => onRowDoubleClicked(row, e),
		[onRowDoubleClicked],
	);

	const handleRowMouseEnter = React.useCallback(
		(row: T, e: React.MouseEvent<Element, MouseEvent>) => onRowMouseEnter(row, e),
		[onRowMouseEnter],
	);

	const handleRowMouseLeave = React.useCallback(
		(row: T, e: React.MouseEvent<Element, MouseEvent>) => onRowMouseLeave(row, e),
		[onRowMouseLeave],
	);

	const handleChangePage = React.useCallback(
		(page: number) => handleChangePageState(page),
		[handleChangePageState],
	);

	const handleChangeRowsPerPage = React.useCallback(
		(newRowsPerPage: number) => handleChangeRowsPerPageState(newRowsPerPage, tableRows.length),
		[handleChangeRowsPerPageState, tableRows.length],
	);

	// Helper functions for conditional rendering
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

	// Recalculate pagination if rows length changes (client-side pagination edge case)
	if (pagination && !paginationServer && sortedData.length > 0 && tableRows.length === 0) {
		const updatedPage = getNumberOfPages(sortedData.length, rowsPerPage);
		const recalculatedPage = recalculatePage(currentPage, updatedPage);

		handleChangePage(recalculatedPage);
	}

	const visibleRows = selectableRowsVisibleOnly ? tableRows : sortedData;
	const showSelectAll = persistSelectedOnPageChange || selectableRowsSingle || selectableRowsNoSelectAll;

	return (
		<StylesContext.Provider value={tableStyles}>
		<div style={cssVars as React.CSSProperties}>
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
						{showTableHead() && (
							<Head className="rdt_TableHead" role="rowgroup" $fixedHeader={fixedHeader}>
								<HeadRow className="rdt_TableHeadRow" role="row" $dense={dense}>
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

						{!sortedData.length && !isBusy && <NoData>{noDataComponent}</NoData>}

						{isBusy && persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

						{!isBusy && sortedData.length > 0 && (
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
		</div>
		</StylesContext.Provider>
	);
}

const DataTable = React.forwardRef(DataTableInner) as <T>(
	props: TableProps<T> & { ref?: React.Ref<DataTableHandle> },
) => JSX.Element;

export default DataTable;
