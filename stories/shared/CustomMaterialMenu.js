import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

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
