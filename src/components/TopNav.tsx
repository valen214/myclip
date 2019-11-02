
import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ToolBar from '@material-ui/core/ToolBar';
import Typography from "@material-ui/core/Typography";

import CloseIcon from "@material-ui/icons/Close";
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

const TopNav = ({
      mode, onClose, onDone, onChange, doneIcon = (<DoneIcon />),
      placeholder = "...", position
}: any) => {
  const classes = useStyles({});

  return <AppBar position={position}>
    {
      mode == TopNavMode.mobile ?
        <ToolBar>
          <IconButton edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flex: 1 }}>
            MyClip
          </Typography>
          <IconButton edge="end" onClick={onDone}>
            <SearchIcon />
          </IconButton>
        </ToolBar> :
      mode == TopNavMode.input ?
        <ToolBar>
          <IconButton edge="start" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <TextField placeholder={placeholder}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                onChange(e.currentTarget.value);
              }}
              style={{ flex: 1 }} margin="dense" />
          <IconButton edge="end" onClick={onDone}>
            {doneIcon}
          </IconButton>
        </ToolBar> : <div>OH Hello!</div>
    }
  </AppBar>;
};

export default TopNav;
