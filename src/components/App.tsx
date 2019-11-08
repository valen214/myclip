
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import TopNav from "./TopNav";
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
    width: "100%",
    height: 500,
    background: "#aaf"
  }
}));



const App = (props: any) => {
  const classes = useStyles({});

  const [ itemList, setItemList ] = useState([]);

  function signIn(){
    console.log(`GDL.isSignedIn(): ${GDL.isSignedIn()}`);
    if(GDL.isSignedIn()){
      console.log("already signed in!");
    } else{
      GDL.signIn();
      loadFilesID();
    }
  }

  async function loadFilesID(){
    console.log("loading folder content");
    const files = await GDL.listAppFolder();
    const l = files.reduce((l: any, r: any) => {
      if("id" in r){
        l.push(r);
        // GDL.deleteFileByID(r.id);
      }
      return l;
    }, []);
    console.warn(`loadFilesID(): ${l}`);
    setItemList(l);
  }

  useEffect(() => {
    console.log("./components/App.tsx: useEffect(() => {}, [])");

    setTimeout(() => {
      if(GDL.isSignedIn()){
        loadFilesID();
      }
    }, 2000);

    const intervalID = setInterval(() => {
      if(GDL.isSignedIn()){
        loadFilesID();
      }
    }, 1000 * 60 * 10);

    return () => {
      clearInterval(intervalID);
      console.log("./components/App.tsx: useEffect(() => {}, []) clean up");
    };
  }, []);

  return <div>
    <TopNav />
    <GridList className={classes.gridList} cols={2.5} cellHeight={160}>
      {itemList.map(item => <GoogleClipItem key={item.id} item={item} />)}
    </GridList>
    <CreateClipMenu
        className={classes.createClipMenu}
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
