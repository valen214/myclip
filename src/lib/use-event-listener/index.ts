
//@ts-ignore
import React, { useEffect, useRef } from "react"

export const useEventListener = (
  type: string, listener: (e: Event) => void,
  target: Window | React.RefObject | HTMLElement = window
) => {
  // https://usehooks.com/useEventListener/
  const savedListener: React.MutableRefObject<(e: Event) => void> = useRef()
  useEffect(() => {
    savedListener.current = listener
  }, [ listener ])

  useEffect(() => {
    if(target.current){
      target = target.current
    }
    if(!target || !target.addEventListener){
      console.warn("cannot apply addEventListener to", target)
      return
    }
    const listener = (e: Event) => savedListener!.current(e)
    target.addEventListener(type, listener)
    return () => {
      target.removeEventListener(type, listener)
    }
  }, [ type, target ])
}
export default useEventListener;