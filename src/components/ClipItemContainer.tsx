
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import GoogleClipItem from "./GoogleClipItem";

//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from "../logic/rootReducer";

import {
  addDisplayedClipItem,
  setDisplayedClipItems,
  removeDisplayedClipItem,
  addCachedClipItem,
  setCachedClipItemInfo,
  removeCachedClipItem,
} from "../logic/clipItemSlice"
import Masonry from "../lib/masonry";


import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";

import CloseIcon from "@material-ui/icons/Close";
import { XS, SM, MD, LG, XL } from "../lib/media_queries";
import { debounce } from "../util";
import NewUserButton from "./NewUserButton";


function getCols(){
  let width = window.innerWidth || document.body.clientWidth;
  switch(true){
  case width < SM:
    return 1;
  case width < MD:
    return 2;
  case width < LG:
    return 3;
  case width < XL:
    return 4;
  case width >= XL:
    return 5;
  default:
    return 2;
  }
}

const refreshDelay = 1000;

const ClipItemContainer = (props: any) => {
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const list: string[] = useSelector((state: RootState) => {
      return state.clipItem.displayedClipItemsID
  });
  const [ cols, setCols ] = useState(getCols());
  const resizeListener = debounce((e: React.SyntheticEvent) => {
    if(!ref.current) return;
    let newCol = getCols();
    if(cols != newCol){
      setCols(newCol)
      setTimeout(ref.current.refreshLayout, 100)
      // 200 is an arbitrary number, large enough to wait afte setCols
    } else{
      ref.current.refreshLayout();
    }
  }, 200)

  React.useEffect(() => {
    resizeListener()
  }, [ list ])

  React.useLayoutEffect(() => {
    window.addEventListener("resize", resizeListener);
    return () => {
      console.log("%cuseEffect cleanup", "color: #ada");
      window.removeEventListener("resize", resizeListener);
    };
  }, [ cols ]);

  return <Container style={{
        position: "absolute"
      }}>{
    list.length === 0 ?
    <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
      [ No Content ]
    </div> :
    <Masonry ref={ref} colMinWidth="100px"
        balanceColumns={true} hgap={15} cols={cols}>{
      list.map((id: string) => (
        <GoogleClipItem key={id} id={id} onLoad={() => {
          console.log("GoogleClipItem onload fired");
          const refresh = () => {
            if(ref.current){
              ref.current.refreshLayout()
            } else{
              setTimeout(refresh, refreshDelay);
            }
          };
          setTimeout(refresh, refreshDelay);
        }} />
      ))
    }</Masonry>
  }</Container>;
};

export default ClipItemContainer;
