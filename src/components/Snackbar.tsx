
//@ts-ignore
import React from 'react';

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
  snackbar: {
    cursor: "pointer",
    // padding: "6px 8px 8px 15px",
    padding: "0 16px 0 16px",
    minHeight: "48px",
    marginBottom: "0",
    right: "50%",
    transform: "translateX(50%)",
    display: "inline-flex",
    alignItems: "center",
    position: "fixed",
    bottom: "5vh",
    background: "#444",
    color: "#ddd",
    borderRadius: "5px",
    zIndex: 1000,
  },
}));




type PropsType = {
  show: boolean
  onClick: (e: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode
  style?: { [k: string]: any }
  overlayStyle?: { [k: string]: any }
  round?: boolean
  timeout?: number
  onClose?: () => void
}
const Snackbar = React.forwardRef(({
  show = false,
  onClick,
  children,
  style,
  overlayStyle,
  round = false,
  timeout,
  onClose,
  ...props
}: PropsType, ref?: React.Ref) => {
  const classes = useStyles({})
  const _ref = React.useRef(null)
  ref = ref || _ref;

  React.useEffect(() => {
    if(show && timeout){
      setTimeout(onClose, timeout)
    }
  }, [ show ])


  return <div ref={ref} className={classes.snackbar} {...props}
      style={{
        ...style,
        opacity: show ? "1.0" : "0",
        transition: show ? "opacity 0.2s" : "opacity 0.5s",
      }}>
    { children }
  </div>
});

export default Snackbar;