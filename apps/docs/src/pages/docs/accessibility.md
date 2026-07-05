---
layout: '../../layouts/DocsLayout.astro'
title: 'Accessibility | react-data-table-component'
description: 'ARIA roles, keyboard navigation, and screen reader support in react-data-table-component.'
---


# Accessibility

`react-data-table-component` documents the ARIA semantics, keyboard interactions, and known considerations for each interactive region.

---

## Labelling the table

Always provide `ariaLabel` so screen readers can identify `DataTable`. Without it, assistive technology announces a generic "table" with no context.

```tsx
<DataTable
  ariaLabel="Employee directory"
  columns={columns}
  data={data}
/>
```

---

## Table structure

`react-data-table-component` renders `div` elements with explicit ARIA roles, giving screen readers a full table structure.

| Element | Role / attribute |
| --- | --- |
| Table wrapper | `role="table"` (or `role="grid"` with `cellNavigation` — see below), `aria-label` (from `ariaLabel` prop), `aria-busy` during load |
| Header section | `role="rowgroup"` |
| Body section | `role="rowgroup"` |
| Header row | `role="row"` |
| Data row | `role="row"`, `aria-selected` (when `selectableRows` is enabled) |
| Data cell | `role="cell"` (or `role="gridcell"` with `cellNavigation`) |
| Column header | `role="columnheader"` |

By default this is a **static table**: nothing but sortable headers is focusable, which is the right shape for a screen reader's native table-reading commands. Passing `cellNavigation` turns it into an interactive **grid** (WAI-ARIA grid pattern) instead — every cell becomes focusable via a single roving tab stop, and arrow keys move between them. See [Keyboard navigation](/docs/keyboard-navigation) for the full key reference and the reasoning for making this opt-in rather than the default.

---

## Sorting

Sortable column headers expose `aria-sort` so screen readers announce the current direction.

| State | `aria-sort` value |
| --- | --- |
| Not sorted | `"none"` |
| Sorted A → Z / low → high | `"ascending"` |
| Sorted Z → A / high → low | `"descending"` |
| Column not sortable | attribute omitted |

**Keyboard**: sortable headers receive `tabIndex={0}`. Press **Enter** or **Space** to toggle the sort direction. Non-sortable headers are removed from the tab order. Keyboard focus is indicated with a visible `:focus-visible` outline in the theme's primary color. With `cellNavigation` enabled, header cells instead participate in the grid's roving tabindex — see [Keyboard navigation](/docs/keyboard-navigation).

---

## Row selection

When `selectableRows` is enabled:

- Each data row carries `aria-selected={true|false}` so screen readers announce selection state.
- The select-all checkbox in the header has `aria-label="Select all rows"`.
- Per-row checkboxes have `aria-label="Select row {id}"` where `{id}` is the row's key field value.
- The indeterminate state (some-but-not-all rows selected) is set via the native `indeterminate` DOM property, which screen readers announce correctly.
- With `cellNavigation` enabled, checkboxes are reachable by arrowing to their column and are toggled with **Space**. See [Keyboard navigation](/docs/keyboard-navigation).

---

## Column filters

Each filterable column header contains a filter toggle button. The popup is a `role="dialog"`.

### Filter toggle button

| Attribute | Value |
| --- | --- |
| `aria-label` | `"Filter active"` when a filter is applied, `"Filter column"` otherwise |
| `aria-pressed` | `true` while the popup is open, `false` when closed |

### Filter panel (popup)

| Attribute | Value |
| --- | --- |
| `role` | `"dialog"` |
| `aria-label` | `"Column filter"` |

Focus moves automatically to the first focusable element (the operator `<select>`) when the panel opens.

**Keyboard interactions inside the panel:**

| Key | Action |
| --- | --- |
| **Escape** | Close the panel |
| **Tab / Shift+Tab** | Move between operator select, value inputs, and action buttons |

### Controls inside the panel

| Control | `aria-label` / attribute |
| --- | --- |
| Operator `<select>` | `aria-label="Filter operator"` |
| Primary value `<input>` | `aria-label="Filter value"` |
| Secondary value `<input>` (Between) | `aria-label="Filter second value"` |
| AND toggle button | `aria-pressed` reflects active state |
| OR toggle button | `aria-pressed` reflects active state |
| Add condition button | `aria-label="Add a second filter condition"` |
| Remove condition button | `aria-label="Remove condition"` |

---

## Expandable rows

The expand toggle is a `<button>` with `aria-label="Expand Row"` or `"Collapse Row"`. Expanded content renders inline beneath the row and is read naturally by screen readers.

**Keyboard**: press **Enter** or **Space** on the expander button to toggle. If `expandOnRowClicked` is set, pressing **Enter** on the row itself also toggles. With `cellNavigation` enabled, the expander button is reachable by arrowing to its column. See [Keyboard navigation](/docs/keyboard-navigation).

---

## Pagination

The pagination controls are wrapped in a `<nav aria-label="Table pagination">`, distinguishing them from other landmarks on the page.

| Button | `aria-label` |
| --- | --- |
| First page | `"First Page"` |
| Previous page | `"Previous Page"` |
| Next page | `"Next Page"` |
| Last page | `"Last Page"` |

Disabled buttons have both `disabled` and `aria-disabled="true"`. The rows-per-page `<select>` uses the `rowsPerPageText` option value as its `aria-label`.

---

## Loading and empty states

- While data is loading, the table wrapper carries `aria-busy="true"`. Skeleton rows are `aria-hidden="true"` so they are not read aloud.
- When a re-fetch overlays existing rows, the overlay is `aria-hidden="true"` and `aria-busy` on the wrapper communicates the busy state.
- When there is no data, the empty-state container has `role="status"` so screen readers announce the "no records" message when it appears.

---

## Resize handles

Column resize handles are `aria-hidden="true"`. They are drag-only with no keyboard equivalent.

---

## Tips for consumers

- **Always provide `ariaLabel`.** Without it, screen readers announce a generic "table".
- **Always set `id` on filterable columns.** The filter state is keyed by `column.id`; omitting it silently disables filtering.
- **Use descriptive `name` values.** Column `name` is the visible label announced for sortable headers and filter dialogs.
- **Avoid icon-only column names without labels.** If `column.name` is a React node (e.g. an icon), wrap it with an accessible label (`aria-label` or a visually-hidden `<span>`).
- **Test with a keyboard.** Tab through the header row, sort with Enter, open a filter panel with Enter or Space, navigate inputs with Tab, and close with Escape.
