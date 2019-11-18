
//@ts-ignore
import React from "react";

import AppBar from '@material-ui/core/AppBar';
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ToolBar from '@material-ui/core/ToolBar';

import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from '@material-ui/icons/Done';

const InputBar = ({
      onInputBarClose, onInputChange, onInputDone,
      position, doneIcon = (<DoneIcon />),
      placeholder = "", value, onBlur, defaultValue
}: any) => {

  return <AppBar position={position}>
    <ToolBar>
      <IconButton edge="start" onClick={onInputBarClose}>
        <CloseIcon />
      </IconButton>
      <TextField {...{ position, value, onBlur, defaultValue }}
          onChange={onInputChange}
          style={{ flex: 1 }} margin="dense"/>
      <IconButton edge="end" onClick={onInputDone}>
        {doneIcon}
      </IconButton>
    </ToolBar>
  </AppBar>;
};

export default InputBar;
