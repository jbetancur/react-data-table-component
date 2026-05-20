import type { Localization } from '../types';

const uk: Localization = {
	pagination: {
		navigationAriaLabel: 'Навігація по сторінках таблиці',
		firstPageAriaLabel: 'Перша сторінка',
		previousPageAriaLabel: 'Попередня сторінка',
		nextPageAriaLabel: 'Наступна сторінка',
		lastPageAriaLabel: 'Остання сторінка',
	},
	filter: {
		filterColumnAriaLabel: 'Фільтр стовпця',
		filterActiveAriaLabel: 'Фільтр активний',
		filterPanelAriaLabel: 'Панель фільтрів',
		operatorAriaLabel: 'Оператор фільтра',
		valuePlaceholder: 'Значення',
		valueAriaLabel: 'Значення фільтра',
		value2Placeholder: 'Значення',
		value2AriaLabel: 'Друге значення фільтра',
		betweenSeparatorText: 'і',
		removeConditionAriaLabel: 'Видалити умову',
		addConditionAriaLabel: 'Додати другу умову',
		addConditionLabel: '+ Додати умову',
		clearLabel: 'Очистити',
		applyLabel: 'Застосувати',
		andLabel: 'І',
		orLabel: 'АБО',
		operators: {
			contains: 'Містить',
			notContains: 'Не містить',
			equals: 'Дорівнює',
			notEquals: 'Не дорівнює',
			startsWith: 'Починається з',
			endsWith: 'Закінчується на',
			blank: 'Порожньо',
			notBlank: 'Не порожньо',
			gt: 'Більше ніж',
			gte: 'Більше або дорівнює',
			lt: 'Менше ніж',
			lte: 'Менше або дорівнює',
			between: 'Між',
			before: 'До',
			after: 'Після',
		},
	},
	expandable: {
		expandRowAriaLabel: 'Розгорнути рядок',
		collapseRowAriaLabel: 'Згорнути рядок',
	},
};

export default uk;
