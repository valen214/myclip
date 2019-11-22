
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
import { xs, sm, md, lg, xl, useBreakpoint } from "../lib/media_queries";


const ClipItemContainer = (props: any) => {
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const list: string[] = useSelector((state: RootState) => {
      return state.clipItem.displayedClipItemsID
  });
  const breakpoint = useBreakpoint();
  const [ cols, setCols ] = useState(2);

  useEffect(() => {
    let bpi = [xs, sm, md, lg, xl].indexOf(breakpoint)
    setCols([2, 2, 3, 4, 5][bpi]);
  }, [ breakpoint ]);

  useEffect(() => {
    let nextCycleBegin = Date.now();
    let resizeListener = () => {
      let now = Date.now();
      if(now < nextCycleBegin) return;
      nextCycleBegin = now + 100; // ms
      ref.current.refreshLayout();
    };
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return <Container>
    <Masonry ref={ref} colMinWidth="100px"
        balanceColumns={true} hgap={15} cols={cols}>
      {list.map((id: string) => (
        <GoogleClipItem key={id} id={id} onLoad={() => {
            setTimeout(() => ref.current.refreshLayout(), 0);
        }}/>
      ))}
    </Masonry>
  </Container>;
};

export default ClipItemContainer;
