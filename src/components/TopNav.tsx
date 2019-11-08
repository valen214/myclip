
import { TopNavMode } from "../constants/TopNav";
import { TopNavWrapper } from "../actions/TopNav";


import React, { useState, useEffect } from "react";

import { connect } from "react-redux";

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
      mode,
      placeholder = "",
      searchInput,

      // normal mode
      onMenuButtonClick,
      onSearchButtonClick,
      onSignInButtonClick,
      onConfigButtonClick,

      // search mode
      onSearchCancelClick,
      onSearchInputChange,
      onSearchDoneClick,
}: any) => {
  const classes = useStyles({});

  return <React.Fragment>
    <AppBar>{
      mode == TopNavMode.normal ?
        <ToolBar>
          <IconButton edge="start" onClick={() => {}}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flex: 1 }}>
            MyClip
          </Typography>
          <IconButton onClick={onSearchButtonClick}>
            <SearchIcon />
          </IconButton>
          <Button
              variant="contained"
              color="primary"
              startIcon={<PersonIcon />}
              onClick={onSignInButtonClick}>
            Sign In
          </Button>
        </ToolBar> :
      mode == TopNavMode.input ?
        <ToolBar style={{ background: "#eee" }}>
          <IconButton edge="start" onClick={onSearchCancelClick}>
            <ArrowBackIcon />
          </IconButton>
          <TextField placeholder={placeholder}
              value={searchInput}
              onChange={onSearchInputChange}
              style={{ flex: 1 }} margin="dense" />
          <IconButton edge="end" onClick={onSearchDoneClick}>
            <DoneIcon />
          </IconButton>
        </ToolBar> : <div>OH Hello!</div>
      }
    </AppBar>
    <ToolBar />
  </React.Fragment>;
};

export default TopNavWrapper(TopNav);
