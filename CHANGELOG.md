# Changelog

A summary of notable changes per release. For the full commit history see the [repository on GitHub](https://github.com/jbetancur/react-data-table-component/commits/master).

## 8.7.1

### Bug fixes

- Faster cell rendering on large tables: non-editable cells now skip editing state entirely and share hoisted style objects, and rows inside a fixed-header scroll container use `content-visibility: auto` so off-screen rows skip layout and paint. → [Performance](/docs/performance) ([#1360](https://github.com/jbetancur/react-data-table-component/pull/1360))
- Applying a column filter that matched no rows hid the table head along with the rows, leaving no way to clear the filter. The head now stays visible while any column filter is active. → [Filtering](/docs/filtering) ([#1359](https://github.com/jbetancur/react-data-table-component/issues/1359))
- A column filter with only its second condition filled was silently ignored; it now applies on its own, and an empty first condition no longer force-matches every row under OR logic. → [Filtering](/docs/filtering)
- A `between` filter with one empty bound filtered out every row; the empty side is now unbounded (lower-only acts as ≥, upper-only as ≤) for both number and date columns. → [Filtering](/docs/filtering)
- Hiding a column via the context menu now clears that column's active filter, which otherwise kept filtering rows with no visible way to clear it. → [Context menu](/docs/context-menu)
- Pressing Escape while typing in a filter input now closes the filter panel, and closing via Escape, Apply, or Clear returns focus to the filter icon. → [Filtering](/docs/filtering)

---

## 8.7.0

### New features

- **`ctx.error` for custom editors** — the custom editor render context now includes the current validation error (`string | null`), so custom editors can style their own invalid state when `validate` rejects a commit. → [Inline editing](/docs/inline-editing) ([#1355](https://github.com/jbetancur/react-data-table-component/issues/1355))
- **`ctx.inputRef` for custom editors** — attach it as the `ref` of your focusable element to get auto-focus when the editor opens and refocus after a rejected commit, matching the built-in editors. → [Inline editing](/docs/inline-editing) ([#1355](https://github.com/jbetancur/react-data-table-component/issues/1355))

---

## 8.6.2

### Bug fixes

- A numeric pixel value for `TableColumn.hide` (e.g. `hide: 480`) was a no-op — the column stayed visible at every width. Numeric breakpoints stopped working in the v8 refactor; the type now accepts only `Media` (`'sm' | 'md' | 'lg'`) to match. For a custom breakpoint, track viewport width yourself and toggle the column's `omit` prop instead. → [Mobile](/docs/mobile) ([#1346](https://github.com/jbetancur/react-data-table-component/issues/1346))
- Fixed `highlightOnHover` not showing when a row's background color was set via `customStyles.rows.style`, since the inline style was winning over the hover class. → [Styling](/docs/custom-styles) ([#1351](https://github.com/jbetancur/react-data-table-component/pull/1351))

---

## 8.6.1

### Bug fixes

- A custom `progressComponent` could not be shown on the initial load — the skeleton rows always won. New `progressSkeleton` prop (default `true`) lets you set it to `false` to show your `progressComponent` on initial load instead. → [Loading state](/docs/loading)

---

## 8.6.0

### New features

- **Context menu** — new `contextMenu` prop adds a menu to header cells and rows, opened by right-click, a kebab (⋮) button, or both. The header menu ships built-in actions (sort ascending/descending, clear sort, pin left/right, unpin, hide column, reset); row menus render consumer-supplied actions via `contextMenuActions.row`, and every selection fires `onContextMenuAction`. Fully keyboard-accessible (`role="menu"`, arrow keys, Escape with focus return), RTL-aware, and localizable via `localization.contextMenu` (all bundled locales translated). → [Context menu](/docs/context-menu) ([#1342](https://github.com/jbetancur/react-data-table-component/issues/1342))
- **bigint and Date selectors** — `Primitive` now includes `bigint` and `Date`, so selectors can return them directly for display and built-in sorting. `bigint` renders as its decimal string and `Date` as a locale string. → [Columns](/docs/api)

### Bug fixes

- Selectors that return `null` or `undefined` (e.g. a missing field) now sort to the end in both directions instead of landing in an arbitrary position. → [Sorting](/docs/sorting)
- Pagination now sizes its layout from its own container instead of the window, fixing squeezed/overlapping controls in narrow containers and mobile viewports. → [Pagination](/docs/pagination)
- Fixed a pagination SSR hydration mismatch that made React re-render the table client-side on wide viewports.
- Skeleton loading rows now stretch to the full table width instead of fixed cell widths. → [Loading state](/docs/loading)
- Widened the column resize handle and fixed the neighboring header cell stealing half its grab area; the hover indicator is now centered on the column separator, including under RTL. → [Resizable columns](/docs/resizable)

## 8.5.2

### Bug fixes

- Column resize and reorder (including column groups) now work on touch devices. Resize handles respond to touch drags; reorder uses a short press-and-hold to grab a header so a normal swipe still scrolls the table. → [Column reordering](/docs/column-reorder)

- Fixed the native sort icon animating (fading and spinning) as it disappeared when a column returned to the unsorted state; it now clears immediately. → [Sorting](/docs/sorting)
- Fixed column filter menus on touch devices: the menu no longer flickers open/closed when tapping the filter icon, and filter icons on the leftmost/rightmost columns now open reliably with the panel clamped on-screen. → [Filtering](/docs/filtering)

---

## 8.5.1

### Bug fixes

- Fixed RTL support across resizing, pinning, and separators: resize handles sit on the correct edge and widen as in LTR, pinned columns stick to logical edges with mirrored shadows, the pinned horizontal scrollbar accounts for RTL scroll coordinates, and column/group-header separators plus small chrome (filter dot, select arrows, pagination chevron) mirror correctly. Applies to `direction={Direction.RTL}` and inherited `dir="rtl"`. → [RTL support](/docs/rtl)
- Fixed row and table backgrounds cutting off at the initial container width when the table scrolls horizontally, leaving scrolled-into columns unpainted. → [Theming](/docs/theming)
- Fixed `fixedHeader` with `responsive={false}` not creating a scroll container, letting rows spill over content below the table. `fixedHeader` now always creates one.
- Fixed the pinned-columns scrollbar failing to appear or going stale when content width changed without a container resize (async rows, resizing or toggling columns), and when columns were pinned with `responsive={false}`. → [Column pinning](/docs/column-pinning)
- Fixed resize handles being clipped for right-pinned columns and the last column, which cut their hit areas down to a sliver. → [Resizable columns](/docs/resizable)
- Fixed pin-band separators: replaced the blurred edge shadow with a crisp boundary line (`--rdt-color-pin-border`, replacing `--rdt-color-pin-shadow`), and closed missing separators and broken row dividers around the right pin band. → [Column pinning](/docs/column-pinning)
- Fixed open column-filter panels floating detached from their column on scroll; they now close on scroll and window resize.

---

## 8.5.0

### New features

- **Keyboard cell navigation** — new `cellNavigation` prop turns the table into a WAI-ARIA grid (`role="grid"`/`"gridcell"`, single Tab stop, roving tabindex). Arrow keys move between cells, including the header row, selection checkboxes, and expander buttons; `Home`/`End` and `Ctrl+Home`/`Ctrl+End` jump to row and grid edges; `Enter`/`F2` open a cell's editor and `Escape` cancels it; `Enter`/`Space` sort from a header. → [Keyboard navigation](/docs/keyboard-navigation) ([#1332](https://github.com/jbetancur/react-data-table-component/pull/1332))
- **More headless hooks** — `useCellNavigation` (the same logic behind `cellNavigation`, usable on your own markup) and `useColumnResize` (drag-to-resize) are now exported. Column pinning gets three new pure-function exports — `getPinnedOffsets`, `getPinnedTotalWidths`, `getPinnedCellMeta` — since pinning has no state to own beyond `column.pinned` on your own columns. → [Headless hooks](/docs/headless)

### Bug fixes

- Fixed inline-edit refocus resolving by DOM id, which could steal focus into a different `DataTable` instance on the same page when two tables shared column ids and row keys.

---

## 8.4.3

### Bug fixes

- Fixed a table-level `sortFunction` not being called when a column's sort was cycled to the "not sorted" state, which broke patterns like pinning rows to the top regardless of sort. → [Row pinning](/docs/row-pinning)

---

## 8.4.2

### Behavior changes

- The expandable-row toggle button's hover/focus highlight is now sized to the icon instead of filling the entire cell.

### Bug fixes

- Fixed `selectableRowsComponentProps` resolving only the last entry when multiple function-valued props were passed — all function props now resolve correctly. → [Row selection](/docs/selection)

---

## 8.4.1

### Bug fixes

- Fixed a crash (`Cannot read properties of null (reading 'columnId')`) that tore down the table at the end of nearly every column resize drag under React 18. ([#1326](https://github.com/jbetancur/react-data-table-component/pull/1326))

---

## 8.4.0

### New features

- **Removable sorting** — clicking a sorted header now cycles asc → desc → unsorted, so a sort can be cleared without reloading the page. → [Sorting docs](/docs/sorting#removable-sorting)
- **Multi-column sorting** — new `sortMulti` prop. Ctrl/⌘-click headers to build a sort stack; priority follows click order and a numbered badge marks each sorted column. → [Sorting docs](/docs/sorting#multi-column-sorting) ([#1325](https://github.com/jbetancur/react-data-table-component/pulls/1325))
- `SortColumn<T>` type exported — represents a single entry in the sort stack (`{ column, sortDirection }`).
- `onSort` gains a fourth `sortColumns: SortColumn<T>[]` argument with the full sort config. Existing three-argument handlers are unaffected.

### Behavior changes

- A third click on a sorted header now removes the sort (previously it stayed on descending). Server-side `onSort` handlers should treat an empty `sortColumns` array as "no sort" and drop their `ORDER BY`.

---

## 8.3.0

### New features

- **Localization** — new `localization` prop replaces the three separate option props (`columnFilterOptions`, `expandableRowsOptions`, and pagination aria-label fields on `paginationComponentOptions`). Pass a single object to translate every string and aria-label in the table — filter panel, pagination navigation, and expand/collapse buttons. → [Localization docs](/docs/localization)
- **Built-in locales** — import pre-built translations from the `react-data-table-component/locales` subpath. Ships with: English (`en`), French (`fr`), Spanish (`es`), German (`de`), Brazilian Portuguese (`ptBR`), Arabic — Modern Standard (`ar`), Egyptian (`arEG`), Levantine (`arLV`), Hebrew (`he`), Chinese Simplified (`zhCN`), Chinese Traditional (`zhTW`), Japanese (`ja`), Korean (`ko`), Ukrainian (`uk`). Each locale is individually tree-shakeable.
- New utility exports: `emptyFilterState(type)` and `isFilterActive(filter)`. → [Filtering docs](/docs/filtering#utility-exports)
- **Removable sorting** — clicking a sortable header now cycles ascending → descending → unsorted, so a sort can be cleared directly from the header. → [Sorting docs](/docs/sorting#removable-sorting)
- **Multi-column sorting** — new `sortMulti` prop. Ctrl/⌘-click a header to add it to the existing sort; priority follows click order and a numbered badge marks each sorted column. `onSort` gains a fourth `sortColumns` argument with the full sort config, and the new `SortColumn<T>` type is exported. → [Sorting docs](/docs/sorting#multi-column-sorting)

### Behavior changes

- A third click on a sorted header now *removes* the sort (previously it stayed descending). When the sort is cleared, `onSort` fires with an empty primary column and an empty `sortColumns` array — server-side handlers should treat this as "no sort" and drop their `ORDER BY`. The existing three-argument `onSort` usage is unaffected; the fourth argument is additive.

### Deprecations

The following will continue to work in 8.x but will be removed in v9. TypeScript will show a deprecation hint.

- `columnFilterOptions` prop — use `localization` with a `filter` key instead.
- `expandableRowsOptions` prop — use `localization` with an `expandable` key instead.
- Pagination aria-label fields on `paginationComponentOptions` (`navigationAriaLabel`, `firstPageAriaLabel`, `previousPageAriaLabel`, `nextPageAriaLabel`, `lastPageAriaLabel`) — use `localization` with a `pagination` key instead.
- `ColumnFilterOptions` and `ExpandableRowsOptions` types — use `Localization['filter']` and `Localization['expandable']` instead.

---

## 8.2.0

### New features

- `paginationPosition` — controls where the pagination bar renders. Accepts `'bottom'` (default), `'top'`, or `'both'`. → [Pagination docs](/docs/pagination#pagination-position)
- `paginationPage` — controlled active-page prop. Set it to navigate programmatically (e.g. reset to page 1 after a filter change). Use with `onChangePage` to keep in sync. → [API reference](/docs/api#pagination)
- Built-in **footer row** for totals, averages, and other summary cells. Declare per-column with the new `footer` field (`ReactNode` or `(rows) => ReactNode`) or replace the whole row with `footerComponent`. Footer cells respect column widths, alignment, and pinning automatically. → [Footer docs](/docs/footer)
- **Pagination button aria-labels** — "First Page", "Previous Page", "Next Page", and "Last Page" are now configurable via `paginationComponentOptions`, enabling proper i18n for screen readers.
- `ref.clearSort()` — new `DataTableHandle` method to programmatically reset sort back to its default state, or unsorted if no defaults are set. → [Sorting docs](/docs/sorting#resetting-sort-programmatically)
- **Sortable column indicator** — sortable columns now show a faint sort icon at reduced opacity so users can discover which columns are sortable before clicking. The inactive opacity is themable via `--rdt-sort-icon-inactive-opacity` (default `0.3`).
- `onScroll` — new prop that fires whenever the table's scroll wrapper scrolls. Receives the native `React.UIEvent<HTMLDivElement>`.

### Bug fixes

- Fixed column reordering bypassing `reorder={false}` when a cell's text was selected via double-click and then dragged.

---

## 8.1.0

### New features

- Inline editing now supports `number`, `date`, `checkbox`, and `custom` editor types. New column-level `validate` hook gates the edit before `onCellEdit` fires. → [Inline editing](/docs/inline-editing)
- Shift-click range selection on row checkboxes. Enabled by default — opt out with `selectableRowsRange={false}`. New `selectedRows` prop drives controlled selection. → [Row selection](/docs/selection)
- New headless export hook `useTableExport`: build CSV/JSON, trigger a download, or copy to clipboard. → [Export](/docs/export)

### Bug fixes & polish

- Expandable row open/close animation now works correctly. Switched from a `max-height` tween to the CSS grid `grid-template-rows: 0fr → 1fr` trick. Close animation added — the row stays mounted while animating out, then unmounts. Both directions respect `animateRows` and `prefers-reduced-motion`.
- Fixed `useLayoutEffect` SSR warning in Next.js App Router and Astro SSR modes.
- Inline editing: added CSS for `checkbox` and `custom` editor types, and validation error tooltip styles (`.rdt_cellEditError`, `.rdt_editErrorTip`).

---

## v8

v8 is a full rewrite around a headless hook architecture. Every major feature is composable and usable independently of `<DataTable>`. See the [migration guide](/docs/migration) for breaking changes from v7.

### Headline features

- Column pinning (`pinned: 'left' | 'right'`) with cascading sticky offsets, custom pinned scrollbar, and full compatibility with resize/reorder/fixed-header.
- Inline cell editing (`editable` + `onCellEdit`).
- Per-column filtering with structured operators (`filterable`, `filterType`, controlled `filterValues`).
- Column groups (`columnGroups`): span labels across adjacent columns. Drag-to-reorder entire groups as a unit.
- Drag-to-reorder columns and column groups (`reorder: true`, `onColumnOrderChange`).
- Column visibility hook (`useColumnVisibility`) for show/hide pickers.
- Resizable columns (`resizable`): handle straddles the column boundary, 6 px hit area, 40 px hard floor.
- Column separators: `columnSeparator` and `headerSeparator` with `"subtle"` / `"full"` variants.
- Row animations (`animateRows`): staggered entrance + sort transitions, respects `prefers-reduced-motion`.
- Improved loading state: skeleton on first load, dimmed overlay + spinner on refetch.
- Imperative ref API: `ref.current?.clearSelectedRows()`. The `clearSelectedRows` prop is deprecated.
- New row events: `onRowMiddleClicked`, `onRowMouseEnter`, `onRowMouseLeave`.
- Dark mode support via `colorMode` ("light", "dark", "auto").
- Headless hooks exported: `useColumns`, `useTableState`, `useTableData`, `useColumnFilter`, `useColumnVisibility`.
- New theme: `crisp`. Refactored theme system around CSS variables (`createTheme`).

### Architecture changes

- Replaced styled-components with CSS variables and a single stylesheet. No more runtime CS -in-JS. Smaller bundle, faster first render.
- All visual defaults live in `DataTable.css` as `--rdt-*` custom properties.
- Row separators are drawn at the cell level (`.rdt_cellBase`) instead of the row container. Fixes a long-standing issue where the separator scrolled with content past pinned columns.
- System column width (checkbox/expander) is now controlled by `--rdt-system-col-width`. Themes can override it and pinning offsets stay aligned.

### Breaking changes from v7

- v8 ships its own CSS. No `import 'react-data-table-component/dist/index.css'` required, and styled-components overrides will not apply. Use the new theme system or `customStyles`.
- `clearSelectedRows` prop deprecated in favor of `ref.current.clearSelectedRows()`.
- Several renamed props and removed legacy options. See [migration guide](/docs/migration).

---

## v7 (legacy)

v7 is no longer actively developed. Docs remain at [v7.reactdatatable.com](https://v7.reactdatatable.com).

If you're upgrading, the [migration guide](/docs/migration) covers the breaking changes and rename mappings.
