
import React, { useState, useEffect } from "react";

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import TextAreaAutosize from "@material-ui/core/TextAreaAutosize";
import { TransitionProps } from '@material-ui/core/transitions';

import DoneIcon from "@material-ui/icons/Done";

import TopNav, { TopNavMode } from "./TopNav";

const Transition = React.forwardRef<unknown, TransitionProps>(
    (props: any, ref: any) => (<Slide direction="up" ref={ref} {...props} />)
);

const TextClipPage = ({ open, onClose, onDone }: any) => {
  const [ title, setTitle ] = useState("");
  const [ value, setValue ] = useState("");

  return <Dialog fullScreen
      open={open}
      TransitionComponent={Transition}>
    <TopNav
        position="static"
        mode={TopNavMode.input}
        onClose={onClose}
        onChange={setTitle}
        onDone={() => onDone(title, value)}
        doneIcon={<DoneIcon />}
        placeholder="Title (Optional)" />
    <TextAreaAutosize
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          setValue(e.currentTarget.value);
        }}
        style={{ height: "500px", width: "500px" }} />
  </Dialog>;
};

export default TextClipPage;
