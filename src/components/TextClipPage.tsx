

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
  uploadItem,
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
  const ref = React.useRef();

  const onClose = React.useCallback(() => {
    dispatch(setVisible(false))
    dispatch(setTarget(""))
    dispatch(setTitle(""))
    dispatch(setContent(""))
    Object.assign(ref.current.style, {
      top: null,
      left: null,
      width: null,
      height: null,
      opacity: "0",
    })
  }, [dispatch]);
  
  console.log("TextClipPage title:", title);

  React.useEffect(() => {
    if(typeof visible === "boolean"){

    } else{
      setTimeout(() => {
        Object.assign(ref.current.style, {
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          opacity: "1",
        })
      }, 200);
    }
  }, [ visible ]);
  console.log("TEXTCLIPPAGE RERENDER");

  return <div ref={ref} style={{
        pointerEvents: visible ? "all" : "none",
        opacity: 0,
        display: visible ? "flex" : "none",
        flexDirection: "column",
        ...(typeof visible === "boolean" ? {
            width: "100%", height: "100%"
        } : visible),
        position: "fixed",
        zIndex: 1200,
        background: "white",
        transition: "top 0.2s 0.1s, left 0.2s 0.1s, " +
                    "width 0.2s 0.1s, height 0.2s 0.1s, opacity 0.3s",
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
              dispatch(uploadItem({
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
    <div style={{
          padding: 15,
          display: "flex", flexGrow: 1,
          width: "100%", height: "100%",
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
            width: "100%",
            height: "100%",
            overflow: "auto",
          }
        }}
        style={{
          padding: "2px",
          alignItems: "start",
          width: "100%",
          height: "100%",
          overflow: "auto",
          resize: "none",
          background: "#eee",
          fontFamily: "Consolas",
        }} />
    </div>
  </div>;
};

export default React.memo(TextClipPage);
