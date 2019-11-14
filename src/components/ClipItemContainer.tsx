
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import GoogleClipItem from "./GoogleClipItem";

import { GET_CLIP_ITEMS } from "../constants/Query";

import React, { useState, useEffect } from "react";

import { useQuery, useMutation } from "@apollo/react-hooks";

import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";

import CloseIcon from "@material-ui/icons/Close";


const ClipItemContainer = (props: any) => {
  const { data } = useQuery(GET_CLIP_ITEMS);

  // https://material-ui.com/components/grid-list/
  return <Container>
    <Grid container spacing={2}>
      {data && data.clip_items.map(({ id }: any) => (
        <Grid item key={id} xs={12} sm={6} md={4} >
          <GoogleClipItem id={id} />
        </Grid>
      ))}
    </Grid>
  </Container>;
};

export default ClipItemContainer;
