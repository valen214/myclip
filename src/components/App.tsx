
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import ClipActionDialog from "./ClipActionDialog";
import ClipItemContainer from "./ClipItemContainer";
import CreateClipMenu from "./CreateClipMenu";
import TextClipPage from "./TextClipPage";
import TopNav from "./TopNav";
import FunctionalOverlay from "./FunctionalOverlay";
import { init, onPaste } from "../logic/appSlice";

import { hot } from 'react-hot-loader/root';

//@ts-ignore // eslint ignore-next-line
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux"

import CssBaseline from "@material-ui/core/CssBaseline";


import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // overflow: 'hidden',
    alignContent: "start",
  },
  createClipMenu: {
    position: "fixed",
    bottom: theme.spacing(8),
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

  return <div className={classes.root}
      onPaste={(e: React.SyntheticEvent) => dispatch(onPaste(e))}>
    <CssBaseline />
    <TopNav />
    <div className={classes.offset}
        style={{ display: "flex", flexDirection: "column",
        justifyContent: "end", background: "#fdd",
        width: "500px", height: "100px", }}>
      I am Top nav place holder
    </div>
    <ClipItemContainer />
    <CreateClipMenu className={classes.createClipMenu} />
    <TextClipPage />
    <ClipActionDialog />
    <FunctionalOverlay />
  </div>;
};

export default hot(App);

/*

https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
https://nextjs-starter.now.sh/
https://codelabs.developers.google.com/
https://medium.com/@bryanmanuele/
how-i-implemented-my-own-spa-routing-system-in-vanilla-js-49942e3c4573

https://www.youtube.com/watch?v=IxRJ8vplzAo


https://pripri-anime.jp/tv/onair.php

https://brunoarizio.com/






https://mostly-adequate.gitbooks.io/mostly-adequate-guide/
*/