import { useState } from "react";
import { useSelector } from "react-redux";

import Routes from "./Routes";

import TopBar from "./components/TopBar";
import UserInfo from "./components/UserInfo";
import ASide from "./components/ASide";

import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Container, Grid } from "@material-ui/core";

import { isSpecialUser } from "./utils/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    marginTop: "66px",
    padding: theme.spacing(3),
  },
  '@media (max-width: 545px)': {
    root: {
      flexDirection: 'column'
    },
    content: {
      marginTop: '0px',
      alignSelf: 'center'
    }
  }
}));

const App = () => {
  const classes = useStyles();

  const [userInfoIsShown, setUserInfoIsShown] = useState(false);

  const codeforcesHandle = useSelector((state) => state.handles.codeforcesHandle);
  const uvaHandle = useSelector((state) => state.handles.uvaHandle);
  const atcoderHandle = useSelector((state) => state.handles.atcoderHandle);
  const spojHandle = useSelector((state) => state.handles.spojHandle);
  const codechefHandle = useSelector((state) => state.handles.codechefHandle);

  const showUserInfoHandler = () => {
    setUserInfoIsShown(true);
  };

  const hideUserInfoHandler = () => {
    setUserInfoIsShown(false);
  };

  const usersIsNotSetted = () => {
    return (
      !codeforcesHandle &&
      !uvaHandle &&
      !atcoderHandle &&
      !spojHandle &&
      !codechefHandle
    );
  };

  return (
    <>
      {(userInfoIsShown || usersIsNotSetted()) && !isSpecialUser() && (
        <UserInfo onClose={hideUserInfoHandler} />
      )}
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <TopBar onShowUserInfo={showUserInfoHandler} />
        </AppBar>
        <ASide />
        <main className={classes.content}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Routes />
            </Grid>
          </Container>
        </main>
      </div>
    </>
  );
};

export default App;
