import styled from 'styled-components';

const FootRow = styled.div<{
	$dense?: boolean;
}>`
	display: flex;
	align-items: stretch;
	width: 100%;
	${({ theme }) => theme.footRow.style};
	${({ $dense, theme }) => $dense && theme.footRow.denseStyle};
`;

export default FootRow;
