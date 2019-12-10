
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { createUseStyles } from "react-jss";

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

import useEventListener from "../lib/use-event-listener"
import { debounce } from "../util"

import Button from "./Button";
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

const useStyles = createUseStyles({
  top_nav: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    width: "100%",
    zIndex: 1100,
    background: "#3f51b5",
    color: "white",
  },
  title: {
    flex: "1 1 auto",
    userSelect: "none",
    marginLeft: "8px",
  },
  breadcrumbs: {
    display: "flex",
    overflow: "hidden",
    background: "#3f51b5",
    borderTop: ({ showBreadcrumbs }: { showBreadcrumbs: boolean }) => (
      showBreadcrumbs ? "1px solid rgba(0, 0, 0, 1.0)" : ""
    ),
    width: "100%",
    height: ({ showBreadcrumbs }: { showBreadcrumbs: boolean }) => showBreadcrumbs ? 56 : 0,
    transform: ({ showBreadcrumbs }: { showBreadcrumbs: boolean }) => showBreadcrumbs ? "translateY(0)" : "translateY(-100%)",
    transition: "height 0.2s, transform 0.2s",
    alignItems: "center",
    color: "white",
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2),' +
        '0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)'
  },
});

/*
https://material.io/archive/guidelines/
patterns/search.html#search-in-app-search


*/

const TopNav = ({
      placeholder = "",
}: any) => {
  const appBarRef = React.useRef();
  const [ placeholderHeight, setPlaceholderHeight ] = useState("")
  const dispatch = useDispatch();
  const {
    signedIn
  } = useSelector((state: RootState) => state.app);
  const {
    visible, mode, searchString
  } = useSelector((state: RootState) => state.topNav);
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
  
  const classes = useStyles({
    showBreadcrumbs
  });

  // React.useEffect(() => {
  //   let appBarElem = appBarRef.current
  //   if(appBarElem){
  //     setTimeout(() => {
  //       setPlaceholderHeight(appBarElem.offsetHeight)
  //     }, 500);
  //   }
  // }, [ parents ])

  const onTransition = React.useCallback(debounce((e: React.SyntheticEvent) => {
    console.log("invoked top nav ontransition listener")
    setPlaceholderHeight(appBarRef.current.offsetHeight + "px")
  }, 200), [ setPlaceholderHeight ])
  useEventListener("resize", onTransition)

  return <React.Fragment>
    <div className={""} style={{
          display: "flex", flexDirection: "column",
          justifyContent: "end", background: "#3f51b5",
          width: "100%",
          transition: "height 0.2s",
          height: placeholderHeight,
        }}>
      I am Top nav placeholder
    </div>
    <div className={classes.breadcrumbs}>
      <Button style={{
        marginLeft: 12, color: "white",
      }}
      onClick={() => {
        dispatch(changeParents(parents.slice(0, -1)))
      }}>
        <ArrowUpwardIcon />
      </Button>
      {parents.map((e, i) => 
        <React.Fragment key={e}>
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
          <Button onClick={() => {
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
          </Button>
        </React.Fragment>
      )}
    </div>
    <div ref={appBarRef} className={classes.top_nav} style={{
          // transition: "height 0.5s"
          ...(showBreadcrumbs && { boxShadow: "none" }),
        }}>{
      mode == TopNavMode.normal ?
        <React.Fragment>
          <Button style={{
                float: "left",
                borderRadius: "16px",
                marginLeft: "6px",
                color: "white",
              }}>
            <MenuIcon />
          </Button>
          <h2 className={classes.title}>
            MyClip
          </h2>
          <Button round onClick={setInputMode} style={{
                color: "white",
              }}>
            <SearchIcon />
          </Button>
          <Button onClick={() => dispatch(signIn())}
              style={{
                border: "1px solid rgba(0, 0, 0, 0.5)",
                marginRight: "16px",
                borderRadius: "16px",
                padding: "5px 16px",
                color: "white",
              }}>
            <PersonIcon />
            { signedIn ? "Sign Out" : "Sign In" }
          </Button>
        </React.Fragment> :
      mode == TopNavMode.input ?
        <div style={{
              background: "#eee",
              color: "black",
              width: "100%",
              height: "100%",
              display: "flex",
            }}>
          <Button round onClick={ setNormalMode } style={{ flex: "0 0 56px" }}>
            <ArrowBackIcon />
          </Button>
          <input type="text"
              placeholder={placeholder}
              value={searchString}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                dispatch(setSearchString(e.currentTarget.value));
              }}
              style={{
                flex: "1 1 auto",
                height: "100%",
                background: "transparent",
                border: "1px solid rgba(0, 0, 0, 0.15)",
                padding: "0 2px",
              }} />
          <Button round onClick={() => {
                setNormalMode()
                console.log("serach:", searchString)
              }} style={{ flex: "0 0 56px" }}>
            <DoneIcon />
          </Button>
        </div> : <div>OH Hello!</div>
      }
    </div>
  </React.Fragment>;
};

export default TopNav;
