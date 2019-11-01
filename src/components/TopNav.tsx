
import React, { useState, useEffect } from "react";

import { TopNavMode } from "./App";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ToolBar from '@material-ui/core/ToolBar';
import Typography from "@material-ui/core/Typography";

import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
}));


const TopNav = (props: any) => {
  const classes = useStyles({});
  const mode = props.mode;
  const setMode = props.setMode;

  return <AppBar>
    {
      mode == TopNavMode.mobile ?
        <ToolBar>
          <IconButton edge="start"><MenuIcon /></IconButton>
          <Typography variant="h6" style={{ flex: 1 }}>MyClip</Typography>
          <IconButton onClick={() => setMode(TopNavMode.search)}>
            <SearchIcon />
          </IconButton>
        </ToolBar> :
      mode == TopNavMode.search ?
        <ToolBar>
          <IconButton edge="start" onClick={() => setMode(TopNavMode.mobile)}><CloseIcon /></IconButton>
          <TextField placeholder="Search" style={{ flex: 1 }} margin="dense" />
          <IconButton><SearchIcon /></IconButton>
        </ToolBar> :
      <div>Oh Hello!</div>
    }
  </AppBar>;
};

export default TopNav;
