/* eslint-disable react/prop-types */

import React from 'react';
import { storiesOf } from '@storybook/react';
import moment from 'moment';
import styled from 'styled-components';
import data from '../constants/sampleRMEpisodes';
import DataTable from '../../../src/index';

const SampleStyle = styled.div`
	padding: 16px;
	display: block;
	width: 100%;

	p {
		font-size: 16px;
		font-weight: 700;
		word-break: break-all;
	}
`;

// eslint-disable-next-line
const SampleExpandedComponent = ({ data }) => (
	<SampleStyle>
		<p>{data.summary}</p>
		<img height="75%" width="75%" alt={data.image.original} src={data.image.original} />
	</SampleStyle>
);

const columns = [
	{
		name: 'Name',
		selector: 'name',
		sortable: true,
	},
	{
		name: 'Season',
		selector: 'season',
		sortable: true,
		right: true,
	},
	{
		name: 'Air Date',
		selector: 'airstamp',
		sortable: true,
		format: d => moment(d.airstamp).format('ll'),
	},
	{
		name: 'Image',
		selector: 'image.medium',
		cell: d => <img height="32x" width="64px" alt={d.image.medium} src={d.image.medium} />,
	},
];

const Expandable = () => (
	<DataTable
		title="Rick & Morty Episodes"
		columns={columns}
		data={data}
		expandableRows
		highlightOnHover
		defaultSortField="name"
		expandableRowsComponent={<SampleExpandedComponent />}
	/>
);

storiesOf('Expandable Rows', module).add('Custom Expanded Component', Expandable);
