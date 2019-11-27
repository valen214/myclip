
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from "../logic/rootReducer";

import {
  deleteClipItem,
  changeParents,
} from "../logic/clipItemSlice"
import {
  setVisible as setClipActionDialogVisible,
  setTarget as setClipActionDialogTarget,
} from "../logic/clipActionDialogSlice";
import {
  setVisible, setTarget, setTitle, setContent
} from "../logic/textClipPageSlice";
import {
  setVisible as setOverlayVisible, setContent as setOverlayContent
} from "../logic/functionalOverlaySlice"


import Button from '@material-ui/core/Button';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from '@material-ui/core/CardContent';
import GridListTile from "@material-ui/core/GridListTile";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import CloseIcon from "@material-ui/icons/Close";
import FolderIcon from '@material-ui/icons/Folder';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Snackbar from "./Snackbar";
const useStyles = makeStyles((theme: Theme) => createStyles({
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

  displayed_text: {
    fontFamily: "Consolas",
    padding: "5px 2px",
    wordBreak: "break-all",
    whiteSpace: "pre-wrap",
  }
}));

export interface ClipItem {
  id?: string;
};

const GoogleClipItem = ({
  id, onLoad = () => {}
}: {
  id: string
  onLoad?: () => void
}) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const textContentRef = React.useRef()
  const [ loaded, setLoaded ] = useState(false);
  const [ showSnackbar, setShowSnackbar ] = useState(false)
  const [ snackbarContent, setSnackbarContent ] = useState("");
  const parents = useSelector(
    (state: RootState) => state.clipItem.parents
  )
  const { id: _id, name, content, type = "" } =
      useSelector((state: RootState) => {
          if(Object.prototype.hasOwnProperty.call(
                state.clipItem.cachedClipItems, id)){
            return state.clipItem.cachedClipItems[id]
          } else{
            return { id }
          }
      });
  console.assert(id === _id);

  const showTextClipPage = React.useCallback(() => {
    dispatch(setVisible(true))
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
  return <Card className={classes.GCI}
      style={{
      }}>
    <CardActionArea style={{
            padding: "12px 12px 0",
          }}
        onClick={() => {
          if(type.startsWith("text")) return showTextClipPage()
          if(type.startsWith("image")){
            dispatch(setOverlayContent({ type, content }))
            dispatch(setOverlayVisible(true))
          }
          if(type === "application/vnd.google-apps.folder"){
            dispatch(changeParents([ ...parents, id ]))
          }
        }}>
      <CardContent style={{
            padding: "0 5px 0 5px",
            background: "#dfd", width: "100%",
            maxHeight: "280px", overflow: "hidden",
            display: "inline-block",
          }}>
        {
          type.startsWith("text") ? (
            <div ref={textContentRef} className={classes.displayed_text}>
              {content}
            </div>
          ): type.startsWith("image") ? (
            <object data={content} type={type} onLoad={() => {
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
              <span className={classes.displayed_text}
                  style={{
                    fontSize: "2em"
                  }}>{name}</span>
            </div>
          ): (
            "[Loading ...]"
          )
        }
      </CardContent>
    </CardActionArea>
    <CardActions>
      <Button onClick={showActionDialog}
          size="small" color="primary"
          startIcon={<MoreVertIcon />}
          style={{
            maxWidth: "50%",
          }}>
        <Typography style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "none",
              fontWeight: 600,
              lineHeight: 1.75,
              fontSize: "0.8125rem",
            }}>
          {name}
        </Typography>
      </Button>
      <Button size="small" color="primary"
          onClick={() => dispatch(deleteClipItem(id))}>
        Delete
      </Button>
      { type ? (
        type.startsWith("text") ?
          <Button size="small" color="primary"
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
              onClick={() => {}}>
            Save
          </Button> : undefined
      ) : undefined}
    </CardActions>
    <Snackbar show={showSnackbar}
        onClose={() => { setShowSnackbar(false) }}
        timeout={2000} >
      { snackbarContent }
    </Snackbar>
  </Card>;
};

export default GoogleClipItem;
