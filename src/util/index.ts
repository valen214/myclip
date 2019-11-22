

export const askFile = async ({} = {}) => {
  let elem = document.querySelector("")
};

export const arrayMoveInplace =
<T> (arr?: Array<T>, from?: number, to?: number) => {
  arr.splice(to < 0 ? to + arr.length : to, 0, arr.splice(from, 1)[0]);
};


type F = (...args: any[]) => void;
export function debounce(func: F, delay: number): F{
  let timerId: number;
  return (...args: any[]) => {
    if(timerId) clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      timerId = null
      func(...args)
    }, delay);
  };
};