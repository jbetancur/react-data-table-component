import styled from 'styled-components';

const NoDataWrapper = styled.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${({ theme }) => theme.noData.style};
`;

export default NoDataWrapper;
