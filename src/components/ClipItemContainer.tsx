
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import GoogleClipItem from "./GoogleClipItem";

//@ts-ignore
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useAsync } from 'react-async-hook';

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


const ClipItemContainer = (props: any) => {
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const list: string[] = useSelector((state: RootState) => {
      return state.clipItem.displayedClipItemsID
  });
  const [ cols, setCols ] = useState(2);
  const resizeListener = debounce((e: React.SyntheticEvent) => {
    console.log("WINDOW RESIZE");
    let newCol;
    let width = window.innerWidth || document.body.clientWidth;
    switch(true){
    case width < SM:
      newCol = 1;
      break;
    case width < MD:
      newCol = 2;
      break;
    case width < LG:
      newCol = 3;
      break;
    case width < XL:
      newCol = 4;
      break;
    case width >= XL:
      newCol = 5;
      break;
    default:
    }

    if(cols != newCol){
      setCols(newCol)
      setTimeout(ref.current.refreshLayout, 200)
      // 200 is an arbitrary number, large enough to wait afte setCols
    } else{
      ref.current.refreshLayout();
    }
  }, 200)


  React.useLayoutEffect(() => {
    window.addEventListener("resize", resizeListener);
    return () => {
      console.log("%cuseEffect cleanup", "color: #ada");
      window.removeEventListener("resize", resizeListener);
    };
  });

  return <Container>
    <Masonry ref={ref} colMinWidth="100px"
        balanceColumns={true} hgap={15} cols={cols}>
      {list.map((id: string) => (
        <GoogleClipItem key={id} id={id} onLoad={() => {
            setTimeout(ref.current.refreshLayout, 200);
        }}/>
      ))}
    </Masonry>
  </Container>;
};

export default ClipItemContainer;
