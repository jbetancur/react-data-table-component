import * as React from 'react';

/**
 * A flexible spacer injected immediately before the first right-pinned column.
 * In a flex row this absorbs leftover horizontal space so unpinned columns
 * fill out and right-pinned columns hug the right edge — without requiring
 * the row itself to know about pinning state.
 *
 * `flex: 1 1 auto` lets the spacer grow to fill the gap; `min-width: 0`
 * prevents it from blowing out narrow viewports.
 */
export default function RightPinSpacer(): JSX.Element {
	return <div aria-hidden="true" className="rdt_rightPinSpacer" style={{ flex: '1 1 auto', minWidth: 0 }} />;
}
