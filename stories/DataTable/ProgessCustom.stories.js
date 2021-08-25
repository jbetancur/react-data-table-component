import React from 'react';
import styled, { keyframes } from 'styled-components';
import data from '../constants/sampleMovieData';
import DataTable from '../../src/index';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
	margin: 16px;
	animation: ${rotate360} 1s linear infinite;
	transform: translateZ(0);
	border-top: 2px solid grey;
	border-right: 2px solid grey;
	border-bottom: 2px solid grey;
	border-left: 4px solid black;
	background: transparent;
	width: 80px;
	height: 80px;
	border-radius: 50%;
`;

const columns = [
	{
		name: 'Title',
		selector: row => row.title,
		sortable: true,
	},
	{
		name: 'Director',
		selector: row => row.director,
		sortable: true,
	},
	{
		name: 'Year',
		selector: row => row.year,
		sortable: true,
	},
];

const CustomLoader = () => (
	<div style={{ padding: '24px' }}>
		<Spinner />
		<div>Fancy Loader...</div>
	</div>
);

export const Custom = () => {
	const [pending, setPending] = React.useState(true);
	const [rows, setRows] = React.useState([]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			setRows(data);
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<DataTable
			title="Movie List"
			columns={columns}
			data={rows}
			progressPending={pending}
			progressComponent={<CustomLoader />}
			pagination
		/>
	);
};

export default {
	title: 'Loading/Custom',
	component: Custom,
};
