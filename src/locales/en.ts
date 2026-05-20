import type { Localization } from '../types';

const en: Localization = {
	pagination: {
		navigationAriaLabel: 'Table pagination',
		firstPageAriaLabel: 'First Page',
		previousPageAriaLabel: 'Previous Page',
		nextPageAriaLabel: 'Next Page',
		lastPageAriaLabel: 'Last Page',
	},
	filter: {
		filterColumnAriaLabel: 'Filter column',
		filterActiveAriaLabel: 'Filter active',
		filterPanelAriaLabel: 'Column filter',
		operatorAriaLabel: 'Filter operator',
		valuePlaceholder: 'Value',
		valueAriaLabel: 'Filter value',
		value2Placeholder: 'Value',
		value2AriaLabel: 'Filter second value',
		betweenSeparatorText: 'and',
		removeConditionAriaLabel: 'Remove condition',
		addConditionAriaLabel: 'Add a second filter condition',
		addConditionLabel: '+ Add condition',
		clearLabel: 'Clear',
		applyLabel: 'Apply',
		andLabel: 'AND',
		orLabel: 'OR',
		operators: {
			contains: 'Contains',
			notContains: 'Does not contain',
			equals: 'Equals',
			notEquals: 'Does not equal',
			startsWith: 'Begins with',
			endsWith: 'Ends with',
			blank: 'Blank',
			notBlank: 'Not blank',
			gt: 'Greater than',
			gte: 'Greater than or equal',
			lt: 'Less than',
			lte: 'Less than or equal',
			between: 'Between',
			before: 'Before',
			after: 'After',
		},
	},
	expandable: {
		expandRowAriaLabel: 'Expand Row',
		collapseRowAriaLabel: 'Collapse Row',
	},
};

export default en;
