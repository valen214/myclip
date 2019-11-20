
//@ts-ignore
import React from "react";

import { useDispatch, useSelector } from "react-redux"

import { RootState } from "../logic/rootReducer";
import {
  setVisible, setContent
} from "../logic/functionalOverlaySlice";

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
  const dispatch = useDispatch();
  const {
    visible, background = "rgba(0, 0, 0, 0.2)",
    content, type
  } = useSelector((state: RootState) => state.functionalOverlay);
  
  return <React.Fragment>
    <div className={classes.fullscreenOverlay}
        onClick={() => {
          dispatch(setVisible(false))
          dispatch(setContent({ type: "", content: "" }))
        }} style={{
          display: visible ? "block" : "none",
          background: "rgba(0, 0, 0, 0.2)", 
          pointerEvents: visible ? "all" : "none",
          zIndex: visible ? 1200 : 0,
        }}>
      {
        type && (
          type.startsWith("image") ? <img src={content} style={{
            objectFit: "contain",
            padding: 15,
            width: "100%", height: "100%",
          }}></img>
          : ""
        )
      }
    </div>
  </React.Fragment>
};



export default FunctionalOverlay; 