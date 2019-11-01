

import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(theme => ({

}));

const TopNav = (props: any) => {
  return <AppBar>
    <ToolBar>
      <IconButton edge="start"><MenuIcon /></IconButton>
      <Typography variant="h6">MyClip
      </Typography>
    </ToolBar>
  </AppBar>;
};

export default TopNav;
