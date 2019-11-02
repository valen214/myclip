

import { hot } from 'react-hot-loader/root';
import { setConfig, cold } from 'react-hot-loader';

import React, { useState, useEffect } from "react";

import TopNav, { TopNavMode } from "./TopNav";
import CreateClipMenu from "./CreateClipMenu";

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";

setConfig({
  reloadHooks: true,
  onComponentCreate: (type, name) => (
    String(type).indexOf('useState') > 0 ||
    String(type).indexOf('useEffect') > 0) && cold(type),
});

const useStyles = makeStyles((theme: Theme) => createStyles({
  createClipMenu: {
    position: "absolute",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  }
}));


const App = (props: any) => {
  const classes = useStyles({});

  const [ topNavMode, setTopNavMode ] = useState(TopNavMode.mobile);

  return <div>
    <TopNav mode={topNavMode}
        setMode={setTopNavMode}
        onClose={() => setTopNavMode(TopNavMode.mobile)}
        onDone={() => setTopNavMode(TopNavMode.input)}
        doneIcon={<SearchIcon />}
        placeholder="Search..." />
    <CreateClipMenu
        className={classes.createClipMenu}
        showButton={topNavMode != TopNavMode.input}/>
  </div>;
};

export default hot(App);
