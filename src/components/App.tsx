
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import Button from "./Button"; // first because css specifity
import ClipActionDialog from "./ClipActionDialog";
import ClipItemContainer from "./ClipItemContainer";
import CreateClipMenu from "./CreateClipMenu";
import TextClipPage from "./TextClipPage";
import TopNav from "./TopNav";
import FunctionalOverlay from "./FunctionalOverlay";
import {
  init, onPaste, signIn
} from "../logic/appSlice";
import { RootState } from "../logic/rootReducer";

import { hot } from 'react-hot-loader/root';

//@ts-ignore // eslint ignore-next-line
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

import CssBaseline from "@material-ui/core/CssBaseline";


import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Snackbar from "./Snackbar";
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // overflow: 'hidden',
    alignContent: "start",
    width: "100%", height: "100%",
  },
  createClipMenu: {
    position: "fixed",
    bottom: theme.spacing(8),
    right: theme.spacing(5),
  },
}));

const App = ({}: any) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const {
    signedIn, authLoaded, showTutorial
  } = useSelector((state: RootState) => {
      return state.app
  });
  const list: string[] = useSelector((state: RootState) => {
      return state.clipItem.displayedClipItemsID
  });
  const path: string[] = useSelector((state: RootState) => {
      return state.clipItem.path
  });
  const lists: string[][] = useSelector((state: RootState) => {
      return state.clipItem.path.map(id => {
        let parent = state.clipItem.cache[id]
        return (parent && parent.children) || []
      })
  });

  useEffect(() => {
    dispatch(init())
  }, []);

  return <div className={classes.root}
      onPaste={(e: React.SyntheticEvent) => dispatch(onPaste(e))}
      style={{
        display: "flex",
        flexDirection: "column",
      }}>
    <CssBaseline />
    <TopNav />
    {
      !authLoaded ? (
        <div
            style={{
              flex: "1 0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              margin: "auto",
            }}>
        [ Loading... ]
        </div>
      ) : !signedIn ? (
          <Button onClick={() => { dispatch(signIn()) }}
              style={{
                position: "absolute",
                margin: "0", top: "20vh",
                width: "50vmin", height: "50vmin",
                background: "#ada", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "2em", userSelect: "none",
              }}>
            Sign In First!
          </Button>
      ): (
        <React.Fragment>
          <div style={{
              padding: "30px 0 60px",
              width: "100%",
              flex: "1 0 auto",
              overflow: "hidden auto",
              flexDirection: "column",
              position: "relative",
            }}>{
              lists.map((list, i) => {
                return <ClipItemContainer key={path[i]}
                    list={list} show={i === lists.length-1} />
              })
          }</div>
          <CreateClipMenu className={classes.createClipMenu} />
          <TextClipPage />
          <ClipActionDialog />
          <FunctionalOverlay />
        </React.Fragment>
      )
    }
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