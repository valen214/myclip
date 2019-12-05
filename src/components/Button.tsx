
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
    fontFamily: "Consolas",

    "&::after": {
      content: "' '",
      display: "inline-block",
      position: "absolute",
      width: "100%",
      height: "100%",
      paddingBottom: "100%",
      pointerEvents: "none",
      // borderRadius: "50%",
      zIndex: 1,

      opacity: 0,
    },
    "&:hover::after": {
      opacity: 1,
      transform: "scale(1)",
      background: "rgba(0, 0, 0, 0.1)",
    },
    "&:active::after": {
      opacity: 1,
      transform: "scale(1)",
      background: "rgba(0, 0, 0, 0.2)",
    },
    "&:not(:active).focus::after": {
      background: "rgba(0, 0, 0, 0.5)",
      transform: "scale(0.75)",
      opacity: 1,
      transition: "transform 0.2s, opacity 0.2s",
    },
    "&.onclick::after": {
    // https://jsfiddle.net/xvalen214x/7rLmu9oq/41/show
    // background: "repeating-radial-gradient(rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.3) 80% 82%, rgba(255, 255, 255, 0.8) 82% 84%)",
      opacity: 1,
      transform: "scale(0.1)",
      background: [
          "radial-gradient(rgba(0, 0, 0, 0.2) 20%",
          "rgba(255, 255, 255, 0.3) 35%",
          "rgba(255, 255, 255, 0.2) 100%)"
      ],
      transition: "transform 1s, opacity 1s",
    },
    "&.onclick.animate::after": {
      opacity: 1,
      transform: "scale(5)",
    },
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

  return <button ref={ref}
      className={classes.button + " " + className}
      {...props}
      style={{
        ...(edge == "left" ? { marginLeft: -12 } : {}),
        ...style,
        ...(round && { borderRadius: "50%" }),
      }}
      onFocus={() => {
        return;
        console.log("on focus")
        let rect = ref.current.getBoundingClientRect(); // parent
        Object.assign(ref.current.style, {
          left: "0px",
          top: ((rect.height - rect.width) / 2) + "px",
          transform: "scale(0.25)",
          transition: "none",
          opacity: 1,
        });
        setTimeout(() => {
          Object.assign(ref.current.style, {
            transform: "scale(0.85)",
            opacity: 0.4,
            transition: "transform 0.2s, opacity 0.2s",
          })
        }, 16);
        ref.current.classList.add("focus")
      }}
      onBlur={() => {
        ref.current.classList.remove("focus")
      }}

      onPointerDown={(e: React.PointerEvent<HTMLElement>) => {
        ref.current.classList.add("onclick");
        setTimeout(() => {
          ref.current.classList.add("animate");
        }, 16);
        setTimeout(() => {
          ref.current.classList.remove("onclick", "animate");
        }, 1000);
        return;
        let rect = ref.current.getBoundingClientRect(); // parent
        Object.assign(ref.current.style, {
          left: (e.clientX - rect.left - rect.width/2) + "px",
          // rect.width instead of height because of the "square padding hack"
          top: (e.clientY - rect.top - rect.width/2) + "px",
          transform: "scale(0.25)",
          transition: "none",
          opacity: 1,
        });
      }}>
    { children }
  </button>
});

export default React.memo(Button);