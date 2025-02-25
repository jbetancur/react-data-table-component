import styled from 'styled-components';

const Foot = styled.div`
	display: flex;
	width: 100%;
	${({ theme }) => theme.foot.style};
`;

export default Foot;
