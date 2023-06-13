import React from "react";

import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { Drawer, List, ListItem, ListItemText } from "@material-ui/core";

import Avatar from "@mui/material/Avatar";

import css from "./aside.module.css";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
}));

const ASide = () => {
  const profilePicURI = useSelector((state) => state.user.profilePicURI);
  const userName = useSelector((state) => state.user.userName);
  const codeforcesRanking = useSelector(
    (state) => state.user.codeforcesRanking
  );
  const atcoderRanking = useSelector((state) => state.user.atcoderRanking);
  const codechefRanking = useSelector((state) => state.user.codechefRanking);
  const spojRanking = useSelector((state) => state.user.spojRanking);
  const uvaAvgDacu = useSelector((state) => state.user.uvaAvgDacu);

  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        <ListItem className={css.avatar}>
          <Avatar
            alt="avatarURI"
            src={profilePicURI}
            sx={{ width: 60, height: 60 }}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="User Name: " secondary={userName} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Codeforces Rating: "
            secondary={codeforcesRanking}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Atcoder Rating: " secondary={atcoderRanking} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Online Judge AvgDacu: "
            secondary={uvaAvgDacu}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="SPOJ Ranking: " secondary={spojRanking} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Codechef Rating: "
            secondary={codechefRanking}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default ASide;
