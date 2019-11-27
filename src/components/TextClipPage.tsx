

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

import Box from '@material-ui/core/Box';
import InputBase from "@material-ui/core/InputBase";
import Slide from "@material-ui/core/Slide";
import AppBar from '@material-ui/core/AppBar';
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ToolBar from '@material-ui/core/ToolBar';

import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from '@material-ui/icons/Done';


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
  
  console.log("TextClipPage title:", title);

  return <Slide in={visible} direction="up">
    <div style={{
          pointerEvents: visible ? "all" : "none",
          display: "flex", flexDirection: "column",
          width: "100%", height: "100%", position: "fixed",
          zIndex: 1200, background: "white",
        }}>
      <AppBar position="sticky">
        <ToolBar>
          <IconButton edge="start" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <TextField
              key={title}
              defaultValue={title}
              placeholder="Title (Optional)"
              onChange={(e: React.FormEven<HTMLInputElement>) => {
                // dispatch(setTitle(e.currentTarget.value))
              }}
              onBlur={(e: React.FormEven<HTMLInputElement>) => {
                dispatch(setTitle(e.currentTarget.value))
              }}
              style={{ flex: 1 }} margin="dense" />
          <IconButton edge="end" onClick={() => {
                dispatch(uploadOrUpdateClipItem({
                  id: (target as string),
                  name: title,
                  type: "text/plain",
                  content,
                }))
                onClose()
              }}>
            <DoneIcon />
          </IconButton>
        </ToolBar>
      </AppBar>
      <Box display="flex" flexGrow={1} style={{
            padding: 15,
          }}>
        <InputBase
          key={content}
          defaultValue={content}
          multiline fullWidth
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            // dispatch(setContent(e.currentTarget.value))
          }}
          onBlur={(e: React.FormEvent<HTMLInputElement>) => {
            dispatch(setContent(e.currentTarget.value))
          }}
          inputProps={{
            style: {
            }
          }}
          style={{
            padding: "2px",
            alignItems: "start",
            height: "100%",
            overflow: "auto",
            resize: "none",
            background: "#eee",
            fontFamily: "Consolas",
          }} />
      </Box>
    </div>
  </Slide>;
};

export default React.memo(TextClipPage);
