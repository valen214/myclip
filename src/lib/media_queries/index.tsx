
//@ts-ignore
import React, { useState, useMemo, useEffect } from "react"

export const [ XS, SM, MD, LG, XL ] = [ 0, 600, 960, 1280, 1920 ];

export enum breakpoints {
  xs = XS,
  sm = SM,
  md = MD,
  lg = LG,
  xl = XL,
};

export const [ xs, sm, md, lg, xl ] = [
  breakpoints.xs,
  breakpoints.sm,
  breakpoints.md,
  breakpoints.lg,
  breakpoints.xl,
];

const matchMedia_breakpoints = [xs, sm, md, lg, xl].map((v, i) => {
  return window.matchMedia(`(min-width: ${v}px)`);
});

const breakpointStateSetListeners = new Map()
matchMedia_breakpoints.forEach((mediaQ, i) => {
  mediaQ.addListener(e => {
    for(let [ bpsToggle, setBpsToggle ] of
        breakpointStateSetListeners.entries()){
      let l = bpsToggle.map(
          (b: boolean, j: number) => (
              i == j ? e.matches : b))
      setBpsToggle([...l])
      console.log("??");
    }
  })
});

export const useBreakpoint = (): breakpoints => {
  const [ bpsToggle, setBpsToggle ] = useState(useMemo(() => {
      return matchMedia_breakpoints.map(e => e.matches)
  }, []));

  useEffect(() => {
    breakpointStateSetListeners.set(bpsToggle, setBpsToggle);
    return () => {
      breakpointStateSetListeners.delete(bpsToggle);
    }
  }, []);

  return [ xs, sm, md, lg, xl ][bpsToggle.lastIndexOf(true)];
}