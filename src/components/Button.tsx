
//@ts-ignore
import React from 'react';

import { createUseStyles } from "react-jss";

type PropsType = {
  // onClick: (e: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode
  edge?: string
  style?: { [k: string]: any }
  overlayStyle?: { [k: string]: any }
  round?: boolean
  className?: string
}

const useStyles = createUseStyles({
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    border: "0",
    cursor: "pointer",
    padding: 12,
    position: "relative",
    borderRadius: "6px",
    background: "transparent",
    overflow: "hidden",
    "&:hover": {
      // "&>span": {
        background: "rgba(0, 0, 0, 0.1)"
      // }
    },
    "&:active": {
      // "&>span": {
        background: "rgba(0, 0, 0, 0.2)"
      // }
    },
    fontFamily: "Consolas",
  },
  overlay: {
    display: "inline-block",
    position: "absolute",
    width: "100%",
    // height: "100%",
    paddingBottom: "100%", // square size hack
    pointerEvents: "none", zIndex: 1,
    borderRadius: "50%",
    // https://jsfiddle.net/xvalen214x/7rLmu9oq/41/show
    background: "radial-gradient(rgba(0, 0, 0, 0) 20%, " +
        "rgba(255, 255, 255, 0.3) 35%, rgba(255, 255, 255, 0.2) 100%)",
    // background: "repeating-radial-gradient(rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.3) 80% 82%, rgba(255, 255, 255, 0.8) 82% 84%)",
    opacity: 0,
  },
});




const Button = React.forwardRef(({
  children,
  edge,
  style,
  overlayStyle,
  round = false,
  className = "",
  ...props
}: PropsType, ref?: React.Ref) => {
  const classes = useStyles({})
  const _ref = React.useRef(null)
  ref = ref || _ref;

  const [ pointerDown, setPointerDown ] = React.useState(false)

  const overlayRef = React.useRef(null);
  return <button ref={ref}
      className={classes.button + " " + className}
      {...props}
      style={{
        ...(edge == "left" ? { marginLeft: -12 } : {}),
        ...style,
        ...(round && { borderRadius: "50%" }),
      }}
      onPointerDown={(e: React.PointerEvent<HTMLElement>) => {
        setPointerDown(true)
        let rect = ref.current.getBoundingClientRect(); // parent
        console.log(e.clientX, rect)
        Object.assign(overlayRef.current.style, {
          left: (e.clientX - rect.left - rect.width/2) + "px",
          // rect.width instead of height because of the "square padding hack"
          top: (e.clientY - rect.top - rect.width/2) + "px",
          transform: "scale(0.25)",
          transition: "none",
          opacity: 1,
        });
        setTimeout(() => {
          Object.assign(overlayRef.current.style, {
            transform: "scale(3.0)",
            opacity: 0,
            transition: "transform 1s, opacity 1s",
          })
        }, 16);
      }}>
    <span ref={overlayRef}
        className={classes.overlay}
        style={{
          ...overlayStyle,
          ...(round && { borderRadius: "50%" }),
        }}>
      </span>
    { children }
  </button>
});

export default React.memo(Button);