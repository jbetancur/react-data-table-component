import * as React from 'react';
import Table from './Table';
import Header from './TableHeader';
import Subheader from './TableSubheader';
import ResponsiveWrapper from './ResponsiveWrapper';
import Wrapper from './TableWrapper';
import NativePagination from './Pagination';
import DataTableHead from './DataTableHead';
import DataTableBody from './DataTableBody';
import TablePaginationFooter from './TablePaginationFooter';
import { getNumberOfPages, recalculatePage, getPinnedOffsets, getPinnedTotalWidths } from '../util';
import PinnedScrollbar from './PinnedScrollbar';
import { defaultProps, DEFAULT_EXPANDABLE_ICON, DEFAULT_PAGINATION_ICONS } from '../defaultProps';
import { createStyles } from '../styles';
import { resolveTheme, resolveThemeObject } from '../themes';
import type { TableProps, DataTableHandle } from '../types';
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
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
import { useColorMode } from '../hooks/useColorMode';

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
		selectableRowsRange = true,
		selectableRowSelected = defaultProps.selectableRowSelected,
		selectableRowDisabled = defaultProps.selectableRowDisabled,
		selectableRowsComponent: selectableRowsComponentProp,
		selectableRowsComponentProps: selectableRowsComponentPropsProp,
		selectedRows: controlledSelectedRows,
		onRowExpandToggled = defaultProps.onRowExpandToggled,
		onSelectedRowsChange = defaultProps.onSelectedRowsChange,
		onChangeRowsPerPage = defaultProps.onChangeRowsPerPage,
		onChangePage = defaultProps.onChangePage,
		paginationServer = defaultProps.paginationServer,
		paginationServerOptions = defaultProps.paginationServerOptions,
		paginationTotalRows = defaultProps.paginationTotalRows,
		paginationDefaultPage = defaultProps.paginationDefaultPage,
		paginationResetDefaultPage = defaultProps.paginationResetDefaultPage,
		paginationPerPage = defaultProps.paginationPerPage,
		paginationRowsPerPageOptions = defaultProps.paginationRowsPerPageOptions,
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
		onRowMiddleClicked = defaultProps.onRowMiddleClicked,
		onRowMouseEnter = defaultProps.onRowMouseEnter,
		onRowMouseLeave = defaultProps.onRowMouseLeave,
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
		conditionalRowStyles = defaultProps.conditionalRowStyles,
		theme = defaultProps.theme,
		colorMode = defaultProps.colorMode,
		customStyles = defaultProps.customStyles,
		direction = defaultProps.direction,
		onColumnOrderChange = defaultProps.onColumnOrderChange,
		onColumnGroupOrderChange,
		columnGroups,
		filterValues: controlledFilterValues,
		onFilterChange: onFilterChangeProp,
		resizable = false,
		initialColumnWidths,
		onColumnResize,
		animateRows = false,
		columnSeparator,
		headerSeparator,
		className,
		ariaLabel,
	} = props;

	// Intentionally reading @deprecated props for backward compat; cast prevents TS hint 6385 here
	const {
		sortIcon: sortIconProp,
		expandableIcon: expandableIconProp,
		paginationIcons: paginationIconsProp,
		clearSelectedRows = defaultProps.clearSelectedRows,
	} = props;

	// ── Icon resolution: theme.icons → prop override ─────────────────────────
	const themeObj = React.useMemo(() => resolveThemeObject(theme), [theme]);
	const sortIcon = sortIconProp ?? themeObj.icons?.sort ?? null;
	const expandableIcon = { ...DEFAULT_EXPANDABLE_ICON, ...themeObj.icons?.expandable, ...expandableIconProp };
	const paginationIcons = { ...DEFAULT_PAGINATION_ICONS, ...themeObj.icons?.pagination, ...paginationIconsProp };
	const selectableRowsComponent = selectableRowsComponentProp ?? defaultProps.selectableRowsComponent;
	const selectableRowsComponentProps = selectableRowsComponentPropsProp ?? defaultProps.selectableRowsComponentProps;

	React.useEffect(() => {
		if (selectableRows && data.length > 0) {
			const sample = data[0] as Record<string, unknown>;
			if (sample[keyField] === undefined) {
				console.warn(
					`DataTable: keyField "${keyField}" returned undefined for your data. ` +
						`Row selection requires a stable unique identifier — set the keyField prop ` +
						`to the unique identifier field in your row data.`,
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const tableId = React.useId();
	const [, startTransition] = React.useTransition();
	const { filterValues, handleFilterChange, filteredData } = useColumnFilter(
		columns,
		controlledFilterValues,
		onFilterChangeProp,
	);

	// ── Column resize state ────────────────────────────────────────────────────
	const { columnWidths, handleResizeStart } = useColumnResize({ initialColumnWidths, onColumnResize });

	const {
		tableColumns,
		tableGroups,
		draggingColumnId,
		draggingGroupKey,
		handleDragStart,
		handleDragEnter,
		handleDragOver,
		handleDragLeave,
		handleDragEnd,
		handleGroupDragStart,
		handleGroupDragEnter,
		handleGroupDragOver,
		handleGroupDragEnd,
		defaultSortDirection,
		defaultSortColumn,
	} = useColumns(
		columns,
		onColumnOrderChange,
		onColumnGroupOrderChange,
		columnGroups,
		defaultSortFieldId,
		defaultSortAsc,
	);

	// Pinning is incompatible with CSS-grid group headers — strip it when groups are active
	const hasGroups = tableGroups.length > 0 || (columnGroups != null && columnGroups.length > 0);
	const effectiveColumns = React.useMemo(() => {
		if (!hasGroups) return tableColumns;
		return tableColumns.map(c => {
			if (!c.pinned) return c;
			const { pinned: _p, ...rest } = c;
			return rest as typeof c;
		});
	}, [hasGroups, tableColumns]);

	const warnedPinGroupsRef = React.useRef(false);
	React.useEffect(() => {
		if (!hasGroups || warnedPinGroupsRef.current) return;
		if (tableColumns.some(c => c.pinned)) {
			warnedPinGroupsRef.current = true;
			console.warn(
				'DataTable: column pinning is not supported alongside columnGroups. ' +
					'`pinned` has been stripped from affected columns. ' +
					'Remove `columnGroups` or remove `pinned` from your column definitions to use pinning.',
			);
		}
	}, [hasGroups, tableColumns]);

	const pinnedOffsets = React.useMemo(
		() => getPinnedOffsets(effectiveColumns, columnWidths, selectableRows, expandableRows, expandableRowsHideExpander),
		[effectiveColumns, columnWidths, selectableRows, expandableRows, expandableRowsHideExpander],
	);

	const pinnedTotalWidths = React.useMemo(
		() =>
			getPinnedTotalWidths(effectiveColumns, columnWidths, selectableRows, expandableRows, expandableRowsHideExpander),
		[effectiveColumns, columnWidths, selectableRows, expandableRows, expandableRowsHideExpander],
	);

	const hasPinnedColumns = pinnedTotalWidths.left > 0 || pinnedTotalWidths.right > 0;
	const scrollWrapperRef = React.useRef<HTMLDivElement>(null);

	const {
		tableState,
		handleSort: dispatchSort,
		handleSelectAllRows,
		handleSelectedRow,
		handleSelectedRange,
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
		controlledSelectedRows,
		onSelectedRowsChange,
		onSort,
		onChangePage,
		onChangeRowsPerPage,
	});

	// Refs for Shift-click range selection: visibleRowsRef holds the current visible-rows
	// snapshot so the row-checkbox can compute a contiguous slice without prop-drilling;
	// lastSelectedKeyRef is the anchor row (set on the most recent single toggle).
	const visibleRowsRef = React.useRef<T[]>([]);
	const lastSelectedKeyRef = React.useRef<string | number | null>(null);

	React.useImperativeHandle(ref, () => ({ clearSelectedRows: handleClearSelectedRows }), [handleClearSelectedRows]);

	// Snapshot row Y-positions synchronously before dispatching sort, so
	// DataTableBody can FLIP rows from their old positions to the new ones.
	const bodyRef = React.useRef<HTMLDivElement>(null);
	const prevRowTopsRef = React.useRef<Map<string | number, number>>(new Map());

	const handleSort = React.useCallback(
		(action: Parameters<typeof dispatchSort>[0]) => {
			if (bodyRef.current) {
				const snapshot = new Map<string | number, number>();
				bodyRef.current.querySelectorAll<HTMLElement>('[id^="row-"]').forEach(el => {
					snapshot.set(el.id.slice(4), el.getBoundingClientRect().top);
				});
				prevRowTopsRef.current = snapshot;
			}
			startTransition(() => dispatchSort(action));
		},
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
	const resolvedMode = useColorMode(colorMode);
	const cssVars = React.useMemo(() => resolveTheme(theme, resolvedMode), [theme, resolvedMode]);
	const wrapperProps = React.useMemo(() => ({ ...(direction !== 'auto' && { dir: direction }) }), [direction]);
	const isBusy = progressPending;

	const handleChangePage = React.useCallback((page: number) => handleChangePageState(page), [handleChangePageState]);
	const handleChangeRowsPerPage = React.useCallback(
		(newRowsPerPage: number) => handleChangeRowsPerPageState(newRowsPerPage, filteredTableRows.length),
		[handleChangeRowsPerPageState, filteredTableRows.length],
	);

	const showTableHead = !noTableHead && (persistTableHead || progressPending || filteredSortedData.length > 0);
	const showHeader = !noHeader && !!(title || actions);

	if (pagination && !paginationServer && filteredSortedData.length > 0 && filteredTableRows.length === 0) {
		handleChangePage(recalculatePage(currentPage, getNumberOfPages(filteredSortedData.length, rowsPerPage)));
	}

	const visibleRows = selectableRowsVisibleOnly ? filteredTableRows : filteredSortedData;
	const showSelectAll = persistSelectedOnPageChange || selectableRowsSingle || selectableRowsNoSelectAll;

	// Keep the ref pointed at the current visible page rows so Shift-click selection
	// computes the slice against what's actually on screen, not the full dataset.
	// We mutate in a layout effect so the ref is up-to-date before any click handler
	// (which runs after commit) reads from it. Falls back to useEffect on the server
	// to avoid the SSR mismatch warning.
	useIsomorphicLayoutEffect(() => {
		visibleRowsRef.current = filteredTableRows;
	}, [filteredTableRows]);

	const rowContextValue = useRowContextValue<T>({
		keyField,
		columns: effectiveColumns,
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
		onRowMiddleClicked,
		onRowMouseEnter,
		onRowMouseLeave,
		onRowExpandToggled,
		onSelectedRow: handleSelectedRow,
		onSelectedRange: handleSelectedRange,
		visibleRowsRef,
		lastSelectedKeyRef,
		selectableRowsRange,
		onDragStart: handleDragStart,
		onDragOver: handleDragOver,
		onDragEnd: handleDragEnd,
		onDragEnter: handleDragEnter,
		onDragLeave: handleDragLeave,
		columnWidths,
		pinnedOffsets,
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
		draggingGroupKey,
		filterValues,
		columnWidths,
		pinnedOffsets,
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
		onGroupDragStart: handleGroupDragStart,
		onGroupDragEnter: handleGroupDragEnter,
		onGroupDragOver: handleGroupDragOver,
		onGroupDragEnd: handleGroupDragEnd,
	});

	// Prop wins; if not explicitly passed, fall back to what the theme declares, then built-in defaults.
	const effectiveColumnSep = columnSeparator !== undefined ? columnSeparator : (themeObj.columnSeparator ?? false);
	const effectiveHeaderSep = headerSeparator !== undefined ? headerSeparator : (themeObj.headerSeparator ?? true);
	const sepClass =
		effectiveColumnSep === 'full' ? 'rdt_colSeparatorFull' : effectiveColumnSep ? 'rdt_colSeparator' : undefined;
	const headSepClass =
		effectiveHeaderSep === false
			? undefined
			: effectiveHeaderSep === 'full'
				? 'rdt_headSeparatorFull'
				: 'rdt_headSeparator';

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
							ref={scrollWrapperRef}
							$responsive={responsive}
							$fixedHeader={fixedHeader}
							$fixedHeaderScrollHeight={fixedHeaderScrollHeight}
							$hiddenScrollbar={hasPinnedColumns}
							className={className}
							{...wrapperProps}
						>
							<Wrapper>
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
											columns={effectiveColumns}
											columnGroups={tableGroups.length ? tableGroups : columnGroups}
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
										columnCount={tableColumns.length}
										noDataComponent={noDataComponent}
										progressComponent={progressComponent}
										expandableRowExpanded={expandableRowExpanded}
										expandableRowDisabled={expandableRowDisabled}
										bodyRef={bodyRef}
										prevRowTopsRef={prevRowTopsRef}
									/>
								</Table>
							</Wrapper>
						</ResponsiveWrapper>

						{hasPinnedColumns && responsive && (
							<PinnedScrollbar
								scrollRef={scrollWrapperRef}
								leftInset={pinnedTotalWidths.left}
								rightInset={pinnedTotalWidths.right}
							/>
						)}

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
