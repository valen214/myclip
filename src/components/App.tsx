
//@ts-ignore
import GDL from "../GoogleDriveLibrary";


import { AppWrapper } from "../actions/App";
import TopNav from "./TopNav";
import CreateClipMenu from "./CreateClipMenu";
import GoogleClipItem from "./GoogleClipItem";
import TextClipPage from "./TextClipPage";

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



const App = ({
  init, state,
}: any) => {


  const classes = useStyles({});

  const [ itemList, setItemList ] = useState([]);

  useEffect(init, []);
  useEffect((function printStateOnGlobalChange(last_value?: any){
  //@ts-ignore
    if(("ps" in window) && window.ps && window.ps != last_value){
      console.log("last_value:", last_value)
  //@ts-ignore
      window.ps = false;
      console.log(JSON.stringify(state, null, 2));
    }
    setTimeout(printStateOnGlobalChange, 200, last_value);
  }), []);

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
    <TextClipPage />
  </div>;
};

export default hot(AppWrapper(App));
