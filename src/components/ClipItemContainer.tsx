
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

const throttle = (
  delay: number, func: () => void,
) => (
    nextRefreshCycleBegin: number,
    setNextRefreshCycleBegin: (arg0:　number) => void
  ) =>{
    let now = Date.now()
    if(now < nextRefreshCycleBegin) return
    func()
    setNextRefreshCycleBegin(Date.now() + delay);
};
const debounce = (
  delay: number, func: () => void,
) => {
  let timeoutId;
  return (...args) => {
    if(timeoutId){
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  }
};

const ClipItemContainer = (props: any) => {
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const list: string[] = useSelector((state: RootState) => {
      return state.clipItem.displayedClipItemsID
  });
  const breakpoint = useBreakpoint();
  const [ cols, setCols ] = useState(2);
  const [
      nextRefreshCycleBegin, setNextRefreshCycleBegin
  ] = React.useState(Date.now())

  useEffect(() => {
    let timeoutId;
    let updateColOnResize = () => {
      let bpi = [xs, sm, md, lg, xl].indexOf(breakpoint)
      setCols([2, 2, 3, 4, 5][bpi]);
      timeoutId = null;
    }
    if(Date.now() < nextRefreshCycleBegin){
      if(timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateColOnResize, 1000)
    } else{
      updateColOnResize();
    }
  }, [ breakpoint ]);

  useEffect(() => {
    const behavior = ["throttle", "debounce"][1];
    let timeoutId: number;
    let resizeListener = () => {
      let now = Date.now();
      switch(behavior){
      case "throttle":
        if(now < nextRefreshCycleBegin) return;
        break;
      case "debounce":
        if(now < nextRefreshCycleBegin){
          setNextRefreshCycleBegin(now + 1000); // ms
          if(timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(resizeListener, 1010);
          return;
        }
        break;
      default:
        console.warning("constantly emitted resize event");
      }
      ref.current.refreshLayout();
      setNextRefreshCycleBegin(Date.now() + 1000); // ms
    };
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
      if(timeoutId) clearTimeout(timeoutId);
    };
  }, [nextRefreshCycleBegin]);

  return <Container>
    <Masonry ref={ref} colMinWidth="100px"
        balanceColumns={true} hgap={15} cols={cols}>
      {list.map((id: string) => (
        <GoogleClipItem key={id} id={id} onLoad={() => {
            ref.current.refreshLayout();
        }}/>
      ))}
    </Masonry>
  </Container>;
};

export default ClipItemContainer;
