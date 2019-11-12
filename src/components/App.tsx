
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import { AppWrapper, init } from "../actions/App";
import ClipItemContainer from "./ClipItemContainer";
import CreateClipMenu from "./CreateClipMenu";
import GoogleClipItem from "./GoogleClipItem";
import TextClipPage from "./TextClipPage";
import TopNav from "./TopNav";
import { client } from "../ApolloHelper";
import { SET_CLIP_ITEMS } from "../constants/Mutations"

import { hot } from 'react-hot-loader/root';

import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from 'graphql-tag';

import React, { useState, useEffect } from "react";

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import SearchIcon from "@material-ui/icons/Search";

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

  const [ setItemList, { loading } ] = useMutation(SET_CLIP_ITEMS);

  useEffect(() => init(setItemList), []);

  return <div className={classes.root}>
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
  </div>;
};

export default hot(AppWrapper(App));
