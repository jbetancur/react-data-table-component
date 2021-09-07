import React from 'react';
import styled from 'styled-components';

const ButtonStyle = styled.button`
	background-color: #2979ff;
	border: none;
	color: white;
	padding: 8px 32px 8px 32px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 16px;
	border-radius: 3px;

	&:hover {
		cursor: pointer;
	}
`;

// eslint-disable-next-line react/prop-types
export default ({ children, ...rest }) => <ButtonStyle {...rest}>{children}</ButtonStyle>;
