
//@ts-ignore
import React from 'react';


import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

type PropsType = {
  onClick: (e: React.MouseEvent<HTMLElement>) => any
  children?: React.ReactNode
  edge?: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  button: {
    cursor: "pointer",
    padding: 12,
    display: "inline-flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "transparent",
    "&:hover": {
      // "&>span": {
        background: "rgba(0, 0, 0, 0.1)"
      // }
    }
  },
  overlay: {
    display: "inline-block",
    position: "absolute", width: "100%", height: "100%",
    pointerEvents: "none", zIndex: -1,
    borderRadius: "50%",
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
}));




const Button = React.forwardRef((props: PropsType, ref?: React.Ref) => {
  const classes = useStyles({})
  const _ref = React.useRef(null)
  ref = ref || _ref;

  const overlayRef = React.useRef(null);

  return <div ref={ref} className={classes.button} {...props}
      style={{
        ...(props.edge == "left" ? { marginLeft: -12 } : {})
      }}
      onPointerDown={(e: React.PointerEvent<HTMLElement>) => {

      }}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        props.onClick(e);
      }}>
    <span ref={overlayRef} className={classes.overlay}></span>
    { props.children }
  </div>
});

export default Button;