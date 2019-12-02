
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { createUseStyles } from "react-jss"

import { RootState } from "../logic/rootReducer";

import {
  deleteItem,
  changeParents,
} from "../logic/clipItemSlice"
import {
  setVisible as setClipActionDialogVisible,
  setTarget as setClipActionDialogTarget,
} from "../logic/clipActionDialogSlice";
import {
  setVisible, setTarget, setTitle, setContent, PositionRect
} from "../logic/textClipPageSlice";
import {
  setVisible as setOverlayVisible, setContent as setOverlayContent
} from "../logic/functionalOverlaySlice"


import Button from './Button';
import Snackbar from "./Snackbar";

import CloseIcon from "@material-ui/icons/Close";
import FolderIcon from '@material-ui/icons/Folder';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = createUseStyles({
  GCI: {
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "none",
    cursor: "pointer",
    height: "auto",
    background: "#ffd",
    overflow: "visible",
    "&::after": {
      // https://tobiasahlin.com/blog/how-to-animate-box-shadow/
      content: '""',
      display: "block",
      position: "absolute",
      left: 0, top: 0,
      width: "100%", height: "100%",
      background: "#afa",
      zIndex: -1,
      opacity: 0,
      // boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2)," +
      //           "0px 8px 10px 1px rgba(0,0,0,0.14)," +
      //           "0px 3px 14px 2px rgba(0,0,0,0.12)",
      boxShadow: "0 5px 12px rgba(0, 0, 0, 0.5)",
      transition: "opacity 0.1s ease-in-out",
    },
    "&:hover": {
      border: "1px solid rgba(0, 0, 0, 0.35)",
      "&::after": {
        opacity: 1,
      },
    },
  },

  text_style: {
    fontFamily: "Consolas",
    padding: "5px 2px",
    wordBreak: "break-all",
    whiteSpace: "pre-wrap",
  },
  content: {
    padding: "0 5px 0 5px",
    background: "#dfd", width: "100%",
    maxHeight: "280px", overflow: "hidden",
    display: "inline-block",
  },
  filename_button_text: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "none",
    fontWeight: 600,
    lineHeight: 1.75,
    fontSize: "0.8125rem",
  },
  action_area: {
    padding: "0 5px 4px",
    display: "flex",
  },
  action_area_button: {
    padding: "6px 12px",
  },
});

export type PropsType = {
  id: string
  onLoad?: () => void
}
const GoogleClipItem = ({
  id, onLoad = () => {}
}: PropsType) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const ref = React.useRef();
  const textContentRef = React.useRef()
  const [ loaded, setLoaded ] = useState(false);
  const [ showSnackbar, setShowSnackbar ] = useState(false)
  const [ snackbarContent, setSnackbarContent ] = useState("");
  const path = useSelector(
    (state: RootState) => state.clipItem.path
  )
  const {
    id: _id, name, content, type = "", objectURL
  } = useSelector((state: RootState) => {
    return state.clipItem.cache[id] || { id }
  });
  console.assert(id === _id);

  const showTextClipPage = React.useCallback(() => {
    let r = ref.current.getBoundingClientRect();
    dispatch(setVisible({
      top: r.top, left: r.left, width: r.width, height: r.height
    } as PositionRect))
    dispatch(setTarget(id))
    dispatch(setTitle(name))
    dispatch(setContent((content as string) || ""))
    setLoaded(false)
  }, [dispatch, id, name, content]);

  const showActionDialog = React.useCallback(() => {
    dispatch(setClipActionDialogVisible(true))
    dispatch(setClipActionDialogTarget(id))
  }, [dispatch, id]);

  if(!loaded && type.startsWith("text") && content){
    setLoaded(true)
    onLoad()
  }

  // https://material-ui.com/components/grid-list/
  return <div ref={ref} className={classes.GCI}
      style={{
      }}>
    <div style={{
            padding: "12px 12px 0",
          }}
        onClick={() => {
          if(type.startsWith("text")) return showTextClipPage()
          if(type.startsWith("image")){
            dispatch(setOverlayContent({ type, content: objectURL }))
            dispatch(setOverlayVisible(true))
          }
          if(type === "application/vnd.google-apps.folder"){
            dispatch(changeParents([ ...path, id ]))
          }
        }}>
      <div className={classes.content}>
        {
          type.startsWith("text") ? (
            <div ref={textContentRef} className={classes.text_style}>
              {content}
            </div>
          ): type.startsWith("image") ? (
            <object data={objectURL} type={type} onLoad={() => {
              if(!loaded){
                setLoaded(true);
                onLoad()
              }
            }} style={{
              display: "inline-block",
              width: "100%", height: "100%",
              maxHeight: "280px",
              objectFit: "contain",
            }} />
          ): type === "application/vnd.google-apps.folder" ? (
            <div style={{
              display: "flex",
              alignItems: "center"
            }}>
              <FolderIcon />
              <span className={classes.text_style}
                  style={{
                    fontSize: "2em"
                  }}>{name}</span>
            </div>
          ): (
            "[Loading ...]"
          )
        }
      </div>
    </div>
    <div className={classes.action_area}>
      <Button onClick={showActionDialog}
          className={classes.action_area_button}
          color="primary"
          style={{
            maxWidth: "50%",
            paddingLeft: "0px",
          }}>
        <MoreVertIcon />
        <span className={classes.filename_button_text}>
          {name}
        </span>
      </Button>
      <Button color="primary"
          className={classes.action_area_button}
          onClick={() => dispatch(deleteItem(id))}>
        Delete
      </Button>
      { type ? (
        type.startsWith("text") ?
          <Button color="primary"
            className={classes.action_area_button}
              onClick={() => {
                let selection = window.getSelection()
                let range = document.createRange()
                range.selectNodeContents(textContentRef.current)
                selection.removeAllRanges();
                selection.addRange(range);

                // document.execCommand("copy")
                navigator.clipboard.writeText(content).then(() => {
                  console.log("copy success!");
                }, (e) => {
                  console.log("copy failed:", e)
                });
                selection.removeAllRanges();

                setSnackbarContent("text copied to clipboard!")
                setShowSnackbar(true)
              }}>
            Copy
          </Button> :
        type.startsWith("image") ?
          <Button size="small" color="primary"
              className={classes.action_area_button}
              onClick={() => {}}>
            Save
          </Button> : undefined
      ) : undefined}
    </div>
    <Snackbar show={showSnackbar}
        onClose={() => { setShowSnackbar(false) }}
        timeout={2000} >
      { snackbarContent }
    </Snackbar>
  </div>;
};

export default GoogleClipItem;
