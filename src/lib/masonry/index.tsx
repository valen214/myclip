
//@ts-ignore
import React from "react"
import { createUseStyles } from 'react-jss'

const useCallbackRef = () => {
  const [ref, setRef] = React.useState(null);
  React.useCallback((node: HTMLElement) => {
    setRef(node);
  }, []);
  return { current: ref };
}

/**
 * ALERT! Danger Ahead:
 * the below code consists of over-engineered and over-complicated algorithms
 * that should have been expected to be used ONLY in competitive programming
 * ( or potentially gaming industry) but NOT DOM manipulations where,
 * in most cases, do NOT have >1000 of elements floating around.
 * 
 * Even worse, this single function consist of MULTIPLE algorithms with
 * little reusable components, optimization is unnecessary and improbable
 **/
const masonryAlgo = ({
  rects, config: { mode, cols, vgap, hgap }
}: {
  rects?: Array<Partial<DOMRect>>
  config?: {
    mode: string, cols?: number,
    vgap?: number, hgap?: number | string
  }
} = {}) => {
  switch(mode){
  case "columns":
    /*
    the optimal solution is NP-hard so No, BYE

    instead, the implementation now:
    fill from the first into the smallest bucket one by one
    */
    let cols_height = Array.from({ length: cols }, (e, i) => [i, 0]);
    let rect_pos = rects.map(({ height: h }) => {
        let out = cols_height[0].slice();
        cols_height[0][1] += h + vgap;
        cols_height.sort((l, r) => l[1] - r[1]);
        return out;
    });
    return rect_pos;
  default:
    console.warn("Masonry: not implemented");
  }
}


const useStyles = createUseStyles({
  masonry: {
    "& > div": {
      position: "absolute",
      width: "var(--masonry-child-width, 50%)",
      transition: "top 0.2s, left 0.2s",
    }
  }
})

const Masonry = React.forwardRef(({
  cols = 2,
  hgap = 15,
  vgap = 15,
  colMaxWidth,
  colMinWidth,
  balanceColumns,
  children,
  ...props
}: {
  cols?: number
  hgap?: number
  vgap?: number
  colMinWidth?: number | string
  colMaxWidth?: number | string
  balanceColumns?: boolean
  children?: React.ReactNode
} = {}, ref?: React.Ref) => {
  const classes = useStyles()
  const selfRef = React.useRef();
  const [ parentStyle, setParentStyle ] = React.useState({
      position: "relative"
  })

  const refreshLayout = () => {
    let begin = performance.now();
    // console.log("Masonry.refreshLayout() invoked");
    selfRef.current.refreshLayout = refreshLayout;

    let allChild: HTMLCollection = selfRef.current.children;

    let rects: Array<{ height: number }> =
        Array.prototype.map.call(allChild,
            (elem: HTMLElement, i: number) => {
                return { height: elem.offsetHeight };
            }
        );

    if(typeof hgap === "number"){
      // hgap = String(hgap) + "px"
    } else if(typeof hgap === "string"){

    }
    let config = {
      mode: "columns",
      cols,
      vgap,
      hgap, // algo will fail if hgap is not number
    }
    let col_y = masonryAlgo({
        rects,
        config
    });

    let _hgap = String(hgap) + "px"
    let colWidth = `(100% - ${_hgap} * ${cols - 1}) / ${cols}`

    let parentHeight = 0;

    let len = allChild.length;
    while(--len >= 0){
      let child: Partial<HTMLElement> = allChild[len];
      let [ col, height ] = col_y[len];
      Object.assign(child.style, {
        // consider using css 'attr' and dataset in the future
        left: `calc(${col} * (${colWidth} + ${_hgap}))`,
        top: height + "px",
      });
      if(height + child.offsetHeight > parentHeight){
        parentHeight = height + child.offsetHeight;
      }
    }

    setParentStyle({
      ...parentStyle,
      height: (parentHeight + 50) + "px",
      "--masonry-child-width": `calc(${colWidth})`,
    })

    let spent = performance.now() - begin
    console.log("Masonry.refreshLayout() exiting, used:", spent, "ms");
  };

  React.useImperativeHandle(ref, () => ({
    refreshLayout
  }));

  React.useLayoutEffect(() => {
    refreshLayout();
  }, [ cols ]);
  // console.log("Masonry: cols:", cols);

  return <div ref={selfRef} {...props} className={classes.masonry}
      style={parentStyle as React.CSSProperties}>
    {(
      (colMinWidth && balanceColumns) ?
        children
      :
      (console.warn("Masonry: not implemented"), "")
    )}
  </div>
});
export default Masonry;