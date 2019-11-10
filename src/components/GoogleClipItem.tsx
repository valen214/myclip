
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

const GoogleClipItem = ({
  item
}: any) => {
  const [ text, setText ] = useState("");

  console.log(`create clip_item(id=${item.id})`);

  useEffect(() => {
    (async () => {
      const t = await GDL.getFileAsText(item.id);
      setText(t);
    })();

  });

  // https://material-ui.com/components/grid-list/
  return <GridListTile>
    <Typography>
      {text}
    </Typography>
  </GridListTile>;
};

export default GoogleClipItem;
