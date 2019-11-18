
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import ClipActionDialog from "./ClipActionDialog";
import ClipItemContainer from "./ClipItemContainer";
import CreateClipMenu from "./CreateClipMenu";
import TextClipPage from "./TextClipPage";
import TopNav from "./TopNav";
import { init } from "../logic/appSlice";

import { hot } from 'react-hot-loader/root';

//@ts-ignore // eslint ignore-next-line
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux"

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // overflow: 'hidden',
  },
  createClipMenu: {
    position: "fixed",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  offset: theme.mixins.toolbar,
}));

const App = ({}: any) => {
  const classes = useStyles({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(init())
  }, []);

  return <div className={classes.root}>
    <CssBaseline />
    <TopNav />
    <div className={classes.offset}
        style={{ display: "flex", flexDirection: "column",
        justifyContent: "end", background: "#fdd", width: "500px" }}>
      I am Top nav place holder
    </div>
    <ClipItemContainer />
    <CreateClipMenu className={classes.createClipMenu} />
    <TextClipPage />
    <ClipActionDialog />
  </div>;
};

export default hot(App);
