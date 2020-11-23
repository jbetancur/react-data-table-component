import styled from 'styled-components';

const TableWrapper = styled.div`
	position: relative;
	width: 100%;
	${({ theme }) => theme.tableWrapper.style};
`;

export default TableWrapper;
