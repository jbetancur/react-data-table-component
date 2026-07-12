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
import TableFooter from './TableFooter';
import { getNumberOfPages, recalculatePage } from '../util';
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
import useColumnResize, { useResizeSlice } from '../hooks/useColumnResize';
import useRTL from '../hooks/useRTL';
import useRowContextValue from '../hooks/useRowContextValue';
import useRowEvents from '../hooks/useRowEvents';
import useExpansion from '../hooks/useExpansion';
import useSelection from '../hooks/useSelection';
import useSorting from '../hooks/useSorting';
import useHeadContextValue from '../hooks/useHeadContextValue';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
import { useColorMode } from '../hooks/useColorMode';
import useCellNavigation from '../hooks/useCellNavigation';
import useColumnPinning from '../hooks/useColumnPinning';
import useSortFlipAnimation from '../hooks/useSortFlipAnimation';
import useContextMenu from '../hooks/useContextMenu';
import ContextMenu from './ContextMenu';

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
		paginationPage,
		paginationResetDefaultPage = defaultProps.paginationResetDefaultPage,
		paginationPerPage = defaultProps.paginationPerPage,
		paginationPosition = defaultProps.paginationPosition,
		paginationRowsPerPageOptions = defaultProps.paginationRowsPerPageOptions,
		paginationComponent = defaultProps.paginationComponent,
		paginationComponentOptions = defaultProps.paginationComponentOptions,
		responsive = defaultProps.responsive,
		progressPending = defaultProps.progressPending,
		progressComponent = defaultProps.progressComponent,
		progressSkeleton = defaultProps.progressSkeleton,
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
		onScroll,
		onSort = defaultProps.onSort,
		sortFunction = defaultProps.sortFunction,
		sortServer = defaultProps.sortServer,
		sortMulti = defaultProps.sortMulti,
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
		contextMenu,
		contextMenuActions,
		onContextMenuAction,
		localization: localizationProp,
		columnFilterOptions,
		expandableRowsOptions,
		resizable = false,
		initialColumnWidths,
		onColumnResize,
		animateRows = false,
		cellNavigation = false,
		columnSeparator,
		headerSeparator,
		footerComponent,
		showFooter,
		className,
		ariaLabel,
	} = props;

	// Memoized: the resolved sub-objects feed context memo dep lists and feature-slice
	// memos, so their identity must only change when the underlying props change.
	const localization = React.useMemo(
		() => ({
			...localizationProp,
			filter: { ...columnFilterOptions, ...localizationProp?.filter },
			expandable: { ...expandableRowsOptions, ...localizationProp?.expandable },
			contextMenu: localizationProp?.contextMenu ?? {},
		}),
		[localizationProp, columnFilterOptions, expandableRowsOptions],
	);

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
	// Memoized: feeds the expansion feature slice, whose identity must be stable.
	const expandableIcon = React.useMemo(
		() => ({ ...DEFAULT_EXPANDABLE_ICON, ...themeObj.icons?.expandable, ...expandableIconProp }),
		[themeObj, expandableIconProp],
	);
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
	const { filterValues, handleFilterChange, filteredData, filtering } = useColumnFilter(
		columns,
		controlledFilterValues,
		onFilterChangeProp,
		localization.filter,
	);

	// ── Column resize state ────────────────────────────────────────────────────
	const isRTL = useRTL(direction);
	const { columnWidths, handleResizeStart } = useColumnResize({ initialColumnWidths, onColumnResize, isRTL });
	const resize = useResizeSlice(resizable, handleResizeStart);

	const {
		tableColumns,
		tableGroups,
		draggingColumnId,
		draggingGroupKey,
		columnDrag,
		handlePinColumn,
		handleHideColumn,
		handleResetColumns,
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

	const { effectiveColumns, pinnedOffsets, pinnedTotalWidths, hasPinnedColumns } = useColumnPinning({
		tableColumns,
		tableGroups,
		columnGroups,
		columnWidths,
		selectableRows,
		expandableRows,
		expandableRowsHideExpander,
	});
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
		handleClearSort,
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
		paginationPage,
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

	React.useImperativeHandle(ref, () => ({ clearSelectedRows: handleClearSelectedRows, clearSort: handleClearSort }), [
		handleClearSelectedRows,
		handleClearSort,
	]);

	const { bodyRef, prevRowTopsRef, handleSort } = useSortFlipAnimation(dispatchSort);

	const { rowsPerPage, currentPage, selectedRows, allSelected, selectedColumn, sortDirection, sortColumns } =
		tableState;

	const { sortedData, tableRows } = useTableData({
		data,
		columns,
		selectedColumn,
		sortDirection,
		sortColumns,
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

	// ── Context menu ───────────────────────────────────────────────────────────
	// Slices pass through to the contexts untouched — consumers read menu.header /
	// menu.row directly, so new feature fields never touch this file.
	const menu = useContextMenu({
		contextMenu,
		contextMenuActions,
		onContextMenuAction,
		localization: localization.contextMenu,
		tableColumns,
		columnGroups,
		sortColumns,
		defaultSortDirection,
		clearSelectedOnSort:
			(pagination && paginationServer && !persistSelectedOnSort) || sortServer || selectableRowsVisibleOnly,
		filterValues,
		onSort: handleSort,
		onClearSort: handleClearSort,
		onFilterChange: handleFilterChange,
		onPinColumn: handlePinColumn,
		onHideColumn: handleHideColumn,
		onResetColumns: handleResetColumns,
	});
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

	// ── Cell navigation ────────────────────────────────────────────────────────
	const {
		activeCell: effectiveActiveCell,
		handleNavFocus,
		handleNavKeyDown,
	} = useCellNavigation({
		cellNavigation,
		selectableRows,
		expandableRows,
		expandableRowsHideExpander,
		effectiveColumns,
		filteredTableRowCount: filteredTableRows.length,
		showTableHead,
	});

	// Footer renders when explicitly enabled, when a footerComponent is provided,
	// or when at least one visible column declares a `footer`. `showFooter={false}`
	// suppresses the row entirely (overrides both column footers and footerComponent).
	const hasColumnFooter = React.useMemo(
		() => effectiveColumns.some(c => !c.omit && c.footer !== undefined),
		[effectiveColumns],
	);
	const showFooterRow =
		showFooter !== false && !progressPending && (showFooter === true || !!footerComponent || hasColumnFooter);

	// Intentional dispatch during render ("adjusting state when props change" pattern):
	// when filtering strands currentPage past the last page, clamp it before commit so
	// the empty page never paints.
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

	const sorting = useSorting<T>({
		sortDirection,
		sortColumns,
		sortDisabled: progressPending || filteredSortedData.length === 0,
		sortMulti,
		defaultSortDirection,
		sortIcon,
		sortServer,
		pagination,
		paginationServer,
		persistSelectedOnSort,
		selectableRowsVisibleOnly,
		onSort: handleSort,
	});

	const selection = useSelection<T>({
		selectableRows,
		component: selectableRowsComponent,
		componentProps: selectableRowsComponentProps,
		highlight: selectableRowsHighlight,
		single: selectableRowsSingle,
		disabled: selectableRowDisabled,
		range: selectableRowsRange,
		onSelectedRow: handleSelectedRow,
		onSelectedRange: handleSelectedRange,
		visibleRowsRef,
		lastSelectedKeyRef,
		allSelected,
		selectedRows,
		visibleRows,
		keyField,
		mergeSelections,
		hideSelectAll: showSelectAll,
		onSelectAllRows: handleSelectAllRows,
	});

	const expansion = useExpansion<T>({
		expandableRows,
		icon: expandableIcon,
		component: expandableRowsComponent,
		componentProps: expandableRowsComponentProps,
		hideExpander: expandableRowsHideExpander,
		expandOnRowClicked,
		expandOnRowDoubleClicked,
		inheritConditionalStyles: expandableInheritConditionalStyles,
		onToggled: onRowExpandToggled,
		localization: localization.expandable,
	});

	const rowEvents = useRowEvents<T>({
		onRowClicked,
		onRowDoubleClicked,
		onRowMiddleClicked,
		onRowMouseEnter,
		onRowMouseLeave,
	});

	const rowContextValue = useRowContextValue<T>({
		keyField,
		columns: effectiveColumns,
		dense,
		striped,
		highlightOnHover,
		pointerOnHover,
		conditionalRowStyles,
		selection: selection.row,
		expansion,
		rowEvents,
		columnDrag,
		columnWidths,
		pinnedOffsets,
		animateRows,
		cellNavigation,
		activeCell: effectiveActiveCell,
		rowMenu: menu.row,
	});

	const headContextValue = useHeadContextValue<T>({
		sorting,
		fixedHeader,
		dense,
		draggingColumnId,
		draggingGroupKey,
		filtering,
		columnWidths,
		pinnedOffsets,
		resize,
		selectAll: selection.selectAll,
		cellNavigation,
		activeCell: effectiveActiveCell,
		headerMenu: menu.header,
		columnDrag,
	});

	const paginationFooterProps = {
		Pagination,
		onChangePage: handleChangePage,
		onChangeRowsPerPage: handleChangeRowsPerPage,
		rowCount: paginationTotalRows || filteredSortedData.length,
		currentPage,
		rowsPerPage,
		direction,
		paginationRowsPerPageOptions,
		paginationIcons,
		paginationComponentOptions,
		localization: localization.pagination,
	};

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

						{enabledPagination && (paginationPosition === 'top' || paginationPosition === 'both') && (
							<TablePaginationFooter {...paginationFooterProps} position="top" />
						)}

						<ResponsiveWrapper
							ref={scrollWrapperRef}
							$responsive={responsive}
							$fixedHeader={fixedHeader}
							$fixedHeaderScrollHeight={fixedHeaderScrollHeight}
							$hiddenScrollbar={hasPinnedColumns && responsive}
							className={className}
							onScroll={onScroll}
							{...wrapperProps}
						>
							<Wrapper>
								<Table
									id={tableId}
									disabled={disabled}
									className="rdt_Table"
									role={cellNavigation ? 'grid' : 'table'}
									aria-busy={isBusy}
									onKeyDown={cellNavigation ? handleNavKeyDown : undefined}
									onFocus={cellNavigation ? handleNavFocus : undefined}
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
										progressSkeleton={progressSkeleton}
										expandableRowExpanded={expandableRowExpanded}
										expandableRowDisabled={expandableRowDisabled}
										bodyRef={bodyRef}
										prevRowTopsRef={prevRowTopsRef}
									/>

									{showFooterRow && (
										<TableFooter
											columns={effectiveColumns}
											rows={filteredSortedData}
											selectableRows={selectableRows}
											expandableRows={expandableRows}
											expandableRowsHideExpander={expandableRowsHideExpander}
											footerComponent={footerComponent}
										/>
									)}
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

						{enabledPagination && (paginationPosition === 'bottom' || paginationPosition === 'both') && (
							<TablePaginationFooter {...paginationFooterProps} />
						)}

						{menu.open && (
							<ContextMenu
								groups={menu.open.groups}
								position={menu.open.position}
								anchorRect={menu.open.anchorRect}
								isRTL={isRTL}
								ariaLabel={menu.open.ariaLabel}
								onSelect={menu.onSelect}
								onClose={menu.onClose}
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
