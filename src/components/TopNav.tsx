
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from "../logic/rootReducer";

import {
  setSignedIn, signIn
} from "../logic/appSlice"
import {
  addDisplayedClipItem,
  setDisplayedClipItems,
  removeDisplayedClipItem,
  addCachedClipItem,
  setCachedClipItemInfo,
  removeCachedClipItem,
} from "../logic/clipItemSlice"
import {
  TopNavMode,
  setVisible,
  setMode,
  setSearchString,
} from "../logic/topNavSlice";
import {
  setButtonVisible as setCreateClipButtonVisible
} from "../logic/createClipMenuSlice";

import { default as MyButton } from "./Button"

import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ToolBar from '@material-ui/core/ToolBar';
import Typography from "@material-ui/core/Typography";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DoneIcon from '@material-ui/icons/Done';
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

/*
https://material.io/archive/guidelines/
patterns/search.html#search-in-app-search


*/

const TopNav = ({
      placeholder = "",
}: any) => {
  const classes = useStyles({});
  
  const dispatch = useDispatch();
  const { visible, mode, searchString } = useSelector(
      (state: RootState) => state.topNav);
  const { signedIn } = useSelector((state: RootState) => state.app);

  const setNormalMode = React.useCallback(() => {
    dispatch(setMode(TopNavMode.normal));
    dispatch(setSearchString(""));
    dispatch(setCreateClipButtonVisible(true))
  }, [dispatch]);
  const setInputMode = React.useCallback(() => {
    dispatch(setMode(TopNavMode.input))
    dispatch(setCreateClipButtonVisible(false))
  }, [dispatch]);

  return <React.Fragment>
    <AppBar position="fixed">{
      mode == TopNavMode.normal ?
        <ToolBar>
          <MyButton edge="left">
            <MenuIcon />
          </MyButton>
          <Typography variant="h6" style={{ flex: 1 }}>
            MyClip
          </Typography>
          <IconButton onClick={setInputMode}>
            <SearchIcon />
          </IconButton>
          <Button
              variant="contained"
              color="primary"
              startIcon={<PersonIcon />}
              onClick={() => dispatch(signIn())}>
            { signedIn ? "Sign Out" : "Sign In" }
          </Button>
        </ToolBar> :
      mode == TopNavMode.input ?
        <ToolBar style={{ background: "#eee" }}>
          <IconButton edge="start" onClick={setNormalMode}>
            <ArrowBackIcon />
          </IconButton>
          <TextField placeholder={placeholder}
              value={searchString}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                dispatch(setSearchString(e.currentTarget.value));
              }}
              style={{ flex: 1 }} margin="dense" />
          <IconButton edge="end" onClick={setNormalMode}>
            <DoneIcon />
          </IconButton>
        </ToolBar> : <div>OH Hello!</div>
      }
    </AppBar>
  </React.Fragment>;
};

export default TopNav;
