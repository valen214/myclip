
import React, { useState, useEffect } from "react";

import { useQuery } from "react-apollo";

import { connect } from "react-redux";

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
import { onDoneButtonClick, TextClipPageWrapper } from "../actions/TextClipPage";
import { TEXT_CLIP_PAGE_PROPERTIES } from "../constants/Query";

const Transition = React.forwardRef<unknown, TransitionProps>(
    (props: any, ref: any) => (<Slide direction="up" ref={ref} {...props} />)
);

const TextClipPage = ({
    onCloseButtonClick,
    onTitleChange,
    onContentChange,
    onContentBlur,
}: any) => {
  const {
    data: {
      components: {
        text_clip_page: {
          visible,
          target,
          title,
          content,
        }
      }
    }
  } = useQuery(TEXT_CLIP_PAGE_PROPERTIES);
  console.log("text_clip_page:", target, visible, title, content);

  return <Dialog fullScreen
      open={visible}
      TransitionComponent={Transition}>
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      <InputBar
          position="sticky"
          onInputBarClose={onCloseButtonClick}
          onInputChange={(text: string) => onTitleChange(text)}
          onInputDone={() => onDoneButtonClick(target, title, content)}
          placeholder="Title (Optional)"
          value={title} />
      <Box display="flex" flexGrow={1} style={{
            padding: 15,
          }}>
        <InputBase
          value={content}
          multiline fullWidth
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            onContentChange(e.currentTarget.value);
          }}
          onBlur={(e: React.FormEvent<HTMLInputElement>) => {
            onContentBlur(e.currentTarget.value);
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

export default TextClipPageWrapper(TextClipPage);
