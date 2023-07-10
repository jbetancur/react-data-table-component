'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	}
	n["default"] = e;
	return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (SortOrder = {}));

function prop(obj, key) {
    return obj[key];
}
function isEmpty(field = '') {
    if (typeof field === 'number') {
        return false;
    }
    return !field || field.length === 0;
}
function sort(rows, selector, direction, sortFn) {
    if (!selector) {
        return rows;
    }
    if (sortFn && typeof sortFn === 'function') {
        return sortFn(rows.slice(0), selector, direction);
    }
    return rows.slice(0).sort((a, b) => {
        let aValue;
        let bValue;
        if (typeof selector === 'string') {
            aValue = parseSelector(a, selector);
            bValue = parseSelector(b, selector);
        }
        else {
            aValue = selector(a);
            bValue = selector(b);
        }
        if (direction === 'asc') {
            if (aValue < bValue) {
                return -1;
            }
            if (aValue > bValue) {
                return 1;
            }
        }
        if (direction === 'desc') {
            if (aValue > bValue) {
                return -1;
            }
            if (aValue < bValue) {
                return 1;
            }
        }
        return 0;
    });
}
function parseSelector(row, selector) {
    return selector.split('.').reduce((acc, part) => {
        const arr = part.match(/[^\]\\[.]+/g);
        if (arr && arr.length > 1) {
            for (let i = 0; i < arr.length; i++) {
                return acc[arr[i]][arr[i + 1]];
            }
        }
        return acc[part];
    }, row);
}
function getProperty(row, selector, format, rowIndex) {
    if (!selector) {
        return null;
    }
    if (typeof selector !== 'string' && typeof selector !== 'function') {
        throw new Error('selector must be a . delimited string eg (my.property) or function (e.g. row => row.field');
    }
    if (format && typeof format === 'function') {
        return format(row, rowIndex);
    }
    if (selector && typeof selector === 'function') {
        return selector(row, rowIndex);
    }
    if (typeof selector === 'string') {
        return parseSelector(row, selector);
    }
    return null;
}
function insertItem(array = [], item, index = 0) {
    return [...array.slice(0, index), item, ...array.slice(index)];
}
function removeItem(array = [], item, keyField = 'id') {
    const newArray = array.slice();
    const outerField = prop(item, keyField);
    if (outerField) {
        newArray.splice(newArray.findIndex((a) => {
            const innerField = prop(a, keyField);
            return innerField === outerField;
        }), 1);
    }
    else {
        newArray.splice(newArray.findIndex(a => a === item), 1);
    }
    return newArray;
}
function decorateColumns(columns) {
    return columns.map((column, index) => {
        const decoratedColumn = Object.assign(Object.assign({}, column), { sortable: column.sortable || !!column.sortFunction || undefined });
        if (!column.id) {
            decoratedColumn.id = index + 1;
            return decoratedColumn;
        }
        return decoratedColumn;
    });
}
function getSortDirection(ascDirection = false) {
    return ascDirection ? SortOrder.ASC : SortOrder.DESC;
}
function handleFunctionProps(object, ...args) {
    let newObject;
    Object.keys(object)
        .map(o => object[o])
        .forEach((value, index) => {
        const oldObject = object;
        if (typeof value === 'function') {
            newObject = Object.assign(Object.assign({}, oldObject), { [Object.keys(object)[index]]: value(...args) });
        }
    });
    return newObject || object;
}
function getNumberOfPages(rowCount, rowsPerPage) {
    return Math.ceil(rowCount / rowsPerPage);
}
function recalculatePage(prevPage, nextPage) {
    return Math.min(prevPage, nextPage);
}
const noop = () => null;
function getConditionalStyle(row, conditionalRowStyles = [], baseClassNames = []) {
    let rowStyle = {};
    let classNames = [...baseClassNames];
    if (conditionalRowStyles.length) {
        conditionalRowStyles.forEach(crs => {
            if (!crs.when || typeof crs.when !== 'function') {
                throw new Error('"when" must be defined in the conditional style object and must be function');
            }
            if (crs.when(row)) {
                rowStyle = crs.style || {};
                if (crs.classNames) {
                    classNames = [...classNames, ...crs.classNames];
                }
                if (typeof crs.style === 'function') {
                    rowStyle = crs.style(row) || {};
                }
            }
        });
    }
    return { style: rowStyle, classNames: classNames.join(' ') };
}
function isRowSelected(row, selectedRows = [], keyField = 'id') {
    const outerField = prop(row, keyField);
    if (outerField) {
        return selectedRows.some(r => {
            const innerField = prop(r, keyField);
            return innerField === outerField;
        });
    }
    return selectedRows.some(r => r === row);
}
function isOdd(num) {
    return num % 2 === 0;
}
function findColumnIndexById(columns, id) {
    if (!id) {
        return -1;
    }
    return columns.findIndex(c => {
        return equalizeId(c.id, id);
    });
}
function equalizeId(a, b) {
    return a == b;
}

function tableReducer(state, action) {
    const toggleOnSelectedRowsChange = !state.toggleOnSelectedRowsChange;
    switch (action.type) {
        case 'SELECT_ALL_ROWS': {
            const { keyField, rows, rowCount, mergeSelections } = action;
            const allChecked = !state.allSelected;
            const toggleOnSelectedRowsChange = !state.toggleOnSelectedRowsChange;
            if (mergeSelections) {
                const selections = allChecked
                    ? [...state.selectedRows, ...rows.filter(row => !isRowSelected(row, state.selectedRows, keyField))]
                    : state.selectedRows.filter(row => !isRowSelected(row, rows, keyField));
                return Object.assign(Object.assign({}, state), { allSelected: allChecked, selectedCount: selections.length, selectedRows: selections, toggleOnSelectedRowsChange });
            }
            return Object.assign(Object.assign({}, state), { allSelected: allChecked, selectedCount: allChecked ? rowCount : 0, selectedRows: allChecked ? rows : [], toggleOnSelectedRowsChange });
        }
        case 'SELECT_SINGLE_ROW': {
            const { keyField, row, isSelected, rowCount, singleSelect } = action;
            if (singleSelect) {
                if (isSelected) {
                    return Object.assign(Object.assign({}, state), { selectedCount: 0, allSelected: false, selectedRows: [], toggleOnSelectedRowsChange });
                }
                return Object.assign(Object.assign({}, state), { selectedCount: 1, allSelected: false, selectedRows: [row], toggleOnSelectedRowsChange });
            }
            if (isSelected) {
                return Object.assign(Object.assign({}, state), { selectedCount: state.selectedRows.length > 0 ? state.selectedRows.length - 1 : 0, allSelected: false, selectedRows: removeItem(state.selectedRows, row, keyField), toggleOnSelectedRowsChange });
            }
            return Object.assign(Object.assign({}, state), { selectedCount: state.selectedRows.length + 1, allSelected: state.selectedRows.length + 1 === rowCount, selectedRows: insertItem(state.selectedRows, row), toggleOnSelectedRowsChange });
        }
        case 'SELECT_MULTIPLE_ROWS': {
            const { keyField, selectedRows, totalRows, mergeSelections } = action;
            if (mergeSelections) {
                const selections = [
                    ...state.selectedRows,
                    ...selectedRows.filter(row => !isRowSelected(row, state.selectedRows, keyField)),
                ];
                return Object.assign(Object.assign({}, state), { selectedCount: selections.length, allSelected: false, selectedRows: selections, toggleOnSelectedRowsChange });
            }
            return Object.assign(Object.assign({}, state), { selectedCount: selectedRows.length, allSelected: selectedRows.length === totalRows, selectedRows,
                toggleOnSelectedRowsChange });
        }
        case 'CLEAR_SELECTED_ROWS': {
            const { selectedRowsFlag } = action;
            return Object.assign(Object.assign({}, state), { allSelected: false, selectedCount: 0, selectedRows: [], selectedRowsFlag });
        }
        case 'SORT_CHANGE': {
            const { sortDirection, selectedColumn, clearSelectedOnSort } = action;
            return Object.assign(Object.assign(Object.assign({}, state), { selectedColumn,
                sortDirection, currentPage: 1 }), (clearSelectedOnSort && {
                allSelected: false,
                selectedCount: 0,
                selectedRows: [],
                toggleOnSelectedRowsChange,
            }));
        }
        case 'CHANGE_PAGE': {
            const { page, paginationServer, visibleOnly, persistSelectedOnPageChange } = action;
            const mergeSelections = paginationServer && persistSelectedOnPageChange;
            const clearSelectedOnPage = (paginationServer && !persistSelectedOnPageChange) || visibleOnly;
            return Object.assign(Object.assign(Object.assign(Object.assign({}, state), { currentPage: page }), (mergeSelections && {
                allSelected: false,
            })), (clearSelectedOnPage && {
                allSelected: false,
                selectedCount: 0,
                selectedRows: [],
                toggleOnSelectedRowsChange,
            }));
        }
        case 'CHANGE_ROWS_PER_PAGE': {
            const { rowsPerPage, page } = action;
            return Object.assign(Object.assign({}, state), { currentPage: page, rowsPerPage });
        }
    }
}

const disabledCSS = styled.css `
	pointer-events: none;
	opacity: 0.4;
`;
const TableStyle = styled__default["default"].div `
	position: relative;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	max-width: 100%;
	${({ disabled }) => disabled && disabledCSS};
	${({ theme }) => theme.table.style};
`;

const fixedCSS = styled.css `
	position: sticky;
	position: -webkit-sticky; /* Safari */
	top: 0;
	z-index: 1;
`;
const Head = styled__default["default"].div `
	display: flex;
	width: 100%;
	${({ fixedHeader }) => fixedHeader && fixedCSS};
	${({ theme }) => theme.head.style};
`;

const HeadRow = styled__default["default"].div `
	display: flex;
	align-items: stretch;
	width: 100%;
	${({ theme }) => theme.headRow.style};
	${({ dense, theme }) => dense && theme.headRow.denseStyle};
`;

const SMALL = 599;
const MEDIUM = 959;
const LARGE = 1280;
const media = {
    sm: (literals, ...args) => styled.css `
		@media screen and (max-width: ${SMALL}px) {
			${styled.css(literals, ...args)}
		}
	`,
    md: (literals, ...args) => styled.css `
		@media screen and (max-width: ${MEDIUM}px) {
			${styled.css(literals, ...args)}
		}
	`,
    lg: (literals, ...args) => styled.css `
		@media screen and (max-width: ${LARGE}px) {
			${styled.css(literals, ...args)}
		}
	`,
    custom: (value) => (literals, ...args) => styled.css `
				@media screen and (max-width: ${value}px) {
					${styled.css(literals, ...args)}
				}
			`,
};

const CellBase = styled__default["default"].div `
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	line-height: normal;
	${({ theme, headCell }) => theme[headCell ? 'headCells' : 'cells'].style};
	${({ noPadding }) => noPadding && 'padding: 0'};
`;
const CellExtended = styled__default["default"](CellBase) `
	flex-grow: ${({ button, grow }) => (grow === 0 || button ? 0 : grow || 1)};
	flex-shrink: 0;
	flex-basis: 0;
	max-width: ${({ maxWidth }) => maxWidth || '100%'};
	min-width: ${({ minWidth }) => minWidth || '100px'};
	${({ width }) => width &&
    styled.css `
			min-width: ${width};
			max-width: ${width};
		`};
	${({ right }) => right && 'justify-content: flex-end'};
	${({ button, center }) => (center || button) && 'justify-content: center'};
	${({ compact, button }) => (compact || button) && 'padding: 0'};

	/* handle hiding cells */
	${({ hide }) => hide &&
    hide === 'sm' &&
    media.sm `
    display: none;
  `};
	${({ hide }) => hide &&
    hide === 'md' &&
    media.md `
    display: none;
  `};
	${({ hide }) => hide &&
    hide === 'lg' &&
    media.lg `
    display: none;
  `};
	${({ hide }) => hide &&
    Number.isInteger(hide) &&
    media.custom(hide) `
    display: none;
  `};
`;

const overflowCSS = styled.css `
	div:first-child {
		white-space: ${({ wrapCell }) => (wrapCell ? 'normal' : 'nowrap')};
		overflow: ${({ allowOverflow }) => (allowOverflow ? 'visible' : 'hidden')};
		text-overflow: ellipsis;
	}
`;
const CellStyle = styled__default["default"](CellExtended).attrs(props => ({
    style: props.style,
})) `
	${({ renderAsCell }) => !renderAsCell && overflowCSS};
	${({ theme, isDragging }) => isDragging && theme.cells.draggingStyle};
	${({ cellStyle }) => cellStyle};
`;
function Cell({ id, column, row, rowIndex, dataTag, isDragging, onDragStart, onDragOver, onDragEnd, onDragEnter, onDragLeave, }) {
    const { style, classNames } = getConditionalStyle(row, column.conditionalCellStyles, ['rdt_TableCell']);
    return (React__namespace.createElement(CellStyle, { id: id, "data-column-id": column.id, role: "cell", className: classNames, "data-tag": dataTag, cellStyle: column.style, renderAsCell: !!column.cell, allowOverflow: column.allowOverflow, button: column.button, center: column.center, compact: column.compact, grow: column.grow, hide: column.hide, maxWidth: column.maxWidth, minWidth: column.minWidth, right: column.right, width: column.width, wrapCell: column.wrap, style: style, isDragging: isDragging, onDragStart: onDragStart, onDragOver: onDragOver, onDragEnd: onDragEnd, onDragEnter: onDragEnter, onDragLeave: onDragLeave },
        !column.cell && React__namespace.createElement("div", { "data-tag": dataTag }, getProperty(row, column.selector, column.format, rowIndex)),
        column.cell && column.cell(row, rowIndex, column, id)));
}
var TableCell = React__namespace.memo(Cell);

const defaultComponentName = 'input';
const calculateBaseStyle = (disabled) => (Object.assign(Object.assign({ fontSize: '18px' }, (!disabled && { cursor: 'pointer' })), { padding: 0, marginTop: '1px', verticalAlign: 'middle', position: 'relative' }));
function Checkbox({ name, component = defaultComponentName, componentOptions = { style: {} }, indeterminate = false, checked = false, disabled = false, onClick = noop, }) {
    const setCheckboxRef = (checkbox) => {
        if (checkbox) {
            checkbox.indeterminate = indeterminate;
        }
    };
    const TagName = component;
    const baseStyle = TagName !== defaultComponentName ? componentOptions.style : calculateBaseStyle(disabled);
    const resolvedComponentOptions = React__namespace.useMemo(() => handleFunctionProps(componentOptions, indeterminate), [componentOptions, indeterminate]);
    return (React__namespace.createElement(TagName, Object.assign({ type: "checkbox", ref: setCheckboxRef, style: baseStyle, onClick: disabled ? noop : onClick, name: name, "aria-label": name, checked: checked, disabled: disabled }, resolvedComponentOptions, { onChange: noop })));
}
var Checkbox$1 = React__namespace.memo(Checkbox);

const TableCellCheckboxStyle = styled__default["default"](CellBase) `
	flex: 0 0 48px;
	min-width: 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;
function TableCellCheckbox({ name, keyField, row, rowCount, selected, selectableRowsComponent, selectableRowsComponentProps, selectableRowsSingle, selectableRowDisabled, onSelectedRow, }) {
    const disabled = !!(selectableRowDisabled && selectableRowDisabled(row));
    const handleOnRowSelected = () => {
        onSelectedRow({
            type: 'SELECT_SINGLE_ROW',
            row,
            isSelected: selected,
            keyField,
            rowCount,
            singleSelect: selectableRowsSingle,
        });
    };
    return (React__namespace.createElement(TableCellCheckboxStyle, { onClick: (e) => e.stopPropagation(), className: "rdt_TableCell", noPadding: true },
        React__namespace.createElement(Checkbox$1, { name: name, component: selectableRowsComponent, componentOptions: selectableRowsComponentProps, checked: selected, "aria-checked": selected, onClick: handleOnRowSelected, disabled: disabled })));
}

const ButtonStyle = styled__default["default"].button `
	display: inline-flex;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	border: none;
	background-color: transparent;
	${({ theme }) => theme.expanderButton.style};
`;
function ExpanderButton({ disabled = false, expanded = false, expandableIcon, id, row, onToggled, }) {
    const icon = expanded ? expandableIcon.expanded : expandableIcon.collapsed;
    const handleToggle = () => onToggled && onToggled(row);
    return (React__namespace.createElement(ButtonStyle, { "aria-disabled": disabled, onClick: handleToggle, "data-testid": `expander-button-${id}`, disabled: disabled, "aria-label": expanded ? 'Collapse Row' : 'Expand Row', role: "button", type: "button" }, icon));
}

const CellExpanderStyle = styled__default["default"](CellBase) `
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({ theme }) => theme.expanderCell.style};
`;
function CellExpander({ row, expanded = false, expandableIcon, id, onToggled, disabled = false, }) {
    return (React__namespace.createElement(CellExpanderStyle, { onClick: (e) => e.stopPropagation(), noPadding: true },
        React__namespace.createElement(ExpanderButton, { id: id, row: row, expanded: expanded, expandableIcon: expandableIcon, disabled: disabled, onToggled: onToggled })));
}

const ExpanderRowStyle = styled__default["default"].div `
	width: 100%;
	box-sizing: border-box;
	${({ theme }) => theme.expanderRow.style};
	${({ extendedRowStyle }) => extendedRowStyle};
`;
function ExpanderRow({ data, ExpanderComponent, expanderComponentProps, extendedRowStyle, extendedClassNames, }) {
    const classNamesSplit = extendedClassNames.split(' ').filter(c => c !== 'rdt_TableRow');
    const classNames = ['rdt_ExpanderRow', ...classNamesSplit].join(' ');
    return (React__namespace.createElement(ExpanderRowStyle, { className: classNames, extendedRowStyle: extendedRowStyle },
        React__namespace.createElement(ExpanderComponent, Object.assign({ data: data }, expanderComponentProps))));
}
var ExpanderRow$1 = React__namespace.memo(ExpanderRow);

const STOP_PROP_TAG = 'allowRowEvents';
exports.Direction = void 0;
(function (Direction) {
    Direction["LTR"] = "ltr";
    Direction["RTL"] = "rtl";
    Direction["AUTO"] = "auto";
})(exports.Direction || (exports.Direction = {}));
exports.Alignment = void 0;
(function (Alignment) {
    Alignment["LEFT"] = "left";
    Alignment["RIGHT"] = "right";
    Alignment["CENTER"] = "center";
})(exports.Alignment || (exports.Alignment = {}));
exports.Media = void 0;
(function (Media) {
    Media["SM"] = "sm";
    Media["MD"] = "md";
    Media["LG"] = "lg";
})(exports.Media || (exports.Media = {}));

const highlightCSS = styled.css `
	&:hover {
		${({ highlightOnHover, theme }) => highlightOnHover && theme.rows.highlightOnHoverStyle};
	}
`;
const pointerCSS = styled.css `
	&:hover {
		cursor: pointer;
	}
`;
const TableRowStyle = styled__default["default"].div.attrs(props => ({
    style: props.style,
})) `
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({ theme }) => theme.rows.style};
	${({ dense, theme }) => dense && theme.rows.denseStyle};
	${({ striped, theme }) => striped && theme.rows.stripedStyle};
	${({ highlightOnHover }) => highlightOnHover && highlightCSS};
	${({ pointerOnHover }) => pointerOnHover && pointerCSS};
	${({ selected, theme }) => selected && theme.rows.selectedHighlightStyle};
`;
function Row({ columns = [], conditionalRowStyles = [], defaultExpanded = false, defaultExpanderDisabled = false, dense = false, expandableIcon, expandableRows = false, expandableRowsComponent, expandableRowsComponentProps, expandableRowsHideExpander, expandOnRowClicked = false, expandOnRowDoubleClicked = false, highlightOnHover = false, id, expandableInheritConditionalStyles, keyField, onRowClicked = noop, onRowDoubleClicked = noop, onRowMouseEnter = noop, onRowMouseLeave = noop, onRowExpandToggled = noop, expandableCloseAllOnExpand = false, expandableRowFlag = false, onSelectedRow = noop, pointerOnHover = false, row, rowCount, rowIndex, selectableRowDisabled = null, selectableRows = false, selectableRowsComponent, selectableRowsComponentProps, selectableRowsHighlight = false, selectableRowsSingle = false, selected, striped = false, draggingColumnId, onDragStart, onDragOver, onDragEnd, onDragEnter, onDragLeave, }) {
    const [expanded, setExpanded] = React__namespace.useState(defaultExpanded);
    const [getExpandableRowFlag, setExpandableRowFlag] = React__namespace.useState(expandableRowFlag);
    React__namespace.useEffect(() => {
        setExpanded(defaultExpanded);
    }, [defaultExpanded]);
    React__namespace.useEffect(() => {
        setExpandableRowFlag(expandableRowFlag);
    }, [expandableRowFlag]);
    const handleExpanded = React__namespace.useCallback(() => {
        setExpandableRowFlag(!getExpandableRowFlag);
        setExpanded(!expanded);
        onRowExpandToggled(!expanded, row);
    }, [expanded, onRowExpandToggled, row]);
    const showPointer = pointerOnHover || (expandableRows && (expandOnRowClicked || expandOnRowDoubleClicked));
    const handleRowClick = React__namespace.useCallback(e => {
        if (e.target && e.target.getAttribute('data-tag') === STOP_PROP_TAG) {
            onRowClicked(row, e);
            if (!defaultExpanderDisabled && expandableRows && expandOnRowClicked) {
                handleExpanded();
            }
        }
    }, [defaultExpanderDisabled, expandOnRowClicked, expandableRows, handleExpanded, onRowClicked, row]);
    const handleRowDoubleClick = React__namespace.useCallback(e => {
        if (e.target && e.target.getAttribute('data-tag') === STOP_PROP_TAG) {
            onRowDoubleClicked(row, e);
            if (!defaultExpanderDisabled && expandableRows && expandOnRowDoubleClicked) {
                handleExpanded();
            }
        }
    }, [defaultExpanderDisabled, expandOnRowDoubleClicked, expandableRows, handleExpanded, onRowDoubleClicked, row]);
    const handleRowMouseEnter = React__namespace.useCallback(e => {
        onRowMouseEnter(row, e);
    }, [onRowMouseEnter, row]);
    const handleRowMouseLeave = React__namespace.useCallback(e => {
        onRowMouseLeave(row, e);
    }, [onRowMouseLeave, row]);
    const rowKeyField = prop(row, keyField);
    const { style, classNames } = getConditionalStyle(row, conditionalRowStyles, ['rdt_TableRow']);
    const highlightSelected = selectableRowsHighlight && selected;
    const inheritStyles = expandableInheritConditionalStyles ? style : {};
    const isStriped = striped && isOdd(rowIndex);
    const isExpanded = expandableCloseAllOnExpand ? getExpandableRowFlag : expanded;
    return (React__namespace.createElement(React__namespace.Fragment, null,
        React__namespace.createElement(TableRowStyle, { id: `row-${id}`, role: "row", striped: isStriped, highlightOnHover: highlightOnHover, pointerOnHover: !defaultExpanderDisabled && showPointer, dense: dense, onClick: handleRowClick, onDoubleClick: handleRowDoubleClick, onMouseEnter: handleRowMouseEnter, onMouseLeave: handleRowMouseLeave, className: classNames, selected: highlightSelected, style: style },
            selectableRows && (React__namespace.createElement(TableCellCheckbox, { name: `select-row-${rowKeyField}`, keyField: keyField, row: row, rowCount: rowCount, selected: selected, selectableRowsComponent: selectableRowsComponent, selectableRowsComponentProps: selectableRowsComponentProps, selectableRowDisabled: selectableRowDisabled, selectableRowsSingle: selectableRowsSingle, onSelectedRow: onSelectedRow })),
            expandableRows && !expandableRowsHideExpander && (React__namespace.createElement(CellExpander, { id: rowKeyField, expandableIcon: expandableIcon, expanded: expandableCloseAllOnExpand ? getExpandableRowFlag : expanded, row: row, onToggled: handleExpanded, disabled: defaultExpanderDisabled })),
            columns.map(column => {
                if (column.omit) {
                    return null;
                }
                return (React__namespace.createElement(TableCell, { id: `cell-${column.id}-${rowKeyField}`, key: `cell-${column.id}-${rowKeyField}`, dataTag: column.ignoreRowClick || column.button ? null : STOP_PROP_TAG, column: column, row: row, rowIndex: rowIndex, isDragging: equalizeId(draggingColumnId, column.id), onDragStart: onDragStart, onDragOver: onDragOver, onDragEnd: onDragEnd, onDragEnter: onDragEnter, onDragLeave: onDragLeave }));
            })),
        expandableRows && isExpanded && (React__namespace.createElement(ExpanderRow$1, { key: `expander1-${rowKeyField}`, data: row, extendedRowStyle: inheritStyles, extendedClassNames: classNames, ExpanderComponent: expandableRowsComponent, expanderComponentProps: expandableRowsComponentProps }))));
}

const Icon = styled__default["default"].span `
	padding: 2px;
	color: inherit;
	flex-grow: 0;
	flex-shrink: 0;
	${({ sortActive }) => (sortActive ? 'opacity: 1' : 'opacity: 0')};
	${({ sortDirection }) => sortDirection === 'desc' && 'transform: rotate(180deg)'};
`;
const NativeSortIcon = ({ sortActive, sortDirection }) => (React__default["default"].createElement(Icon, { sortActive: sortActive, sortDirection: sortDirection }, "\u25B2"));

const ColumnStyled = styled__default["default"](CellExtended) `
	${({ button }) => button && 'text-align: center'};
	${({ theme, isDragging }) => isDragging && theme.headCells.draggingStyle};
`;
const sortableCSS = styled.css `
	cursor: pointer;
	span.__rdt_custom_sort_icon__ {
		i,
		svg {
			transform: 'translate3d(0, 0, 0)';
			${({ sortActive }) => (sortActive ? 'opacity: 1' : 'opacity: 0')};
			color: inherit;
			font-size: 18px;
			height: 18px;
			width: 18px;
			backface-visibility: hidden;
			transform-style: preserve-3d;
			transition-duration: 95ms;
			transition-property: transform;
		}

		&.asc i,
		&.asc svg {
			transform: rotate(180deg);
		}
	}

	${({ sortActive }) => !sortActive &&
    styled.css `
			&:hover,
			&:focus {
				opacity: 0.7;

				span,
				span.__rdt_custom_sort_icon__ * {
					opacity: 0.7;
				}
			}
		`};
`;
const ColumnSortable = styled__default["default"].div `
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({ disabled }) => !disabled && sortableCSS};
`;
const ColumnText = styled__default["default"].div `
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;
function TableCol({ column, disabled, draggingColumnId, selectedColumn = {}, sortDirection, sortIcon, sortServer, pagination, paginationServer, persistSelectedOnSort, selectableRowsVisibleOnly, onSort, onDragStart, onDragOver, onDragEnd, onDragEnter, onDragLeave, }) {
    React__namespace.useEffect(() => {
        if (typeof column.selector === 'string') {
            console.error(`Warning: ${column.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`);
        }
    }, []);
    const [showTooltip, setShowTooltip] = React__namespace.useState(false);
    const columnRef = React__namespace.useRef(null);
    React__namespace.useEffect(() => {
        if (columnRef.current) {
            setShowTooltip(columnRef.current.scrollWidth > columnRef.current.clientWidth);
        }
    }, [showTooltip]);
    if (column.omit) {
        return null;
    }
    const handleSortChange = () => {
        if (!column.sortable && !column.selector) {
            return;
        }
        let direction = sortDirection;
        if (equalizeId(selectedColumn.id, column.id)) {
            direction = sortDirection === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
        }
        onSort({
            type: 'SORT_CHANGE',
            sortDirection: direction,
            selectedColumn: column,
            clearSelectedOnSort: (pagination && paginationServer && !persistSelectedOnSort) || sortServer || selectableRowsVisibleOnly,
        });
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSortChange();
        }
    };
    const renderNativeSortIcon = (sortActive) => (React__namespace.createElement(NativeSortIcon, { sortActive: sortActive, sortDirection: sortDirection }));
    const renderCustomSortIcon = () => (React__namespace.createElement("span", { className: [sortDirection, '__rdt_custom_sort_icon__'].join(' ') }, sortIcon));
    const sortActive = !!(column.sortable && equalizeId(selectedColumn.id, column.id));
    const disableSort = !column.sortable || disabled;
    const nativeSortIconLeft = column.sortable && !sortIcon && !column.right;
    const nativeSortIconRight = column.sortable && !sortIcon && column.right;
    const customSortIconLeft = column.sortable && sortIcon && !column.right;
    const customSortIconRight = column.sortable && sortIcon && column.right;
    return (React__namespace.createElement(ColumnStyled, { "data-column-id": column.id, className: "rdt_TableCol", headCell: true, allowOverflow: column.allowOverflow, button: column.button, compact: column.compact, grow: column.grow, hide: column.hide, maxWidth: column.maxWidth, minWidth: column.minWidth, right: column.right, center: column.center, width: column.width, draggable: column.reorder, isDragging: equalizeId(column.id, draggingColumnId), onDragStart: onDragStart, onDragOver: onDragOver, onDragEnd: onDragEnd, onDragEnter: onDragEnter, onDragLeave: onDragLeave }, column.name && (React__namespace.createElement(ColumnSortable, { "data-column-id": column.id, "data-sort-id": column.id, role: "columnheader", tabIndex: 0, className: "rdt_TableCol_Sortable", onClick: !disableSort ? handleSortChange : undefined, onKeyPress: !disableSort ? handleKeyPress : undefined, sortActive: !disableSort && sortActive, disabled: disableSort },
        !disableSort && customSortIconRight && renderCustomSortIcon(),
        !disableSort && nativeSortIconRight && renderNativeSortIcon(sortActive),
        typeof column.name === 'string' ? (React__namespace.createElement(ColumnText, { title: showTooltip ? column.name : undefined, ref: columnRef, "data-column-id": column.id }, column.name)) : (column.name),
        !disableSort && customSortIconLeft && renderCustomSortIcon(),
        !disableSort && nativeSortIconLeft && renderNativeSortIcon(sortActive)))));
}
var Column = React__namespace.memo(TableCol);

const ColumnStyle = styled__default["default"](CellBase) `
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;
function ColumnCheckbox({ headCell = true, rowData, keyField, allSelected, mergeSelections, selectedRows, selectableRowsComponent, selectableRowsComponentProps, selectableRowDisabled, onSelectAllRows, }) {
    const indeterminate = selectedRows.length > 0 && !allSelected;
    const rows = selectableRowDisabled ? rowData.filter((row) => !selectableRowDisabled(row)) : rowData;
    const isDisabled = rows.length === 0;
    const rowCount = Math.min(rowData.length, rows.length);
    const handleSelectAll = () => {
        onSelectAllRows({
            type: 'SELECT_ALL_ROWS',
            rows,
            rowCount,
            mergeSelections,
            keyField,
        });
    };
    return (React__namespace.createElement(ColumnStyle, { className: "rdt_TableCol", headCell: headCell, noPadding: true },
        React__namespace.createElement(Checkbox$1, { name: "select-all-rows", component: selectableRowsComponent, componentOptions: selectableRowsComponentProps, onClick: handleSelectAll, checked: allSelected, indeterminate: indeterminate, disabled: isDisabled })));
}

function useRTL(direction = exports.Direction.AUTO) {
    const isClient = typeof window === 'object';
    const [isRTL, setIsRTL] = React__namespace.useState(false);
    React__namespace.useEffect(() => {
        if (!isClient) {
            return;
        }
        if (direction === 'auto') {
            const canUse = !!(window.document && window.document.createElement);
            const bodyRTL = document.getElementsByTagName('BODY')[0];
            const htmlTRL = document.getElementsByTagName('HTML')[0];
            const hasRTL = bodyRTL.dir === 'rtl' || htmlTRL.dir === 'rtl';
            setIsRTL(canUse && hasRTL);
            return;
        }
        setIsRTL(direction === 'rtl');
    }, [direction, isClient]);
    return isRTL;
}

const Title$1 = styled__default["default"].div `
	display: flex;
	align-items: center;
	flex: 1 0 auto;
	height: 100%;
	color: ${({ theme }) => theme.contextMenu.fontColor};
	font-size: ${({ theme }) => theme.contextMenu.fontSize};
	font-weight: 400;
`;
const ContextActions = styled__default["default"].div `
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
`;
const ContextMenuStyle = styled__default["default"].div `
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-sizing: inherit;
	z-index: 1;
	align-items: center;
	justify-content: space-between;
	display: flex;
	${({ rtl }) => rtl && 'direction: rtl'};
	${({ theme }) => theme.contextMenu.style};
	${({ theme, visible }) => visible && theme.contextMenu.activeStyle};
`;
const generateDefaultContextTitle = (contextMessage, selectedCount, rtl) => {
    if (selectedCount === 0) {
        return null;
    }
    const datumName = selectedCount === 1 ? contextMessage.singular : contextMessage.plural;
    if (rtl) {
        return `${selectedCount} ${contextMessage.message || ''} ${datumName}`;
    }
    return `${selectedCount} ${datumName} ${contextMessage.message || ''}`;
};
function ContextMenu({ contextMessage, contextActions, contextComponent, selectedCount, direction, }) {
    const isRTL = useRTL(direction);
    const visible = selectedCount > 0;
    if (contextComponent) {
        return (React__namespace.createElement(ContextMenuStyle, { visible: visible }, React__namespace.cloneElement(contextComponent, { selectedCount })));
    }
    return (React__namespace.createElement(ContextMenuStyle, { visible: visible, rtl: isRTL },
        React__namespace.createElement(Title$1, null, generateDefaultContextTitle(contextMessage, selectedCount, isRTL)),
        React__namespace.createElement(ContextActions, null, contextActions)));
}

const HeaderStyle = styled__default["default"].div `
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex: 1 1 auto;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	flex-wrap: wrap;
	${({ theme }) => theme.header.style}
`;
const Title = styled__default["default"].div `
	flex: 1 0 auto;
	color: ${({ theme }) => theme.header.fontColor};
	font-size: ${({ theme }) => theme.header.fontSize};
	font-weight: 400;
`;
const Actions = styled__default["default"].div `
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * {
		margin-left: 5px;
	}
`;
const Header = ({ title, actions = null, contextMessage, contextActions, contextComponent, selectedCount, direction, showMenu = true, }) => (React__namespace.createElement(HeaderStyle, { className: "rdt_TableHeader", role: "heading", "aria-level": 1 },
    React__namespace.createElement(Title, null, title),
    actions && React__namespace.createElement(Actions, null, actions),
    showMenu && (React__namespace.createElement(ContextMenu, { contextMessage: contextMessage, contextActions: contextActions, contextComponent: contextComponent, direction: direction, selectedCount: selectedCount }))));

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const alignMap = {
    left: 'flex-start',
    right: 'flex-end',
    center: 'center',
};
const SubheaderWrapper = styled__default["default"].header `
	position: relative;
	display: flex;
	flex: 1 1 auto;
	box-sizing: border-box;
	align-items: center;
	padding: 4px 16px 4px 24px;
	width: 100%;
	justify-content: ${({ align }) => alignMap[align]};
	flex-wrap: ${({ wrapContent }) => (wrapContent ? 'wrap' : 'nowrap')};
	${({ theme }) => theme.subHeader.style}
`;
const Subheader = (_a) => {
    var { align = 'right', wrapContent = true } = _a, rest = __rest(_a, ["align", "wrapContent"]);
    return (React__namespace.createElement(SubheaderWrapper, Object.assign({ align: align, wrapContent: wrapContent }, rest)));
};

const Body = styled__default["default"].div `
	display: flex;
	flex-direction: column;
`;

const ResponsiveWrapper = styled__default["default"].div `
	position: relative;
	width: 100%;
	border-radius: inherit;
	${({ responsive, fixedHeader }) => responsive &&
    styled.css `
			overflow-x: auto;

			// hidden prevents vertical scrolling in firefox when fixedHeader is disabled
			overflow-y: ${fixedHeader ? 'auto' : 'hidden'};
			min-height: 0;
		`};

	${({ fixedHeader = false, fixedHeaderScrollHeight = '100vh' }) => fixedHeader &&
    styled.css `
			max-height: ${fixedHeaderScrollHeight};
			-webkit-overflow-scrolling: touch;
		`};

	${({ theme }) => theme.responsiveWrapper.style};
`;

const ProgressWrapper = styled__default["default"].div `
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${props => props.theme.progress.style};
`;

const Wrapper = styled__default["default"].div `
	position: relative;
	width: 100%;
	${({ theme }) => theme.tableWrapper.style};
`;

const ColumnExpander = styled__default["default"](CellBase) `
	white-space: nowrap;
	${({ theme }) => theme.expanderCell.style};
`;

const NoDataWrapper = styled__default["default"].div `
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${({ theme }) => theme.noData.style};
`;

const DropdownIcon = () => (React__default["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
    React__default["default"].createElement("path", { d: "M7 10l5 5 5-5z" }),
    React__default["default"].createElement("path", { d: "M0 0h24v24H0z", fill: "none" })));

const SelectControl = styled__default["default"].select `
	cursor: pointer;
	height: 24px;
	max-width: 100%;
	user-select: none;
	padding-left: 8px;
	padding-right: 24px;
	box-sizing: content-box;
	font-size: inherit;
	color: inherit;
	border: none;
	background-color: transparent;
	appearance: none;
	direction: ltr;
	flex-shrink: 0;

	&::-ms-expand {
		display: none;
	}

	&:disabled::-ms-expand {
		background: #f60;
	}

	option {
		color: initial;
	}
`;
const SelectWrapper = styled__default["default"].div `
	position: relative;
	flex-shrink: 0;
	font-size: inherit;
	color: inherit;
	margin-top: 1px;

	svg {
		top: 0;
		right: 0;
		color: inherit;
		position: absolute;
		fill: currentColor;
		width: 24px;
		height: 24px;
		display: inline-block;
		user-select: none;
		pointer-events: none;
	}
`;
const Select = (_a) => {
    var { defaultValue, onChange } = _a, rest = __rest(_a, ["defaultValue", "onChange"]);
    return (React__namespace.createElement(SelectWrapper, null,
        React__namespace.createElement(SelectControl, Object.assign({ onChange: onChange, defaultValue: defaultValue }, rest)),
        React__namespace.createElement(DropdownIcon, null)));
};

const useWindowSize = () => {
    const isClient = typeof window === 'object';
    function getSize() {
        return {
            width: isClient ? window.innerWidth : undefined,
            height: isClient ? window.innerHeight : undefined,
        };
    }
    const [windowSize, setWindowSize] = React__namespace.useState(getSize);
    React__namespace.useEffect(() => {
        if (!isClient) {
            return () => null;
        }
        function handleResize() {
            setWindowSize(getSize());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
};

const FirstPage = () => (React__default["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", "aria-hidden": "true", role: "presentation" },
    React__default["default"].createElement("path", { d: "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" }),
    React__default["default"].createElement("path", { fill: "none", d: "M24 24H0V0h24v24z" })));

const LastPage = () => (React__default["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", "aria-hidden": "true", role: "presentation" },
    React__default["default"].createElement("path", { d: "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" }),
    React__default["default"].createElement("path", { fill: "none", d: "M0 0h24v24H0V0z" })));

const Left = () => (React__default["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", "aria-hidden": "true", role: "presentation" },
    React__default["default"].createElement("path", { d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" }),
    React__default["default"].createElement("path", { d: "M0 0h24v24H0z", fill: "none" })));

const Right = () => (React__default["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", "aria-hidden": "true", role: "presentation" },
    React__default["default"].createElement("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }),
    React__default["default"].createElement("path", { d: "M0 0h24v24H0z", fill: "none" })));

const ExpanderCollapsedIcon = () => (React__default["default"].createElement("svg", { fill: "currentColor", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    React__default["default"].createElement("path", { d: "M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" }),
    React__default["default"].createElement("path", { d: "M0-.25h24v24H0z", fill: "none" })));

const ExpanderExpandedIcon = () => (React__default["default"].createElement("svg", { fill: "currentColor", height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
    React__default["default"].createElement("path", { d: "M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" }),
    React__default["default"].createElement("path", { d: "M0-.75h24v24H0z", fill: "none" })));

const defaultProps = {
    columns: [],
    data: [],
    title: '',
    keyField: 'id',
    selectableRows: false,
    selectableRowsHighlight: false,
    selectableRowsNoSelectAll: false,
    selectableRowSelected: null,
    selectableRowDisabled: null,
    selectableRowsComponent: 'input',
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
    expandableRowsComponent: function DefaultExpander() {
        return (React__default["default"].createElement("div", null,
            "To add an expander pass in a component instance via ",
            React__default["default"].createElement("strong", null, "expandableRowsComponent"),
            ". You can then access props.data from this component."));
    },
    expandableIcon: {
        collapsed: React__default["default"].createElement(ExpanderCollapsedIcon, null),
        expanded: React__default["default"].createElement(ExpanderExpandedIcon, null),
    },
    expandableRowsComponentProps: {},
    progressPending: false,
    progressComponent: React__default["default"].createElement("div", { style: { fontSize: '24px', fontWeight: 700, padding: '24px' } }, "Loading..."),
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
    noDataComponent: React__default["default"].createElement("div", { style: { padding: '24px' } }, "There are no records to display"),
    disabled: false,
    noTableHead: false,
    noHeader: false,
    subHeader: false,
    subHeaderAlign: exports.Alignment.RIGHT,
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
    paginationIconFirstPage: React__default["default"].createElement(FirstPage, null),
    paginationIconLastPage: React__default["default"].createElement(LastPage, null),
    paginationIconNext: React__default["default"].createElement(Right, null),
    paginationIconPrevious: React__default["default"].createElement(Left, null),
    dense: false,
    conditionalRowStyles: [],
    theme: 'default',
    customStyles: {},
    direction: exports.Direction.AUTO,
    onChangePage: noop,
    onChangeRowsPerPage: noop,
    onRowClicked: noop,
    onRowDoubleClicked: noop,
    onRowMouseEnter: noop,
    onRowMouseLeave: noop,
    onRowExpandToggled: noop,
    expandableCloseAllOnExpand: false,
    onSelectedRowsChange: noop,
    onSort: noop,
    onColumnOrderChange: noop,
};

const defaultComponentOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    noRowsPerPage: false,
    selectAllRowsItem: false,
    selectAllRowsItemText: 'All',
};
const PaginationWrapper = styled__default["default"].nav `
	display: flex;
	flex: 1 1 auto;
	justify-content: flex-end;
	align-items: center;
	box-sizing: border-box;
	padding-right: 8px;
	padding-left: 8px;
	width: 100%;
	${({ theme }) => theme.pagination.style};
`;
const Button = styled__default["default"].button `
	position: relative;
	display: block;
	user-select: none;
	border: none;
	${({ theme }) => theme.pagination.pageButtonsStyle};
	${({ isRTL }) => isRTL && 'transform: scale(-1, -1)'};
`;
const PageList = styled__default["default"].div `
	display: flex;
	align-items: center;
	border-radius: 4px;
	white-space: nowrap;
	${media.sm `
    width: 100%;
    justify-content: space-around;
  `};
`;
const Span = styled__default["default"].span `
	flex-shrink: 1;
	user-select: none;
`;
const Range = styled__default["default"](Span) `
	margin: 0 24px;
`;
const RowLabel = styled__default["default"](Span) `
	margin: 0 4px;
`;
function Pagination({ rowsPerPage, rowCount, currentPage, direction = defaultProps.direction, paginationRowsPerPageOptions = defaultProps.paginationRowsPerPageOptions, paginationIconLastPage = defaultProps.paginationIconLastPage, paginationIconFirstPage = defaultProps.paginationIconFirstPage, paginationIconNext = defaultProps.paginationIconNext, paginationIconPrevious = defaultProps.paginationIconPrevious, paginationComponentOptions = defaultProps.paginationComponentOptions, onChangeRowsPerPage = defaultProps.onChangeRowsPerPage, onChangePage = defaultProps.onChangePage, }) {
    const windowSize = useWindowSize();
    const isRTL = useRTL(direction);
    const shouldShow = windowSize.width && windowSize.width > SMALL;
    const numPages = getNumberOfPages(rowCount, rowsPerPage);
    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage + 1;
    const disabledLesser = currentPage === 1;
    const disabledGreater = currentPage === numPages;
    const options = Object.assign(Object.assign({}, defaultComponentOptions), paginationComponentOptions);
    const range = currentPage === numPages
        ? `${firstIndex}-${rowCount} ${options.rangeSeparatorText} ${rowCount}`
        : `${firstIndex}-${lastIndex} ${options.rangeSeparatorText} ${rowCount}`;
    const handlePrevious = React__namespace.useCallback(() => onChangePage(currentPage - 1), [currentPage, onChangePage]);
    const handleNext = React__namespace.useCallback(() => onChangePage(currentPage + 1), [currentPage, onChangePage]);
    const handleFirst = React__namespace.useCallback(() => onChangePage(1), [onChangePage]);
    const handleLast = React__namespace.useCallback(() => onChangePage(getNumberOfPages(rowCount, rowsPerPage)), [onChangePage, rowCount, rowsPerPage]);
    const handleRowsPerPage = React__namespace.useCallback((e) => onChangeRowsPerPage(Number(e.target.value), currentPage), [currentPage, onChangeRowsPerPage]);
    const selectOptions = paginationRowsPerPageOptions.map((num) => (React__namespace.createElement("option", { key: num, value: num }, num)));
    if (options.selectAllRowsItem) {
        selectOptions.push(React__namespace.createElement("option", { key: -1, value: rowCount }, options.selectAllRowsItemText));
    }
    const select = (React__namespace.createElement(Select, { onChange: handleRowsPerPage, defaultValue: rowsPerPage, "aria-label": options.rowsPerPageText }, selectOptions));
    return (React__namespace.createElement(PaginationWrapper, { className: "rdt_Pagination" },
        !options.noRowsPerPage && shouldShow && (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement(RowLabel, null, options.rowsPerPageText),
            select)),
        shouldShow && React__namespace.createElement(Range, null, range),
        React__namespace.createElement(PageList, null,
            React__namespace.createElement(Button, { id: "pagination-first-page", type: "button", "aria-label": "First Page", "aria-disabled": disabledLesser, onClick: handleFirst, disabled: disabledLesser, isRTL: isRTL }, paginationIconFirstPage),
            React__namespace.createElement(Button, { id: "pagination-previous-page", type: "button", "aria-label": "Previous Page", "aria-disabled": disabledLesser, onClick: handlePrevious, disabled: disabledLesser, isRTL: isRTL }, paginationIconPrevious),
            !options.noRowsPerPage && !shouldShow && select,
            React__namespace.createElement(Button, { id: "pagination-next-page", type: "button", "aria-label": "Next Page", "aria-disabled": disabledGreater, onClick: handleNext, disabled: disabledGreater, isRTL: isRTL }, paginationIconNext),
            React__namespace.createElement(Button, { id: "pagination-last-page", type: "button", "aria-label": "Last Page", "aria-disabled": disabledGreater, onClick: handleLast, disabled: disabledGreater, isRTL: isRTL }, paginationIconLastPage))));
}
var NativePagination = React__namespace.memo(Pagination);

const useFirstUpdate = (fn, inputs) => {
    const firstUpdate = React__namespace.useRef(true);
    React__namespace.useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        fn();
    }, inputs);
};

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

const defaultTheme = {
    text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.38)',
    },
    background: {
        default: '#FFFFFF',
    },
    context: {
        background: '#e3f2fd',
        text: 'rgba(0, 0, 0, 0.87)',
    },
    divider: {
        default: 'rgba(0,0,0,.12)',
    },
    button: {
        default: 'rgba(0,0,0,.54)',
        focus: 'rgba(0,0,0,.12)',
        hover: 'rgba(0,0,0,.12)',
        disabled: 'rgba(0, 0, 0, .18)',
    },
    selected: {
        default: '#e3f2fd',
        text: 'rgba(0, 0, 0, 0.87)',
    },
    highlightOnHover: {
        default: '#EEEEEE',
        text: 'rgba(0, 0, 0, 0.87)',
    },
    striped: {
        default: '#FAFAFA',
        text: 'rgba(0, 0, 0, 0.87)',
    },
};
const defaultThemes = {
    default: defaultTheme,
    light: defaultTheme,
    dark: {
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(0,0,0,.12)',
        },
        background: {
            default: '#424242',
        },
        context: {
            background: '#E91E63',
            text: '#FFFFFF',
        },
        divider: {
            default: 'rgba(81, 81, 81, 1)',
        },
        button: {
            default: '#FFFFFF',
            focus: 'rgba(255, 255, 255, .54)',
            hover: 'rgba(255, 255, 255, .12)',
            disabled: 'rgba(255, 255, 255, .18)',
        },
        selected: {
            default: 'rgba(0, 0, 0, .7)',
            text: '#FFFFFF',
        },
        highlightOnHover: {
            default: 'rgba(0, 0, 0, .7)',
            text: '#FFFFFF',
        },
        striped: {
            default: 'rgba(0, 0, 0, .87)',
            text: '#FFFFFF',
        },
    },
};
function createTheme(name = 'default', customTheme, inherit = 'default') {
    if (!defaultThemes[name]) {
        defaultThemes[name] = cjs(defaultThemes[inherit], customTheme || {});
    }
    defaultThemes[name] = cjs(defaultThemes[name], customTheme || {});
    return defaultThemes[name];
}

const defaultStyles = (theme) => ({
    table: {
        style: {
            color: theme.text.primary,
            backgroundColor: theme.background.default,
        },
    },
    tableWrapper: {
        style: {
            display: 'table',
        },
    },
    responsiveWrapper: {
        style: {},
    },
    header: {
        style: {
            fontSize: '22px',
            color: theme.text.primary,
            backgroundColor: theme.background.default,
            minHeight: '56px',
            paddingLeft: '16px',
            paddingRight: '8px',
        },
    },
    subHeader: {
        style: {
            backgroundColor: theme.background.default,
            minHeight: '52px',
        },
    },
    head: {
        style: {
            color: theme.text.primary,
            fontSize: '12px',
            fontWeight: 500,
        },
    },
    headRow: {
        style: {
            backgroundColor: theme.background.default,
            minHeight: '52px',
            borderBottomWidth: '1px',
            borderBottomColor: theme.divider.default,
            borderBottomStyle: 'solid',
        },
        denseStyle: {
            minHeight: '32px',
        },
    },
    headCells: {
        style: {
            paddingLeft: '16px',
            paddingRight: '16px',
        },
        draggingStyle: {
            cursor: 'move',
        },
    },
    contextMenu: {
        style: {
            backgroundColor: theme.context.background,
            fontSize: '18px',
            fontWeight: 400,
            color: theme.context.text,
            paddingLeft: '16px',
            paddingRight: '8px',
            transform: 'translate3d(0, -100%, 0)',
            transitionDuration: '125ms',
            transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
            willChange: 'transform',
        },
        activeStyle: {
            transform: 'translate3d(0, 0, 0)',
        },
    },
    cells: {
        style: {
            paddingLeft: '16px',
            paddingRight: '16px',
            wordBreak: 'break-word',
        },
        draggingStyle: {},
    },
    rows: {
        style: {
            fontSize: '13px',
            fontWeight: 400,
            color: theme.text.primary,
            backgroundColor: theme.background.default,
            minHeight: '48px',
            '&:not(:last-of-type)': {
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: theme.divider.default,
            },
        },
        denseStyle: {
            minHeight: '32px',
        },
        selectedHighlightStyle: {
            '&:nth-of-type(n)': {
                color: theme.selected.text,
                backgroundColor: theme.selected.default,
                borderBottomColor: theme.background.default,
            },
        },
        highlightOnHoverStyle: {
            color: theme.highlightOnHover.text,
            backgroundColor: theme.highlightOnHover.default,
            transitionDuration: '0.15s',
            transitionProperty: 'background-color',
            borderBottomColor: theme.background.default,
            outlineStyle: 'solid',
            outlineWidth: '1px',
            outlineColor: theme.background.default,
        },
        stripedStyle: {
            color: theme.striped.text,
            backgroundColor: theme.striped.default,
        },
    },
    expanderRow: {
        style: {
            color: theme.text.primary,
            backgroundColor: theme.background.default,
        },
    },
    expanderCell: {
        style: {
            flex: '0 0 48px',
        },
    },
    expanderButton: {
        style: {
            color: theme.button.default,
            fill: theme.button.default,
            backgroundColor: 'transparent',
            borderRadius: '2px',
            transition: '0.25s',
            height: '100%',
            width: '100%',
            '&:hover:enabled': {
                cursor: 'pointer',
            },
            '&:disabled': {
                color: theme.button.disabled,
            },
            '&:hover:not(:disabled)': {
                cursor: 'pointer',
                backgroundColor: theme.button.hover,
            },
            '&:focus': {
                outline: 'none',
                backgroundColor: theme.button.focus,
            },
            svg: {
                margin: 'auto',
            },
        },
    },
    pagination: {
        style: {
            color: theme.text.secondary,
            fontSize: '13px',
            minHeight: '56px',
            backgroundColor: theme.background.default,
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: theme.divider.default,
        },
        pageButtonsStyle: {
            borderRadius: '50%',
            height: '40px',
            width: '40px',
            padding: '8px',
            margin: 'px',
            cursor: 'pointer',
            transition: '0.4s',
            color: theme.button.default,
            fill: theme.button.default,
            backgroundColor: 'transparent',
            '&:disabled': {
                cursor: 'unset',
                color: theme.button.disabled,
                fill: theme.button.disabled,
            },
            '&:hover:not(:disabled)': {
                backgroundColor: theme.button.hover,
            },
            '&:focus': {
                outline: 'none',
                backgroundColor: theme.button.focus,
            },
        },
    },
    noData: {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.text.primary,
            backgroundColor: theme.background.default,
        },
    },
    progress: {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.text.primary,
            backgroundColor: theme.background.default,
        },
    },
});
const createStyles = (customStyles = {}, themeName = 'default', inherit = 'default') => {
    const themeType = defaultThemes[themeName] ? themeName : inherit;
    return cjs(defaultStyles(defaultThemes[themeType]), customStyles);
};

function useColumns(columns, onColumnOrderChange, defaultSortFieldId, defaultSortAsc) {
    const [tableColumns, setTableColumns] = React__namespace.useState(() => decorateColumns(columns));
    const [draggingColumnId, setDraggingColumn] = React__namespace.useState('');
    const sourceColumnId = React__namespace.useRef('');
    useFirstUpdate(() => {
        setTableColumns(decorateColumns(columns));
    }, [columns]);
    const handleDragStart = React__namespace.useCallback((e) => {
        var _a, _b, _c;
        const { attributes } = e.target;
        const id = (_a = attributes.getNamedItem('data-column-id')) === null || _a === void 0 ? void 0 : _a.value;
        if (id) {
            sourceColumnId.current = ((_c = (_b = tableColumns[findColumnIndexById(tableColumns, id)]) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()) || '';
            setDraggingColumn(sourceColumnId.current);
        }
    }, [tableColumns]);
    const handleDragEnter = React__namespace.useCallback((e) => {
        var _a;
        const { attributes } = e.target;
        const id = (_a = attributes.getNamedItem('data-column-id')) === null || _a === void 0 ? void 0 : _a.value;
        if (id && sourceColumnId.current && id !== sourceColumnId.current) {
            const selectedColIndex = findColumnIndexById(tableColumns, sourceColumnId.current);
            const targetColIndex = findColumnIndexById(tableColumns, id);
            const reorderedCols = [...tableColumns];
            reorderedCols[selectedColIndex] = tableColumns[targetColIndex];
            reorderedCols[targetColIndex] = tableColumns[selectedColIndex];
            setTableColumns(reorderedCols);
            onColumnOrderChange(reorderedCols);
        }
    }, [onColumnOrderChange, tableColumns]);
    const handleDragOver = React__namespace.useCallback((e) => {
        e.preventDefault();
    }, []);
    const handleDragLeave = React__namespace.useCallback((e) => {
        e.preventDefault();
    }, []);
    const handleDragEnd = React__namespace.useCallback((e) => {
        e.preventDefault();
        sourceColumnId.current = '';
        setDraggingColumn('');
    }, []);
    const defaultSortDirection = getSortDirection(defaultSortAsc);
    const defaultSortColumn = React__namespace.useMemo(() => tableColumns[findColumnIndexById(tableColumns, defaultSortFieldId === null || defaultSortFieldId === void 0 ? void 0 : defaultSortFieldId.toString())] || {}, [defaultSortFieldId, tableColumns]);
    return {
        tableColumns,
        draggingColumnId,
        handleDragStart,
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleDragEnd,
        defaultSortDirection,
        defaultSortColumn,
    };
}

function DataTable(props) {
    const { data = defaultProps.data, columns = defaultProps.columns, title = defaultProps.title, actions = defaultProps.actions, keyField = defaultProps.keyField, striped = defaultProps.striped, highlightOnHover = defaultProps.highlightOnHover, pointerOnHover = defaultProps.pointerOnHover, dense = defaultProps.dense, selectableRows = defaultProps.selectableRows, selectableRowsSingle = defaultProps.selectableRowsSingle, selectableRowsHighlight = defaultProps.selectableRowsHighlight, selectableRowsNoSelectAll = defaultProps.selectableRowsNoSelectAll, selectableRowsVisibleOnly = defaultProps.selectableRowsVisibleOnly, selectableRowSelected = defaultProps.selectableRowSelected, selectableRowDisabled = defaultProps.selectableRowDisabled, selectableRowsComponent = defaultProps.selectableRowsComponent, selectableRowsComponentProps = defaultProps.selectableRowsComponentProps, onRowExpandToggled = defaultProps.onRowExpandToggled, expandableCloseAllOnExpand = defaultProps.expandableCloseAllOnExpand, onSelectedRowsChange = defaultProps.onSelectedRowsChange, expandableIcon = defaultProps.expandableIcon, onChangeRowsPerPage = defaultProps.onChangeRowsPerPage, onChangePage = defaultProps.onChangePage, paginationServer = defaultProps.paginationServer, paginationServerOptions = defaultProps.paginationServerOptions, paginationTotalRows = defaultProps.paginationTotalRows, paginationDefaultPage = defaultProps.paginationDefaultPage, paginationResetDefaultPage = defaultProps.paginationResetDefaultPage, paginationPerPage = defaultProps.paginationPerPage, paginationRowsPerPageOptions = defaultProps.paginationRowsPerPageOptions, paginationIconLastPage = defaultProps.paginationIconLastPage, paginationIconFirstPage = defaultProps.paginationIconFirstPage, paginationIconNext = defaultProps.paginationIconNext, paginationIconPrevious = defaultProps.paginationIconPrevious, paginationComponent = defaultProps.paginationComponent, paginationComponentOptions = defaultProps.paginationComponentOptions, responsive = defaultProps.responsive, progressPending = defaultProps.progressPending, progressComponent = defaultProps.progressComponent, persistTableHead = defaultProps.persistTableHead, noDataComponent = defaultProps.noDataComponent, disabled = defaultProps.disabled, noTableHead = defaultProps.noTableHead, noHeader = defaultProps.noHeader, fixedHeader = defaultProps.fixedHeader, fixedHeaderScrollHeight = defaultProps.fixedHeaderScrollHeight, pagination = defaultProps.pagination, subHeader = defaultProps.subHeader, subHeaderAlign = defaultProps.subHeaderAlign, subHeaderWrap = defaultProps.subHeaderWrap, subHeaderComponent = defaultProps.subHeaderComponent, noContextMenu = defaultProps.noContextMenu, contextMessage = defaultProps.contextMessage, contextActions = defaultProps.contextActions, contextComponent = defaultProps.contextComponent, expandableRows = defaultProps.expandableRows, onRowClicked = defaultProps.onRowClicked, onRowDoubleClicked = defaultProps.onRowDoubleClicked, onRowMouseEnter = defaultProps.onRowMouseEnter, onRowMouseLeave = defaultProps.onRowMouseLeave, sortIcon = defaultProps.sortIcon, onSort = defaultProps.onSort, sortFunction = defaultProps.sortFunction, sortServer = defaultProps.sortServer, expandableRowsComponent = defaultProps.expandableRowsComponent, expandableRowsComponentProps = defaultProps.expandableRowsComponentProps, expandableRowDisabled = defaultProps.expandableRowDisabled, expandableRowsHideExpander = defaultProps.expandableRowsHideExpander, expandOnRowClicked = defaultProps.expandOnRowClicked, expandOnRowDoubleClicked = defaultProps.expandOnRowDoubleClicked, expandableRowExpanded = defaultProps.expandableRowExpanded, expandableInheritConditionalStyles = defaultProps.expandableInheritConditionalStyles, defaultSortFieldId = defaultProps.defaultSortFieldId, defaultSortAsc = defaultProps.defaultSortAsc, clearSelectedRows = defaultProps.clearSelectedRows, conditionalRowStyles = defaultProps.conditionalRowStyles, theme = defaultProps.theme, customStyles = defaultProps.customStyles, direction = defaultProps.direction, onColumnOrderChange = defaultProps.onColumnOrderChange, className, } = props;
    const { tableColumns, draggingColumnId, handleDragStart, handleDragEnter, handleDragOver, handleDragLeave, handleDragEnd, defaultSortDirection, defaultSortColumn, } = useColumns(columns, onColumnOrderChange, defaultSortFieldId, defaultSortAsc);
    const [CurrentExpandedRow, SetCurrentExpandedRow] = React__namespace.useState(null);
    const [{ rowsPerPage, currentPage, selectedRows, allSelected, selectedCount, selectedColumn, sortDirection, toggleOnSelectedRowsChange, }, dispatch,] = React__namespace.useReducer(tableReducer, {
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
    const currentTheme = React__namespace.useMemo(() => createStyles(customStyles, theme), [customStyles, theme]);
    const wrapperProps = React__namespace.useMemo(() => (Object.assign({}, (direction !== 'auto' && { dir: direction }))), [direction]);
    const sortedData = React__namespace.useMemo(() => {
        if (sortServer) {
            return data;
        }
        if ((selectedColumn === null || selectedColumn === void 0 ? void 0 : selectedColumn.sortFunction) && typeof selectedColumn.sortFunction === 'function') {
            const sortFn = selectedColumn.sortFunction;
            const customSortFunction = sortDirection === SortOrder.ASC ? sortFn : (a, b) => sortFn(a, b) * -1;
            return [...data].sort(customSortFunction);
        }
        return sort(data, selectedColumn === null || selectedColumn === void 0 ? void 0 : selectedColumn.selector, sortDirection, sortFunction);
    }, [`sortServer`, selectedColumn, sortDirection, data, sortFunction]);
    const tableRows = React__namespace.useMemo(() => {
        sortedData.map((a) => {
            if (expandableCloseAllOnExpand) {
                if (CurrentExpandedRow && CurrentExpandedRow['id'] == a['id']) {
                    a['expandFlag'] = true;
                }
                else {
                    a['expandFlag'] = false;
                }
            }
            else {
                if (a.defaultExpanded || a['expandFlag']) {
                    a['expandFlag'] = true;
                }
                else {
                    a['expandFlag'] = false;
                }
            }
        });
        if (pagination && !paginationServer) {
            const lastIndex = currentPage * rowsPerPage;
            const firstIndex = lastIndex - rowsPerPage;
            return sortedData.slice(firstIndex, lastIndex);
        }
        return sortedData;
    }, [currentPage, pagination, paginationServer, rowsPerPage, sortedData, CurrentExpandedRow]);
    const handleSort = React__namespace.useCallback((action) => {
        dispatch(action);
    }, []);
    const handleSelectAllRows = React__namespace.useCallback((action) => {
        dispatch(action);
    }, []);
    const handleSelectedRow = React__namespace.useCallback((action) => {
        dispatch(action);
    }, []);
    const handleRowClicked = React__namespace.useCallback((row, e) => onRowClicked(row, e), [onRowClicked]);
    const handleRowDoubleClicked = React__namespace.useCallback((row, e) => onRowDoubleClicked(row, e), [onRowDoubleClicked]);
    const handleRowMouseEnter = React__namespace.useCallback((row, e) => onRowMouseEnter(row, e), [onRowMouseEnter]);
    const handleRowMouseLeave = React__namespace.useCallback((row, e) => onRowMouseLeave(row, e), [onRowMouseLeave]);
    const handleChangePage = React__namespace.useCallback((page) => dispatch({
        type: 'CHANGE_PAGE',
        page,
        paginationServer,
        visibleOnly: selectableRowsVisibleOnly,
        persistSelectedOnPageChange,
    }), [paginationServer, persistSelectedOnPageChange, selectableRowsVisibleOnly]);
    const handleChangeRowsPerPage = React__namespace.useCallback((newRowsPerPage) => {
        const rowCount = paginationTotalRows || tableRows.length;
        const updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
        const recalculatedPage = recalculatePage(currentPage, updatedPage);
        if (!paginationServer) {
            handleChangePage(recalculatedPage);
        }
        dispatch({ type: 'CHANGE_ROWS_PER_PAGE', page: recalculatedPage, rowsPerPage: newRowsPerPage });
    }, [currentPage, handleChangePage, paginationServer, paginationTotalRows, tableRows.length]);
    const handleRowExpandToggled = React__namespace.useCallback((expanded, row) => {
        onRowExpandToggled(expanded, row);
        SetCurrentExpandedRow(row);
    }, [onRowExpandToggled]);
    const showTableHead = () => {
        if (noTableHead)
            return false;
        if (persistTableHead)
            return true;
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
    if (pagination && !paginationServer && sortedData.length > 0 && tableRows.length === 0) {
        const updatedPage = getNumberOfPages(sortedData.length, rowsPerPage);
        const recalculatedPage = recalculatePage(currentPage, updatedPage);
        handleChangePage(recalculatedPage);
    }
    useFirstUpdate(() => {
        onSelectedRowsChange({ allSelected, selectedCount, selectedRows: selectedRows.slice(0) });
    }, [toggleOnSelectedRowsChange]);
    useFirstUpdate(() => {
        onSort(selectedColumn, sortDirection, sortedData.slice(0));
    }, [selectedColumn, sortDirection]);
    useFirstUpdate(() => {
        onChangePage(currentPage, paginationTotalRows || sortedData.length);
    }, [currentPage]);
    useFirstUpdate(() => {
        onChangeRowsPerPage(rowsPerPage, currentPage);
    }, [rowsPerPage]);
    useFirstUpdate(() => {
        handleChangePage(paginationDefaultPage);
    }, [paginationDefaultPage, paginationResetDefaultPage]);
    useFirstUpdate(() => {
        if (pagination && paginationServer && paginationTotalRows > 0) {
            const updatedPage = getNumberOfPages(paginationTotalRows, rowsPerPage);
            const recalculatedPage = recalculatePage(currentPage, updatedPage);
            if (currentPage !== recalculatedPage) {
                handleChangePage(recalculatedPage);
            }
        }
    }, [paginationTotalRows]);
    React__namespace.useEffect(() => {
        dispatch({ type: 'CLEAR_SELECTED_ROWS', selectedRowsFlag: clearSelectedRows });
    }, [selectableRowsSingle, clearSelectedRows]);
    React__namespace.useEffect(() => {
        if (!selectableRowSelected) {
            return;
        }
        const preSelectedRows = sortedData.filter(row => selectableRowSelected(row));
        const selected = selectableRowsSingle ? preSelectedRows.slice(0, 1) : preSelectedRows;
        dispatch({
            type: 'SELECT_MULTIPLE_ROWS',
            keyField,
            selectedRows: selected,
            totalRows: sortedData.length,
            mergeSelections,
        });
    }, [data, selectableRowSelected]);
    const visibleRows = selectableRowsVisibleOnly ? tableRows : sortedData;
    const showSelectAll = persistSelectedOnPageChange || selectableRowsSingle || selectableRowsNoSelectAll;
    return (React__namespace.createElement(styled.ThemeProvider, { theme: currentTheme },
        showHeader() && (React__namespace.createElement(Header, { title: title, actions: actions, showMenu: !noContextMenu, selectedCount: selectedCount, direction: direction, contextActions: contextActions, contextComponent: contextComponent, contextMessage: contextMessage })),
        subHeader && (React__namespace.createElement(Subheader, { align: subHeaderAlign, wrapContent: subHeaderWrap }, subHeaderComponent)),
        React__namespace.createElement(ResponsiveWrapper, Object.assign({ responsive: responsive, fixedHeader: fixedHeader, fixedHeaderScrollHeight: fixedHeaderScrollHeight, className: className }, wrapperProps),
            React__namespace.createElement(Wrapper, null,
                progressPending && !persistTableHead && React__namespace.createElement(ProgressWrapper, null, progressComponent),
                React__namespace.createElement(TableStyle, { disabled: disabled, className: "rdt_Table", role: "table" },
                    showTableHead() && (React__namespace.createElement(Head, { className: "rdt_TableHead", role: "rowgroup", fixedHeader: fixedHeader },
                        React__namespace.createElement(HeadRow, { className: "rdt_TableHeadRow", role: "row", dense: dense },
                            selectableRows &&
                                (showSelectAll ? (React__namespace.createElement(CellBase, { style: { flex: '0 0 48px' } })) : (React__namespace.createElement(ColumnCheckbox, { allSelected: allSelected, selectedRows: selectedRows, selectableRowsComponent: selectableRowsComponent, selectableRowsComponentProps: selectableRowsComponentProps, selectableRowDisabled: selectableRowDisabled, rowData: visibleRows, keyField: keyField, mergeSelections: mergeSelections, onSelectAllRows: handleSelectAllRows }))),
                            expandableRows && !expandableRowsHideExpander && React__namespace.createElement(ColumnExpander, null),
                            tableColumns.map(column => {
                                const Component = column.component ? column.component : Column;
                                return (React__namespace.createElement(Component, { key: column.id, column: column, selectedColumn: selectedColumn, disabled: progressPending || sortedData.length === 0, pagination: pagination, paginationServer: paginationServer, persistSelectedOnSort: persistSelectedOnSort, selectableRowsVisibleOnly: selectableRowsVisibleOnly, sortDirection: sortDirection, sortIcon: sortIcon, sortServer: sortServer, onSort: handleSort, onDragStart: handleDragStart, onDragOver: handleDragOver, onDragEnd: handleDragEnd, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, draggingColumnId: draggingColumnId }));
                            })))),
                    !sortedData.length && !progressPending && React__namespace.createElement(NoDataWrapper, null, noDataComponent),
                    progressPending && persistTableHead && React__namespace.createElement(ProgressWrapper, null, progressComponent),
                    !progressPending && sortedData.length > 0 && (React__namespace.createElement(Body, { className: "rdt_TableBody", role: "rowgroup" }, tableRows.map((row, i) => {
                        const key = prop(row, keyField);
                        const id = isEmpty(key) ? i : key;
                        const selected = isRowSelected(row, selectedRows, keyField);
                        const expanderExpander = !!(expandableRows && expandableRowExpanded && expandableRowExpanded(row));
                        const expanderDisabled = !!(expandableRows && expandableRowDisabled && expandableRowDisabled(row));
                        return (React__namespace.createElement(Row, { id: id, key: id, keyField: keyField, "data-row-id": id, columns: tableColumns, row: row, rowCount: sortedData.length, rowIndex: i, selectableRows: selectableRows, expandableRows: expandableRows, expandableIcon: expandableIcon, highlightOnHover: highlightOnHover, pointerOnHover: pointerOnHover, dense: dense, expandOnRowClicked: expandOnRowClicked, expandOnRowDoubleClicked: expandOnRowDoubleClicked, expandableRowsComponent: expandableRowsComponent, expandableRowsComponentProps: expandableRowsComponentProps, expandableRowsHideExpander: expandableRowsHideExpander, defaultExpanderDisabled: expanderDisabled, defaultExpanded: expanderExpander, expandableInheritConditionalStyles: expandableInheritConditionalStyles, conditionalRowStyles: conditionalRowStyles, selected: selected, selectableRowsHighlight: selectableRowsHighlight, selectableRowsComponent: selectableRowsComponent, selectableRowsComponentProps: selectableRowsComponentProps, selectableRowDisabled: selectableRowDisabled, selectableRowsSingle: selectableRowsSingle, striped: striped, onRowExpandToggled: handleRowExpandToggled, expandableCloseAllOnExpand: expandableCloseAllOnExpand, expandableRowFlag: row['expandFlag'], onRowClicked: handleRowClicked, onRowDoubleClicked: handleRowDoubleClicked, onRowMouseEnter: handleRowMouseEnter, onRowMouseLeave: handleRowMouseLeave, onSelectedRow: handleSelectedRow, draggingColumnId: draggingColumnId, onDragStart: handleDragStart, onDragOver: handleDragOver, onDragEnd: handleDragEnd, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave }));
                    })))))),
        enabledPagination && (React__namespace.createElement("div", null,
            React__namespace.createElement(Pagination, { onChangePage: handleChangePage, onChangeRowsPerPage: handleChangeRowsPerPage, rowCount: paginationTotalRows || sortedData.length, currentPage: currentPage, rowsPerPage: rowsPerPage, direction: direction, paginationRowsPerPageOptions: paginationRowsPerPageOptions, paginationIconLastPage: paginationIconLastPage, paginationIconFirstPage: paginationIconFirstPage, paginationIconNext: paginationIconNext, paginationIconPrevious: paginationIconPrevious, paginationComponentOptions: paginationComponentOptions })))));
}
var DataTable$1 = React__namespace.memo(DataTable);

exports.STOP_PROP_TAG = STOP_PROP_TAG;
exports.createTheme = createTheme;
exports["default"] = DataTable$1;
exports.defaultThemes = defaultThemes;
//# sourceMappingURL=react-data-table-component.dev.js.map
