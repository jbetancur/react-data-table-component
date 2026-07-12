import * as React from 'react';
import type { ComponentProps, ExpandableIcon, ExpandableRowsComponent, Localization } from '../types';

/**
 * Row expansion feature slice — `null` when `expandableRows` is off. Slice
 * identity is the memoization contract: every field must be a scalar or a
 * ref-stable object/callback (DataTable memoizes `icon` and `localization`).
 */
export type ExpansionSlice<T> = {
	icon: ExpandableIcon;
	component: ExpandableRowsComponent<T> | undefined;
	componentProps: ComponentProps | undefined;
	hideExpander: boolean;
	expandOnRowClicked: boolean;
	expandOnRowDoubleClicked: boolean;
	inheritConditionalStyles: boolean;
	onToggled: (expanded: boolean, row: T) => void;
	localization: NonNullable<Localization['expandable']>;
} | null;

type UseExpansionOptions<T> = {
	expandableRows: boolean;
	icon: ExpandableIcon;
	component: ExpandableRowsComponent<T> | undefined;
	componentProps: ComponentProps | undefined;
	hideExpander: boolean;
	expandOnRowClicked: boolean;
	expandOnRowDoubleClicked: boolean;
	inheritConditionalStyles: boolean;
	onToggled: (expanded: boolean, row: T) => void;
	localization: NonNullable<Localization['expandable']>;
};

export default function useExpansion<T>(options: UseExpansionOptions<T>): ExpansionSlice<T> {
	const {
		expandableRows,
		icon,
		component,
		componentProps,
		hideExpander,
		expandOnRowClicked,
		expandOnRowDoubleClicked,
		inheritConditionalStyles,
		onToggled,
		localization,
	} = options;
	return React.useMemo(
		() =>
			expandableRows
				? {
						icon,
						component,
						componentProps,
						hideExpander,
						expandOnRowClicked,
						expandOnRowDoubleClicked,
						inheritConditionalStyles,
						onToggled,
						localization,
					}
				: null,
		[
			expandableRows,
			icon,
			component,
			componentProps,
			hideExpander,
			expandOnRowClicked,
			expandOnRowDoubleClicked,
			inheritConditionalStyles,
			onToggled,
			localization,
		],
	);
}
