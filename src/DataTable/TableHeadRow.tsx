import styled from 'styled-components';

const HeadRow = styled.div<{
	$dense?: boolean;
	disabled?: boolean;
}>`
	display: flex;
	align-items: stretch;
	width: 100%;
	${({ theme }) => theme.headRow.style};
	${({ $dense, theme }) => $dense && theme.headRow.denseStyle};
`;

export default HeadRow;
