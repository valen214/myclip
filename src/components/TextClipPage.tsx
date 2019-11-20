

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
  uploadOrUpdateClipItem,
} from "../logic/clipItemSlice"

import { makeStyles, Theme, createStyles }
    from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import Dialog from "@material-ui/core/Dialog";
import InputBase from "@material-ui/core/InputBase";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from '@material-ui/core/transitions';

import InputBar from "./InputBar";


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
  
  return <Slide in={visible} direction="up">
    <div style={{
          pointerEvents: visible ? "all" : "none",
          display: "flex", flexDirection: "column",
          width: "100%", height: "100%", position: "fixed",
          zIndex: 1200, background: "white",
        }}>
      <InputBar
          position="sticky"
          onInputBarClose={onClose}
          // onInputChange={(text: string) => dispatch(setTitle(text))}
          onBlur={(e: React.FormEven<HTMLInputElement>) => {
            dispatch(setTitle(e.currentTarget.value))
          }}
          onInputDone={() => {
            dispatch(uploadOrUpdateClipItem({
              id: (target as string),
              name: title,
              type: "text/plain",
              content,
            }))
            onClose()
          }}
          placeholder="Title (Optional)"
          defaultValue={title} />
      <Box display="flex" flexGrow={1} style={{
            padding: 15,
          }}>
        <InputBase
          defaultValue={content}
          multiline fullWidth
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            // dispatch(setContent(e.currentTarget.value))
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
    </div>
  </Slide>;
};

export default React.memo(TextClipPage);
