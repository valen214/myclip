
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
  changeParents,
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
import { getNameByID } from "../logic/CachedInfo"

import { default as MyButton } from "./Button"

import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ToolBar from '@material-ui/core/ToolBar';
import Typography from "@material-ui/core/Typography";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DoneIcon from '@material-ui/icons/Done';
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  offset: theme.mixins.toolbar,
}));

/*
https://material.io/archive/guidelines/
patterns/search.html#search-in-app-search


*/

const TopNav = ({
      placeholder = "",
}: any) => {
  const classes = useStyles({});
  
  const appBarRef = React.useRef();
  const [ placeholderHeight, setPlaceholderHeight ] = useState("")
  const dispatch = useDispatch();
  const { visible, mode, searchString } = useSelector(
      (state: RootState) => state.topNav);
  const { signedIn } = useSelector((state: RootState) => state.app);
  const {
    parents, cachedClipItems
  } = useSelector((state: RootState) => state.clipItem);

  const setNormalMode = React.useCallback(() => {
    dispatch(setMode(TopNavMode.normal));
    dispatch(setSearchString(""));
    dispatch(setCreateClipButtonVisible(true))
  }, [dispatch]);
  const setInputMode = React.useCallback(() => {
    dispatch(setMode(TopNavMode.input))
    dispatch(setCreateClipButtonVisible(false))
  }, [dispatch]);

  console.assert(parents[0] === "appDataFolder")

  const showBreadcrumbs = parents.length > 1;

  useEffect(() => {
    let appBarElem = appBarRef.current
    if(appBarElem){
      setPlaceholderHeight(window.getComputedStyle(appBarElem).height)
    }
  }, [ parents ])

  return <React.Fragment>
    <div className={classes.offset}
        style={{ display: "flex", flexDirection: "column",
        justifyContent: "end", background: "#fdd",
        width: "100%", height: placeholderHeight, }}>
      I am Top nav placeholder
    </div>
    <AppBar ref={appBarRef} position="fixed">{
      mode == TopNavMode.normal ?
        <React.Fragment>
          <ToolBar>
            <MyButton edge="left">
              <MenuIcon />
            </MyButton>
            <Typography variant="h6" style={{ flex: 1, userSelect: "none" }}>
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
          </ToolBar>
          <div style={{
            display: "flex",
            borderTop: showBreadcrumbs ? "1px solid rgba(0, 0, 0, 1.0)" : "",
            height: showBreadcrumbs ? 56 : 0, width: "100%",
            transition: "transform 0.5s ease-in-out",
            alignItems: "center",
          }}>
            { showBreadcrumbs ?
              <React.Fragment>
                <IconButton style={{
                  marginLeft: 12, color: "white",
                }}
                onClick={() => {
                  dispatch(changeParents(parents.slice(0, -1)))
                }}>
                  <ArrowUpwardIcon />
                </IconButton>
                {parents.map((e, i) => 
                  <React.Fragment key={i}>
                    { i == 0 ?
                      <span style={{
                        height: "80%",
                        width: 20,
                        borderLeft: "1px solid rgba(0, 0, 0, 0.8)",
                        background: "transparent",
                      }}></span> :
                      <NavigateNextIcon style={{ margin: "0 -2px" }}/>
                    }
                    <MyButton square onClick={() => {
                      dispatch(changeParents(parents.slice(0, i+1)))
                    }}>{ i == 0 ?
                      <span style={{
                        fontSize: "1.2em"
                      }}>/</span> :
                      cachedClipItems[e].name
                    }</MyButton>
                  </React.Fragment>
                )}
              </React.Fragment>
              : ""
            }
          </div>
        </React.Fragment> :
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
