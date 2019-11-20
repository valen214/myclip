
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from "../logic/rootReducer";

import {
  addDisplayedClipItem,
  setDisplayedClipItems,
  removeDisplayedClipItem,
  addCachedClipItem,
  setCachedClipItemInfo,
  removeCachedClipItem,
  deleteClipItem,
} from "../logic/clipItemSlice"
import {
  setVisible as setClipActionDialogVisible,
  setTarget as setClipActionDialogTarget,
} from "../logic/clipActionDialogSlice";
import {
  setVisible, setTarget, setTitle, setContent
} from "../logic/textClipPageSlice";


import Button from '@material-ui/core/Button';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from '@material-ui/core/CardContent';
import GridListTile from "@material-ui/core/GridListTile";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from '@material-ui/icons/MoreVert';


export interface ClipItem {
  id?: string;
};

const GoogleClipItem = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
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
  }, [dispatch, id, name, content]);

  const showActionDialog = React.useCallback(() => {
    dispatch(setClipActionDialogVisible(true))
    dispatch(setClipActionDialogTarget(id))
  }, [dispatch, id]);

  // https://material-ui.com/components/grid-list/
  return <Card raised
      style={{
        height: "auto",
        cursor: "pointer",
        background: "#ffd",
      }}>
    <CardActionArea
        onClick={( type.startsWith("text") ? showTextClipPage : () => {} )} >
      <CardContent style={{
            padding: "12px",
          }}>
        <div
          style={{ // important
            background: "#dfd", width: "100%",
            maxHeight: "280px", overflow: "hidden", }}>
          {
            type.startsWith("text") ? 
              <div style={{
                  fontFamily: "Consolas", padding: "5px 2px",
                  wordBreak: "break-all", whiteSpace: "pre-wrap", }}>
                {content}
              </div> :
            type.startsWith("image") ?
              <img src={content} style={{
                width: "100%", height: "100%",
              }} /> :
            "[Loading ...]"
          }
        </div>
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
              onClick={() => {}}>
            Copy
          </Button> :
        type.startsWith("image") ?
          <Button size="small" color="primary"
              onClick={() => {}}>
            Save
          </Button> : undefined
      ) : undefined}
    </CardActions>
  </Card>;
};

export default GoogleClipItem;
