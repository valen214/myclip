
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import { AppWrapper, init } from "../actions/App";
import ClipActionDialog from "./ClipActionDialog";
import ClipItemContainer from "./ClipItemContainer";
import CreateClipMenu from "./CreateClipMenu";
import TextClipPage from "./TextClipPage";
import TopNav from "./TopNav";

import { hot } from 'react-hot-loader/root';

import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from 'graphql-tag';

//@ts-ignore // eslint ignore-next-line
import React, { useState, useEffect } from "react";

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

const App = ({
  state,
}: any) => {
  const classes = useStyles({});

  useEffect(() => init(), []);

  return <div className={classes.root}>
    <CssBaseline />
    <TopNav />
    <div className={classes.offset}
        style={{ display: "flex", flexDirection: "column",
        justifyContent: "end", background: "#fdd", width: "500px" }}>
      I am Top nav place holder
    </div>
    <ClipItemContainer />
    <CreateClipMenu
        className={classes.createClipMenu}
        createClip={(type: string, ...args: any[]) => {
          switch(type){
          case "text":
            const [ title, body ] = args;
            GDL.uploadToAppFolder("", `${title}: ${body}`).then((obj: any) => {
            });
            break;
          }
        }} />
    <TextClipPage />
    <ClipActionDialog />
  </div>;
};

export default hot(AppWrapper(App));
