
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import {
    onClipItemClick, onClipActionClick, deleteClipItem
} from "../actions/GoogleClipItem";
import { useFileContent } from "../actions/GoogleDriveFileHelper";



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
} from "../logic/clipItemSlice"


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
import {
  setVisible, setTarget, setTitle, setContent
} from "../logic/textClipPageSlice";


export interface ClipItem {
  id?: string;
};

const GoogleClipItem = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const { id: _id, name, content } = useSelector((state: RootState) => {
      if(Object.prototype.hasOwnProperty.call(
            state.clipItem.cachedClipItems, "id")){
        return state.clipItem.cachedClipItems[id]
      } else{
        return { id }
      }
  });
  console.assert(id === _id);

  const deleteButtonClick = React.useCallback(() => {
    dispatch(removeCachedClipItem(id));
    dispatch(removeDisplayedClipItem(id));
  }, [id]);

  const showTextClipPage = React.useCallback(() => {
    dispatch(setVisible(true))
    dispatch(setTarget(id))
    dispatch(setTitle(name))
    dispatch(setContent((content as string) || ""))
  }, [dispatch, id, name, content]);

  // https://material-ui.com/components/grid-list/
  return <Card raised
      style={{
        height: "auto",
        cursor: "pointer",
        background: "#ffd",
      }}>
    <CardActionArea
        onClick={showTextClipPage} >
      <CardContent style={{
            padding: "12px",
          }}>
        <div style={{ fontFamily: "Consolas", padding: "5px 2px",
            wordBreak: "break-all", whiteSpace: "pre-wrap", // important
            background: "#dfd", width: "100%",
            maxHeight: "280px", overflow: "hidden", }}>
          {content}
        </div>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <IconButton onClick={() => onClipActionClick(id)}
          size="small" color="primary">
        <MoreVertIcon />
      </IconButton>
      <Button size="small" color="primary" onClick={deleteButtonClick}>
        Delete
      </Button>
    </CardActions>
  </Card>;
};

export default GoogleClipItem;
