
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

import { default as MyButton } from "./Button"
import useEventListener from "../lib/use-event-listener"
import { debounce } from "../util"

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
      path: parents, cache
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

  // React.useEffect(() => {
  //   let appBarElem = appBarRef.current
  //   if(appBarElem){
  //     setTimeout(() => {
  //       setPlaceholderHeight(appBarElem.offsetHeight)
  //     }, 500);
  //   }
  // }, [ parents ])

  const onTransition = React.useCallback(debounce((e: React.SyntheticEvent) => {
    console.log("invoked")
    setPlaceholderHeight(appBarRef.current.offsetHeight + "px")
  }, 200), [ setPlaceholderHeight ])
  useEventListener("resize", onTransition)

  return <React.Fragment>
    <div className={classes.offset} style={{
          display: "flex", flexDirection: "column",
          justifyContent: "end", background: "#3f51b5",
          width: "100%", height: placeholderHeight,
          transition: "height 0.2s",
        }}>
      I am Top nav placeholder
    </div>
    <div style={{
      display: "flex",
      overflow: "hidden",
      background: "#3f51b5",
      borderTop: showBreadcrumbs ? "1px solid rgba(0, 0, 0, 1.0)" : "",
      height: showBreadcrumbs ? 56 : 0, width: "100%",
      transform: showBreadcrumbs ? "translateY(0)" : "translateY(-100%)",
      transition: "height 0.2s, transform 0.2s",
      alignItems: "center", color: "white",
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2),' +
          '0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)'
    }}>
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
          {
            i == 0 ?
              <span style={{
                height: "80%",
                width: 20,
                borderLeft: "1px solid rgba(0, 0, 0, 0.8)",
                background: "transparent",
              }}></span>
            :
              <NavigateNextIcon style={{ margin: "0 -2px" }}/>
          }
          <MyButton square onClick={() => {
            dispatch(changeParents(parents.slice(0, i+1)))
          }}>
            {
              i == 0 ?
                <span style={{
                  fontSize: "1.2em"
                }}>/</span>
              :
                cache[e].name
            }
          </MyButton>
        </React.Fragment>
      )}
    </div>
    <AppBar ref={appBarRef} position="fixed" style={{
          // transition: "height 0.5s"
          ...(showBreadcrumbs && { boxShadow: "none" }),
        }}>{
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
