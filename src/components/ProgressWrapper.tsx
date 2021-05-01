import styled from 'styled-components';

const ProgressWrapper = styled.div`
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${props => props.theme.progress.style};
`;

export default ProgressWrapper;
