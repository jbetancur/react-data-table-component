import type { Localization } from '../types';

const arLV: Localization = {
	pagination: {
		navigationAriaLabel: 'التنقل بالجدول',
		firstPageAriaLabel: 'أول صفحة',
		previousPageAriaLabel: 'الصفحة اللي قبل',
		nextPageAriaLabel: 'الصفحة الجاية',
		lastPageAriaLabel: 'آخر صفحة',
	},
	filter: {
		filterColumnAriaLabel: 'فلتر العمود',
		filterActiveAriaLabel: 'الفلتر فعّال',
		filterPanelAriaLabel: 'لوحة الفلتر',
		operatorAriaLabel: 'نوع الفلتر',
		valuePlaceholder: 'قيمة',
		valueAriaLabel: 'قيمة الفلتر',
		value2Placeholder: 'قيمة',
		value2AriaLabel: 'القيمة التانية',
		betweenSeparatorText: 'و',
		removeConditionAriaLabel: 'شيل الشرط',
		addConditionAriaLabel: 'ضيف شرط تاني',
		addConditionLabel: '+ ضيف شرط',
		clearLabel: 'امسح',
		applyLabel: 'طبّق',
		andLabel: 'و',
		orLabel: 'أو',
		operators: {
			contains: 'بيحتوي على',
			notContains: 'ما بيحتوي على',
			equals: 'يساوي',
			notEquals: 'ما بيساوي',
			startsWith: 'بيبلش بـ',
			endsWith: 'بينتهي بـ',
			blank: 'فاضي',
			notBlank: 'مش فاضي',
			gt: 'أكبر من',
			gte: 'أكبر من أو يساوي',
			lt: 'أصغر من',
			lte: 'أصغر من أو يساوي',
			between: 'بين',
			before: 'قبل',
			after: 'بعد',
		},
	},
	expandable: {
		expandRowAriaLabel: 'بسّط الصف',
		collapseRowAriaLabel: 'اطوي الصف',
	},
};

export default arLV;
