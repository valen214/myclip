
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import { onClipItemClick } from "../actions/GoogleClipItem";


import React, { useState, useEffect } from "react";

import Box from '@material-ui/core/Box';
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography";

import CloseIcon from "@material-ui/icons/Close";

export interface ClipItem {
  id?: string;
};

const GoogleClipItem = (props: any) => {
  const { id } = props;
  const [ title, setTitle ] = useState("");
  const [ content, setContent ] = useState("");

  useEffect(() => {
    (async () => {
      const t = await GDL.getFileAsText(id);
      setContent(t);
    })();

  }, [id]);

  // https://material-ui.com/components/grid-list/
  return <Card raised
      onClick={() => onClipItemClick(id, title, content)}
      style={{
        height: "auto",
        overflow: "hidden",
        maxHeight: "300px",
        cursor: "pointer",
        background: "#ffd",
      }}>
    <CardContent style={{
          padding: "12px"
        }}>
      <div style={{ fontFamily: "Consolas",
          wordBreak: "break-all", whiteSpace: "pre-wrap", // important
          background: "#dfd", width: "100%" }}>
        {content}
      </div>
    </CardContent>
  </Card>;
};

export default GoogleClipItem;
