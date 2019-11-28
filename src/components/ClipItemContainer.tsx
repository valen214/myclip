
//@ts-ignore
import GDL from "../GoogleDriveLibrary";
import GoogleClipItem from "./GoogleClipItem";

//@ts-ignore
import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from "../logic/rootReducer";

import Masonry from "../lib/masonry";


import Container from '@material-ui/core/Container';

import { XS, SM, MD, LG, XL } from "../lib/media_queries";
import { debounce } from "../util";


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

const MemoizedGoogleClipItem = React.memo(GoogleClipItem)

const ClipItemContainer = (props: any) => {
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const list: string[] = useSelector((state: RootState) => {
      return state.clipItem.displayedClipItemsID
  });
  const [ cols, setCols ] = useState(getCols());
  const resizeListener = 
    debounce((e: React.SyntheticEvent) => {
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

  const onItemLoad = React.useCallback(() => {
    console.log("GoogleClipItem onload fired");
    const refresh = () => {
      if(ref.current){
        ref.current.refreshLayout()
      } else{
        setTimeout(refresh, refreshDelay);
      }
    };
    setTimeout(refresh, refreshDelay);
  }, [ ref ]);

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
        <MemoizedGoogleClipItem key={id} id={id} onLoad={onItemLoad} />
      ))
    }</Masonry>
  }</Container>;
};

export default ClipItemContainer;
