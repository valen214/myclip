
//@ts-ignore
import React from 'react';

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

type PropsType = {
  onClick: (e: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode
  edge?: string
  style?: { [k: string]: any }
  overlayStyle?: { [k: string]: any }
  square?: boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    cursor: "pointer",
    padding: 12,
    position: "relative",
    borderRadius: "50%",
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
    }
  },
  overlay: {
    display: "inline-block",
    position: "absolute", width: "100%", height: "100%",
    pointerEvents: "none", zIndex: 1,
    borderRadius: "50%",
    // https://jsfiddle.net/xvalen214x/7rLmu9oq/41/show
    background: "radial-gradient(rgba(0, 0, 0, 0) 20%, " +
        "rgba(255, 255, 255, 0.3) 35%, rgba(255, 255, 255, 0.2) 100%)",
    // background: "repeating-radial-gradient(rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.3) 80% 82%, rgba(255, 255, 255, 0.8) 82% 84%)",
    opacity: 0,
  },
}));




const Button = React.forwardRef(({
  onClick,
  children,
  edge,
  style,
  overlayStyle,
  square = false,
  ...props
}: PropsType, ref?: React.Ref) => {
  const classes = useStyles({})
  const _ref = React.useRef(null)
  ref = ref || _ref;

  const overlayRef = React.useRef(null);
  return <div ref={ref} className={classes.button} {...props}
      style={{
        ...(edge == "left" ? { marginLeft: -12 } : {}),
        ...style,
        ...(square && { borderRadius: "0" }),
      }}
      onPointerDown={(e: React.PointerEvent<HTMLElement>) => {
        let rect = ref.current.getBoundingClientRect(); // parent
        Object.assign(overlayRef.current.style, {
          left: (e.clientX - rect.left - rect.width/2) + "px",
          top: (e.clientY - rect.top - rect.height/2) + "px",
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
      }}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        if(typeof onClick === "function") onClick(e);
      }}>
    <span ref={overlayRef}
        className={classes.overlay}
        style={{
          ...overlayStyle,
          ...(square && { borderRadius: "0" }),
        }}>
      </span>
    { children }
  </div>
});

export default Button;