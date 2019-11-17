
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import { onClipItemClick, onClipActionClick } from "../actions/GoogleClipItem";
import { useFileContent } from "../actions/GoogleDriveFileHelper";

//@ts-ignore
import React, { useState, useEffect } from "react";

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

const GoogleClipItem = ({ id }: any) => {
  const { name, content } = useFileContent(id);

  // https://material-ui.com/components/grid-list/
  return <Card raised
      style={{
        height: "auto",
        maxHeight: "300px",
        cursor: "pointer",
        background: "#ffd",
      }}>
    <CardActionArea
        onClick={() => onClipItemClick(id, name, content)} >
      <CardContent style={{
            padding: "12px",
            overflow: "hidden",
          }}>
        <div style={{ fontFamily: "Consolas", padding: "5px 2px",
            wordBreak: "break-all", whiteSpace: "pre-wrap", // important
            background: "#dfd", width: "100%" }}>
          {content}
        </div>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <IconButton onClick={() => onClipActionClick(id)}
          size="small" color="primary">
        <MoreVertIcon />
      </IconButton>
      <Button size="small" color="primary">
        Share
      </Button>
    </CardActions>
  </Card>;
};

export default GoogleClipItem;
