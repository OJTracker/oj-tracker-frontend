import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import classes from './topbar.module.css';

export default function TopBar(props) {

  return (
    <AppBar className={classes.topBar} position="fixed" color='inherit'
      sx={{ flexDirection: 'row' }}>
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