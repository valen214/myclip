
//@ts-ignore
import React from "react";
import Button from "./Button";

import { useSelector, useDispatch } from 'react-redux'

import { RootState } from "../logic/rootReducer";

import {
  ClipItem,
  uploadOrUpdateClipItem,
} from "../logic/clipItemSlice"
import Masonry from "../lib/masonry";

const tutorial_clip_items: Partial<ClipItem>[] = [
  {
    type: "text/plain",
    name: "Beginning",
    content: "",
  }, {
    type: "text/plain",
    name: "",
    content: "",
  }, {
    type: "text/plain",
    name: "",
    content: "",
  }
]


const NewUserButton = ({
}: any) => {
  const dispatch = useDispatch();
  const [ hide, setHide ] = React.useState(false);

  return <Button style={{
        borderRadius: "15px",
        border: "1px solid rgba(0, 0, 0, 0.5)",
        height: 300, width: 300,
        margin: "calc(50% - 150px) 0 0 calc(50% - 150px)",
        userSelect: "none",
        display: hide ? "none" : "block",
        opacity: hide ? 0 : 1,
      }} overlayStyle={{
        borderRadius: "50%", background: "white",
      }} onClick={() => {
        setHide(true);
        tutorial_clip_items.forEach(item => {
          dispatch(uploadOrUpdateClipItem(item))
        });
      }}>
    Feeling Empty? Click ME!
  </Button>;
};

export default NewUserButton;
