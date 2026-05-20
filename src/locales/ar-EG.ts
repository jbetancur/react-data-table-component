import type { Localization } from '../types';

const arEG: Localization = {
	pagination: {
		navigationAriaLabel: 'التنقل في الجدول',
		firstPageAriaLabel: 'الصفحة الأولى',
		previousPageAriaLabel: 'الصفحة اللي فاتت',
		nextPageAriaLabel: 'الصفحة الجاية',
		lastPageAriaLabel: 'آخر صفحة',
	},
	filter: {
		filterColumnAriaLabel: 'فلتر العمود',
		filterActiveAriaLabel: 'الفلتر شغال',
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
			notContains: 'مش بيحتوي على',
			equals: 'يساوي',
			notEquals: 'مش يساوي',
			startsWith: 'بيبدأ بـ',
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
		expandRowAriaLabel: 'افتح الصف',
		collapseRowAriaLabel: 'اقفل الصف',
	},
};

export default arEG;
