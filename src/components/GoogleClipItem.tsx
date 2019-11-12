
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

  useEffect(() => {
    (async () => {
      const t = await GDL.getFileAsText(id);
      setText(t);
    })();

  }, [id]);

  // https://material-ui.com/components/grid-list/
  return <div style={{ fontFamily: "Consolas",
      wordBreak: "break-all", whiteSpace: "pre-wrap", // important
      background: "#dfd", width: "100%" }}>
    {text}
  </div>;
};

export default GoogleClipItem;
