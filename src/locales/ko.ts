import type { Localization } from '../types';

const ko: Localization = {
	pagination: {
		navigationAriaLabel: '테이블 페이지 탐색',
		firstPageAriaLabel: '첫 번째 페이지',
		previousPageAriaLabel: '이전 페이지',
		nextPageAriaLabel: '다음 페이지',
		lastPageAriaLabel: '마지막 페이지',
	},
	filter: {
		filterColumnAriaLabel: '열 필터',
		filterActiveAriaLabel: '필터 활성화됨',
		filterPanelAriaLabel: '필터 패널',
		operatorAriaLabel: '필터 연산자',
		valuePlaceholder: '값',
		valueAriaLabel: '필터 값',
		value2Placeholder: '값',
		value2AriaLabel: '두 번째 필터 값',
		betweenSeparatorText: '및',
		removeConditionAriaLabel: '조건 제거',
		addConditionAriaLabel: '두 번째 조건 추가',
		addConditionLabel: '+ 조건 추가',
		clearLabel: '초기화',
		applyLabel: '적용',
		andLabel: '그리고',
		orLabel: '또는',
		operators: {
			contains: '포함',
			notContains: '포함하지 않음',
			equals: '같음',
			notEquals: '같지 않음',
			startsWith: '시작 문자',
			endsWith: '끝 문자',
			blank: '비어 있음',
			notBlank: '비어 있지 않음',
			gt: '초과',
			gte: '이상',
			lt: '미만',
			lte: '이하',
			between: '사이',
			before: '이전',
			after: '이후',
		},
	},
	expandable: {
		expandRowAriaLabel: '행 펼치기',
		collapseRowAriaLabel: '행 접기',
	},
};

export default ko;
