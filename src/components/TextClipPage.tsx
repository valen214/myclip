
import React, { useState, useEffect } from "react";

import { sizing } from '@material-ui/system';
import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import Dialog from "@material-ui/core/Dialog";
import InputBase from "@material-ui/core/InputBase";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from '@material-ui/core/transitions';

import DoneIcon from "@material-ui/icons/Done";

import InputBar from "./InputBar";

const Transition = React.forwardRef<unknown, TransitionProps>(
    (props: any, ref: any) => (<Slide direction="up" ref={ref} {...props} />)
);

const TextClipPage = ({ open, onClose, onDone }: any) => {
  const [ title, setTitle ] = useState("");
  const [ value, setValue ] = useState("");

  return <Dialog fullScreen
      open={open}
      TransitionComponent={Transition}>
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      <InputBar
          position="static"
          onInputClose={onClose}
          onInputChange={setTitle}
          onInputDone={() => onDone(title, value)}
          placeholder="Title (Optional)" />
      <Box width="100%" height="100%">
        <InputBase
            multiline fullWidth
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setValue(e.currentTarget.value);
            }}
            style={{ resize: "none", }} />
      </Box>
    </Box>
  </Dialog>;
};

export default TextClipPage;
