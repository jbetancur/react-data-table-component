import type { Localization } from '../types';

const ar: Localization = {
	pagination: {
		navigationAriaLabel: 'التنقل بين صفحات الجدول',
		firstPageAriaLabel: 'الصفحة الأولى',
		previousPageAriaLabel: 'الصفحة السابقة',
		nextPageAriaLabel: 'الصفحة التالية',
		lastPageAriaLabel: 'الصفحة الأخيرة',
	},
	filter: {
		filterColumnAriaLabel: 'تصفية العمود',
		filterActiveAriaLabel: 'التصفية نشطة',
		filterPanelAriaLabel: 'لوحة التصفية',
		operatorAriaLabel: 'عامل التصفية',
		valuePlaceholder: 'قيمة',
		valueAriaLabel: 'قيمة التصفية',
		value2Placeholder: 'قيمة',
		value2AriaLabel: 'قيمة التصفية الثانية',
		betweenSeparatorText: 'و',
		removeConditionAriaLabel: 'إزالة الشرط',
		addConditionAriaLabel: 'إضافة شرط ثانٍ',
		addConditionLabel: '+ إضافة شرط',
		clearLabel: 'مسح',
		applyLabel: 'تطبيق',
		andLabel: 'و',
		orLabel: 'أو',
		operators: {
			contains: 'يحتوي على',
			notContains: 'لا يحتوي على',
			equals: 'يساوي',
			notEquals: 'لا يساوي',
			startsWith: 'يبدأ بـ',
			endsWith: 'ينتهي بـ',
			blank: 'فارغ',
			notBlank: 'غير فارغ',
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
		expandRowAriaLabel: 'توسيع الصف',
		collapseRowAriaLabel: 'طي الصف',
	},
};

export default ar;
