
import React from 'react';
import { storiesOf } from '@storybook/react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import data from '../constants/sampleMovieData';
import DataTable from '../../../src/index';
import { clear } from 'store2';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

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
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
  },
];

const LinearIndeterminate = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress />
    </div>
  );
};

const ProgressPendingIndeterminate = () => {
  const [pending, setPending] = React.useState(true);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <DataTable
      title="Movie List"
      columns={columns}
      data={data}
      progressPending={pending}
      progressComponent={<LinearIndeterminate />}
    />
  );
};

storiesOf('Progress Indicator', module)
  .add('Custom Indeterminate', () => <ProgressPendingIndeterminate />);
