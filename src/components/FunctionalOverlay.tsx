
//@ts-ignore
import React from "react";

import { useDispatch } from "react-redux"

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => createStyles({
  fullscreenOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  invisible: {
    color: "rgba(0, 0, 0, 0)",
    opacity: 0,
    pointerEvents: "none",
  }
}));

const FunctionalOverlay = () => {
  const classes = useStyles({});
  
  return <React.Fragment>
    <div className={classes.fullscreenOverlay}></div>
  </React.Fragment>
};



export default FunctionalOverlay; 