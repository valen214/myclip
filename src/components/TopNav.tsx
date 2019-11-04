
import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ToolBar from '@material-ui/core/ToolBar';
import Typography from "@material-ui/core/Typography";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DoneIcon from '@material-ui/icons/Done';
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export enum TopNavMode {
  mobile,
  tablet,
  desktop,
  input,
};

/*
https://material.io/archive/guidelines/
patterns/search.html#search-in-app-search


*/

const TopNav = ({
      mode, onInputClose, onInputDone, onInputChange,
      doneIcon = (<DoneIcon />), placeholder = ""
}: any) => {
  const classes = useStyles({});

  return <AppBar>
    {
      mode == TopNavMode.mobile ?
        <ToolBar>
          <IconButton edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flex: 1 }}>
            MyClip
          </Typography>
          <IconButton edge="end" onClick={onInputDone}>
            <SearchIcon />
          </IconButton>
        </ToolBar> :
      mode == TopNavMode.input ?
        <ToolBar>
          <IconButton edge="start" onClick={onInputClose}>
            <ArrowBackIcon />
          </IconButton>
          <TextField placeholder={placeholder}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                onInputChange(e.currentTarget.value);
              }}
              style={{ flex: 1 }} margin="dense" />
          <IconButton edge="end" onClick={onInputDone}>
            {doneIcon}
          </IconButton>
        </ToolBar> : <div>OH Hello!</div>
    }
  </AppBar>;
};

export default TopNav;
