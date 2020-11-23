import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

// eslint-disable-next-line react/prop-types
export default ({ row, onDeleteRow, size }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const deleteRow = () => {
		if (onDeleteRow) {
			onDeleteRow(row);
		}
	};

	return (
		<div>
			<IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick} size={size}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id="menu"
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem>Item One</MenuItem>

				<MenuItem>Item Two</MenuItem>

				<Divider />

				<MenuItem onClick={deleteRow}>
					<ListItemIcon>
						<DeleteIcon fontSize="small" color="secondary" />
					</ListItemIcon>
					<Typography variant="inherit">Delete</Typography>
				</MenuItem>
			</Menu>
		</div>
	);
};
