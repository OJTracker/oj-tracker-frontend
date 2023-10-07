import React from 'react';
import { AppBar, Link, Menu, MenuItem } from '@mui/material';

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';

import classes from './topbar.module.css';

export default function TopBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar className={classes.topBar} position="fixed" color='inherit' sx={{ flexDirection: 'row' }}>
      <div className={classes.menu}>
        <button className={classes.menuButton} title="open menu" onClick={handleClick}>
          <MenuIcon />
        </button>
      </div>
      <Menu
        id="menu-h"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
      >
        <MenuItem component="a" href="/">User's Stats</MenuItem>
        <MenuItem component="a" href="/recommendation">Recommendation</MenuItem>
      </Menu>

      <div className={classes.linkDiv}>
        <Link className={classes.linkItem} href="/" underline="none" color="black" style={{margin: "0px 16px"}}>User's Stats</Link>
        <Link className={classes.linkItem} href="/recommendation" underline="none" color="black">Recommendation</Link>
      </div>

      <div className={classes.userInfo}>
        <button className={classes.buttonUserInfo} title="set user`s handles" onClick={props.onShowUserInfo}>
          <ManageAccountsIcon />
        </button>
      </div>
    </AppBar>
  );
}
