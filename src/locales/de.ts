import type { Localization } from '../types';

const de: Localization = {
	pagination: {
		navigationAriaLabel: 'Tabellen-Paginierung',
		firstPageAriaLabel: 'Erste Seite',
		previousPageAriaLabel: 'Vorherige Seite',
		nextPageAriaLabel: 'Nächste Seite',
		lastPageAriaLabel: 'Letzte Seite',
	},
	filter: {
		filterColumnAriaLabel: 'Spalte filtern',
		filterActiveAriaLabel: 'Filter aktiv',
		filterPanelAriaLabel: 'Filterbereich',
		operatorAriaLabel: 'Filteroperator',
		valuePlaceholder: 'Wert',
		valueAriaLabel: 'Filterwert',
		value2Placeholder: 'Wert',
		value2AriaLabel: 'Zweiter Filterwert',
		betweenSeparatorText: 'und',
		removeConditionAriaLabel: 'Bedingung entfernen',
		addConditionAriaLabel: 'Zweite Bedingung hinzufügen',
		addConditionLabel: '+ Bedingung hinzufügen',
		clearLabel: 'Zurücksetzen',
		applyLabel: 'Anwenden',
		andLabel: 'UND',
		orLabel: 'ODER',
		operators: {
			contains: 'Enthält',
			notContains: 'Enthält nicht',
			equals: 'Gleich',
			notEquals: 'Ungleich',
			startsWith: 'Beginnt mit',
			endsWith: 'Endet mit',
			blank: 'Leer',
			notBlank: 'Nicht leer',
			gt: 'Größer als',
			gte: 'Größer oder gleich',
			lt: 'Kleiner als',
			lte: 'Kleiner oder gleich',
			between: 'Zwischen',
			before: 'Vor',
			after: 'Nach',
		},
	},
	expandable: {
		expandRowAriaLabel: 'Zeile aufklappen',
		collapseRowAriaLabel: 'Zeile zuklappen',
	},
};

export default de;
