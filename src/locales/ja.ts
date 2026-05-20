import type { Localization } from '../types';

const ja: Localization = {
	pagination: {
		navigationAriaLabel: 'テーブルのページネーション',
		firstPageAriaLabel: '最初のページ',
		previousPageAriaLabel: '前のページ',
		nextPageAriaLabel: '次のページ',
		lastPageAriaLabel: '最後のページ',
	},
	filter: {
		filterColumnAriaLabel: '列をフィルター',
		filterActiveAriaLabel: 'フィルター適用中',
		filterPanelAriaLabel: 'フィルターパネル',
		operatorAriaLabel: 'フィルター演算子',
		valuePlaceholder: '値',
		valueAriaLabel: 'フィルター値',
		value2Placeholder: '値',
		value2AriaLabel: '2番目のフィルター値',
		betweenSeparatorText: 'から',
		removeConditionAriaLabel: '条件を削除',
		addConditionAriaLabel: '2番目の条件を追加',
		addConditionLabel: '+ 条件を追加',
		clearLabel: 'クリア',
		applyLabel: '適用',
		andLabel: 'かつ',
		orLabel: 'または',
		operators: {
			contains: '含む',
			notContains: '含まない',
			equals: '等しい',
			notEquals: '等しくない',
			startsWith: 'で始まる',
			endsWith: 'で終わる',
			blank: '空白',
			notBlank: '空白でない',
			gt: 'より大きい',
			gte: '以上',
			lt: 'より小さい',
			lte: '以下',
			between: 'の間',
			before: '以前',
			after: '以降',
		},
	},
	expandable: {
		expandRowAriaLabel: '行を展開',
		collapseRowAriaLabel: '行を折りたたむ',
	},
};

export default ja;
