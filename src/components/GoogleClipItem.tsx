
//@ts-ignore
import GDL from "../GoogleDriveLibrary";

import React, { useState, useEffect } from "react";

import Box from '@material-ui/core/Box';
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography";

import CloseIcon from "@material-ui/icons/Close";

export interface ClipItem {
  id?: string;
};

const GoogleClipItem = (props: any) => {
  const { id } = props;
  const [ text, setText ] = useState("");

  console.log(`create clip_item(id=${id})`);

  useEffect(() => {
    (async () => {
      const t = await GDL.getFileAsText(id);
      setText(t);
    })();

  }, [id]);

  // https://material-ui.com/components/grid-list/
  return <pre style={{ fontFamily: "Consolas",
      wordBreak: "break-all", whiteSpace: "pre-wrap",
      background: "#dfd", height: "auto", width: "100%" }}>
    {text}
  </pre>;
};

export default GoogleClipItem;
