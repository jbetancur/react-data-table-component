import type { Localization } from '../types';

const fr: Localization = {
	pagination: {
		navigationAriaLabel: 'Pagination du tableau',
		firstPageAriaLabel: 'Première page',
		previousPageAriaLabel: 'Page précédente',
		nextPageAriaLabel: 'Page suivante',
		lastPageAriaLabel: 'Dernière page',
	},
	filter: {
		filterColumnAriaLabel: 'Filtrer la colonne',
		filterActiveAriaLabel: 'Filtre actif',
		filterPanelAriaLabel: 'Panneau de filtre',
		operatorAriaLabel: 'Opérateur de filtre',
		valuePlaceholder: 'Valeur',
		valueAriaLabel: 'Valeur du filtre',
		value2Placeholder: 'Valeur',
		value2AriaLabel: 'Deuxième valeur du filtre',
		betweenSeparatorText: 'et',
		removeConditionAriaLabel: 'Supprimer la condition',
		addConditionAriaLabel: 'Ajouter une deuxième condition',
		addConditionLabel: '+ Ajouter une condition',
		clearLabel: 'Effacer',
		applyLabel: 'Appliquer',
		andLabel: 'ET',
		orLabel: 'OU',
		operators: {
			contains: 'Contient',
			notContains: 'Ne contient pas',
			equals: 'Égal à',
			notEquals: 'Différent de',
			startsWith: 'Commence par',
			endsWith: 'Se termine par',
			blank: 'Vide',
			notBlank: 'Non vide',
			gt: 'Supérieur à',
			gte: 'Supérieur ou égal à',
			lt: 'Inférieur à',
			lte: 'Inférieur ou égal à',
			between: 'Entre',
			before: 'Avant',
			after: 'Après',
		},
	},
	expandable: {
		expandRowAriaLabel: 'Développer la ligne',
		collapseRowAriaLabel: 'Réduire la ligne',
	},
};

export default fr;
