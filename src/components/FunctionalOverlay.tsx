
//@ts-ignore
import React from "react";

import { useDispatch, useSelector } from "react-redux"

import { RootState } from "../logic/rootReducer";
import {
  setVisible, setContent
} from "../logic/functionalOverlaySlice";

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import Button from "./Button";

import CloseIcon from '@material-ui/icons/Close';
import { createFolder } from "../logic/clipItemSlice";
import useEventListener from "../lib/use-event-listener";



const useStyles = makeStyles((theme: Theme) => createStyles({
  fullscreenOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    padding: "15px",
  },
  invisible: {
    color: "rgba(0, 0, 0, 0)",
    opacity: 0,
    pointerEvents: "none",
  }
}));

const FunctionalOverlay = () => {
  const classes = useStyles({});
  const overlayRef = React.useRef();
  const dispatch = useDispatch();
  const [ text, setText ] = React.useState("")
  const {
    visible, background = "rgba(0, 0, 0, 0.2)",
    content, type
  } = useSelector((state: RootState) => state.functionalOverlay);
  
  const discard = () => {
    dispatch(setVisible(false))
    dispatch(setContent({ type: "", content: "" }))
  }

  useEventListener("keydown", () => {
    if(visible){
      console.log("oh dear")
      discard()
    }
  }, document)

  return <React.Fragment>
    <div ref={overlayRef} className={classes.fullscreenOverlay}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          if(e.target === overlayRef.current){
            discard()
          }
        }}
        style={{
          display: visible ? "flex" : "none",
          background: "rgba(0, 0, 0, 0.2)", 
          pointerEvents: visible ? "all" : "none",
          zIndex: visible ? 1200 : 0,
        } as React.CSSProperties}>
      {
        type && (
          type.startsWith("image") ?
          <img src={content}
            onLoad={(e) => {
            if(e.target instanceof Image){
              let self = e.target
              console.log("loaded:", self.width, self.height, self)
              // if(self.naturalWidth > self.naturalHeight){
              if(document.body.clientWidth < document.body.clientHeight){
                self.style.width = "100%";
                self.style.height = "auto";
              } else{
                self.style.width = "auto";
                self.style.height = "100%"
              }
            }
          }} style={{
            objectFit: "contain",
            margin: "auto",
          } as React.CSSProperties}></img> :
          type === "create_folder" ?
          <div style={{
            minWidth: "300px",
            background: "white",
            margin: "auto",
            padding: 15,
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ display: "flex" }}>
              Input Folder Name:
              <Button onClick={discard} style={{ marginLeft: "auto" }}>
                <CloseIcon />
              </Button>
            </div>
            <input type="text"
            onBlur={(e: React.InputEvent<HTMLInputElement>) => {
              setText(e.target.value)
            }} style={{
              height: 32, fontSize: 32
            }}>

            </input>
            <div style={{ marginLeft: "auto", marginTop: "auto" }}>
              <Button onClick={discard}>cancel</Button>
              <Button onClick={() => {
                dispatch(createFolder(text))
                discard()
              }}>create</Button>
            </div>
          </div>
          : ""
        )
      }
    </div>
  </React.Fragment>
};



export default FunctionalOverlay; 