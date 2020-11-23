import React from 'react';
import { storiesOf } from '@storybook/react';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';

const columns = [
	{
		name: 'Title',
		selector: 'title',
		sortable: true,
	},
	{
		name: 'Director',
		selector: 'director',
		sortable: true,
		omit: true,
	},
	{
		name: 'Year',
		selector: 'year',
		sortable: true,
	},
];

const OmitColumnTable = () => <DataTable title="Movie List" columns={columns} data={data} />;

storiesOf('General', module).add('Omit Column', OmitColumnTable);
