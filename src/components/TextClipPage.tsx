

//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from "../logic/rootReducer";

import {
  setVisible,
  setTitle,
  setContent,
  setTarget,
} from "../logic/textClipPageSlice";
import {
  addDisplayedClipItem,
  setDisplayedClipItems,
  removeDisplayedClipItem,
  addCachedClipItem,
  setCachedClipItemInfo,
  removeCachedClipItem,
  uploadClipItem,
} from "../logic/clipItemSlice"

import { sizing } from '@material-ui/system';
import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import Dialog from "@material-ui/core/Dialog";
import InputBase from "@material-ui/core/InputBase";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from '@material-ui/core/transitions';

import InputBar from "./InputBar";

const Transition = React.forwardRef<unknown, TransitionProps>(
    (props: any, ref: any) => (<Slide direction="up" ref={ref} {...props} />)
);

const TextClipPage = (props: any) => {
  const dispatch = useDispatch();
  const {
      visible, target, title = "", content = ""
  } = useSelector((state: RootState) => state.textClipPage);

  const onClose = React.useCallback(() => {
    dispatch(setVisible(false))
    dispatch(setTarget(""))
    dispatch(setTitle(""))
    dispatch(setContent(""))
  }, [dispatch]);
  
  return <Dialog fullScreen
      open={visible}
      TransitionComponent={Transition}>
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      <InputBar
          position="sticky"
          onInputBarClose={onClose}
          onInputChange={(text: string) => dispatch(setTitle(text))}
          onInputDone={() => {
            dispatch(uploadClipItem({
              id: (target as string),
              name: title,
              content,
            }))
            onClose()
          }}
          placeholder="Title (Optional)"
          value={title} />
      <Box display="flex" flexGrow={1} style={{
            padding: 15,
          }}>
        <InputBase
          value={content}
          multiline fullWidth
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            dispatch(setContent(e.currentTarget.value))
          }}
          onBlur={(e: React.FormEvent<HTMLInputElement>) => {
            dispatch(setContent(e.currentTarget.value))
          }}
          style={{
            alignItems: "start",
            resize: "none",
            background: "#eee",
            fontFamily: "Consolas",
          }} />
      </Box>
    </Box>
  </Dialog>;
};

export default React.memo(TextClipPage);
