import styled from 'styled-components';

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	${({ theme }) => theme.tableWrapper.style};
`;

export default Wrapper;
