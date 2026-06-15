# Changelog

A summary of notable changes per release. For the full commit history see the [repository on GitHub](https://github.com/jbetancur/react-data-table-component/commits/master).

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
