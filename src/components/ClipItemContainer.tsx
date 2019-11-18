
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import GoogleClipItem from "./GoogleClipItem";

//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from "../logic/rootReducer";

import {
  addDisplayedClipItem,
  setDisplayedClipItems,
  removeDisplayedClipItem,
  addCachedClipItem,
  setCachedClipItemInfo,
  removeCachedClipItem,
} from "../logic/clipItemSlice"


import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";

import CloseIcon from "@material-ui/icons/Close";


const ClipItemContainer = (props: any) => {
  const dispatch = useDispatch();
  const list: string[] = useSelector((state: RootState) => {
      return state.clipItem.displayedClipItemsID
  });
  // https://material-ui.com/components/grid-list/
  return <Container>
    <Grid container spacing={2}>
      {list.map((id: string) => (
        <Grid item key={id} xs={12} sm={6} md={4} >
          <GoogleClipItem id={id} />
        </Grid>
      ))}
    </Grid>
  </Container>;
};

export default ClipItemContainer;
