
//@ts-ignore
import React from "react";

import { useDispatch } from "react-redux"

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";

const FILE_SELECT = "FILE_SELECT"

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

export const askFile = async ({
  type = null, accept = null, event = null
}: {
  type?: string, accept?: string,
  event?: React.SyntheticEvent
} = {}) => {
  const elem: Partial<HTMLInputElement> = document.getElementById(FILE_SELECT);
  if(type) elem.type = type;
  if(accept) elem.accept = accept;
  if(event){
    elem.dispatchEvent(event);
  }
};

const FunctionalOverlay = () => {
  const classes = useStyles({});
  
  return <React.Fragment>
    <div className={classes.fullscreenOverlay}></div>
    <input id={FILE_SELECT} className={classes.invisible}
        type="file" accept=".jpg,.png,.webm" />
  </React.Fragment>
};



export default FunctionalOverlay; 