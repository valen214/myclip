

export const askFile = async ({} = {}) => {
  let elem = document.querySelector("")
};

export const arrayMoveInplace =
<T> (arr?: Array<T>, from?: number, to?: number) => {
  arr.splice(to < 0 ? to + arr.length : to, 0, arr.splice(from, 1)[0]);
};