
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import TopNav, { TopNavMode } from "./TopNav";
import CreateClipMenu from "./CreateClipMenu";

import { hot } from 'react-hot-loader/root';

import React, { useState, useEffect } from "react";

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme: Theme) => createStyles({
  createClipMenu: {
    position: "absolute",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  }
}));


function signIn(){
  console.log(`GDL.isSignedIn(): ${GDL.isSignedIn()}`);
}


const App = (props: any) => {
  const classes = useStyles({});

  const [ topNavMode, setTopNavMode ] = useState(TopNavMode.mobile);
  const [ searchInput, setSearchInput ] = useState("");

  return <div>
    <TopNav mode={topNavMode}
        setMode={setTopNavMode}
        onInputClose={() => setTopNavMode(TopNavMode.mobile)}
        onInputChange={(text?: string) => setSearchInput(text)}
        onInputDone={() => {
          setTopNavMode(TopNavMode.input);
          console.log(`searching: ${searchInput}...`);
          setSearchInput(""); // adapt to voice/lost focus
        }}
        onSignInButtonClick={signIn}
        doneIcon={<SearchIcon />}
        placeholder="Search..."/>
    <CreateClipMenu
        className={classes.createClipMenu}
        showButton={topNavMode != TopNavMode.input}/>
  </div>;
};

export default hot(App);
