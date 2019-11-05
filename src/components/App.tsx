
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import TopNav, { TopNavMode } from "./TopNav";
import CreateClipMenu from "./CreateClipMenu";
import GoogleClipItem from "./GoogleClipItem";

import { hot } from 'react-hot-loader/root';

import React, { useState, useEffect } from "react";

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme: Theme) => createStyles({
  createClipMenu: {
    position: "absolute",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  gridList: {
    width: 500,
    height: 500,
    background: "#aaf"
  }
}));


function signIn(){
  console.log(`GDL.isSignedIn(): ${GDL.isSignedIn()}`);
  if(GDL.isSignedIn()){
    console.log("already signed in!");
  } else{
    GDL.signIn();
  }
}


const App = (props: any) => {
  const classes = useStyles({});

  const [ topNavMode, setTopNavMode ] = useState(TopNavMode.mobile);
  const [ searchInput, setSearchInput ] = useState("");

  const [ itemList, setItemList ] = useState([]);

  useEffect(() => {
    console.log("useEffect(() => {}, [])");
    (async () => {
      if(GDL.isSignedIn()){
        console.log("already signed in!, initializing folder");

        const files = await GDL.listAppFolder();
        const l = files.map((f: any) => ({ id: f.id }));
        setItemList([ ...itemList, ...l ])
      }
    })();
  }, [])

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
    <GridList className={classes.gridList} cols={2.5} cellHeight={160}>
      {itemList.map(item => <GoogleClipItem key={item.id} item={item} />)}
    </GridList>
    <CreateClipMenu
        className={classes.createClipMenu}
        showButton={topNavMode != TopNavMode.input}
        createClip={(type: string, ...args: any[]) => {
          switch(type){
          case "text":
            const [ title, body ] = args;
            GDL.uploadToAppFolder("", `${title}: ${body}`).then((obj: any) => {
              setItemList([ ...itemList, {
                id: obj.id
              }])
            });
            break;
          }
        }} />
  </div>;
};

export default hot(App);
