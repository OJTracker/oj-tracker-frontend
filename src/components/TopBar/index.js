import React from 'react';
import { useDispatch } from "react-redux";
import { AppBar, Link, Menu, MenuItem } from '@mui/material';

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

import { handleActions } from "../../store/handles";
import { userActions } from "../../store/user";

import classes from './topbar.module.css';
import { getUserRole } from '../../utils/auth';

export default function TopBar(props) {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem("tk");

    dispatch(handleActions.clearHandles());
    dispatch(userActions.clearUserInfo());

    window.location = "/ojtracker/login";
  }

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
        { !props.specialUser &&
          <>
            <MenuItem component="a" href="/ojtracker">User's Stats</MenuItem>
            <MenuItem component="a" href="/ojtracker/recommendation">Recommendation</MenuItem>
            <MenuItem component="a" href="/ojtracker/curated-lists">Curated Lists</MenuItem>
            <MenuItem component="a" href="/ojtracker/coaching">Coaching</MenuItem>
          </>
        }
        { props.specialUser &&
          <>
            <MenuItem component="a" href="/ojtracker/curated-lists">Curated Lists</MenuItem>
            <MenuItem component="a" href="/ojtracker/coaching/0">Coaching</MenuItem>
          </>
        }
        { props.isAdmin &&
          <>
            <MenuItem component="a" href="/ojtracker/user-management">User Management</MenuItem>
          </>
        }
      </Menu>

      <div className={classes.linkDiv}>
        { !props.specialUser &&
          <>
            <Link className={classes.linkItem} href="/ojtracker" underline="none" color="black" style={{margin: "0px 0px 0px 16px"}}>User's Stats</Link>
            <Link className={classes.linkItem} href="/ojtracker/recommendation" underline="none" color="black">Recommendation</Link>
            <Link className={classes.linkItem} href="/ojtracker/curated-lists" underline="none" color="black">Curated Lists</Link>
            <Link className={classes.linkItem} href="/ojtracker/coaching" underline="none" color="black">Coaching</Link>
          </>
        }
        { props.specialUser &&
          <>
            <Link className={classes.linkItem} href="/ojtracker/curated-lists" underline="none" color="black" style={{margin: "0px 0px 0px 16px"}}>Curated Lists</Link>
            <Link className={classes.linkItem} href="/ojtracker/coaching/0" underline="none" color="black">Coaching</Link>
          </>
        }
        { props.isAdmin &&
          <>
            <Link className={classes.linkItem} href="/ojtracker/user-management" underline="none" color="black" style={{margin: "0px 0px 0px 16px"}}>User Management</Link>
          </>
        }
      </div>

      <div className={classes.userInfo}>
        <span style={{ marginRight: "16px", alignSelf: "center", color: "black" }}>{getUserRole()}</span>
        { !props.specialUser && 
          <button className={classes.buttonUserInfo} title="set user`s handles" onClick={props.onShowUserInfo}>
            <ManageAccountsIcon />
          </button>
        }
        <button className={classes.buttonUserInfo} onClick={logout}>
            <LogoutIcon />
        </button>
      </div>
    </AppBar>
  );
}
