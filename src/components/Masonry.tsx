
//@ts-ignore
import React from "react"
//@ts-ignore
import ReactDOM from "react-dom"


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
  rects, config: { mode, cols, vgap }
}: {
  rects?: Array<Partial<DOMRect>>
  config?: { mode: string, cols?: number, vgap?: number }
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

const Masonry = React.forwardRef(({
  cols,
  colMaxWidth,
  colMinWidth,
  balanceColumns,
  children,
  ...props
}: {
  cols?: number
  colMinWidth?: number | string
  colMaxWidth?: number | string
  balanceColumns?: boolean
  children?: React.ReactNode
} = {}, ref?: React.Ref) => {
  const _ref = React.useRef();
  ref = ref || _ref;

  const parentStyle = {
    position: "relative"
  }

  const refresh_layout = React.useCallback(() => {
    let max_indexed = 0, unindexed = 0;
    let allChild: HTMLCollection = ref.current.children;
    for(let child of allChild){
      if(child instanceof HTMLElement){
        let j = child.dataset.masonry_index
        if(j){
          let k = parseInt(j);
          if(k > max_indexed) max_indexed = k;
          delete child.dataset.masonry_unordered;
        } else{
          child.dataset.masonry_unordered = String(++unindexed);
        }
      } else{
        console.warn("Masonry:", child, "is not an instance of HTMLElement");
      }
    }

    const calibratedMasonryIndex = (elem: Partial<HTMLElement>) => {
      let i = elem.dataset.masonry_index
      if(i){
        return parseInt(i);
      } else{
        return max_indexed + parseInt(elem.dataset.masonry_unordered);
      }
    }
    Array.from(allChild).sort((a, b) => (
        calibratedMasonryIndex(a) - calibratedMasonryIndex(b)
    )).forEach(elem => ref.current.appendChild(elem))

    // children.length
    let rects = Array.prototype.map.call(allChild,
        (elem: HTMLElement, i: number) => {
            elem.dataset.masonry_index = String(i)
            return elem.getBoundingClientRect();
    })
    let col_y = masonryAlgo({
        rects,
        config: {
          mode: "columns",
          cols: 2,
          vgap: 10,
        }
    });

    let len = allChild.length;
    while(--len >= 0){
      let child: Partial<HTMLElement> = allChild[len];
      let [ col, height ] = col_y[len];
      Object.assign(child.style, {
        width: "48%", position: "absolute",
        left: `calc(${col} * 50%)`,
        top: height + "px",
        marginLeft: "1%",
      });
      console.log(col, height);
    }
  });

  React.useEffect(() => {
    refresh_layout();
  }, [children]);

  return <div ref={ref} {...props} style={parentStyle as React.CSSProperties}>
    {(
      (colMinWidth && balanceColumns) ?
      <React.Fragment>
        { children }
      </React.Fragment>
      :
      (console.warn("Masonry: not implemented"), "")
    )}
  </div>
});
export default Masonry;