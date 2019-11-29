

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


// eslint-disable-next-line
export function randomstring(len=8, alphabet="abcdefghijklmnopqrstuvwxyz"){
    // https://jsperf.com/js-random-string-implementation-performance
    return crypto.getRandomValues(new Uint8Array(len)).reduce((l, r, i) => {
        // alphabet.chatAt(i / 255 * alphabet.length)
        l[i] = alphabet[Math.floor(r / 256 * alphabet.length)];
        return l;
    }, new Array(len)).join("");
}

export function arrayEqual<T>(arr1: Array<T>, arr2: Array<T>){
    if(arr1 === arr2) return true
    if(!arr1 || !arr2) return false;
    if(arr1.length != arr2.length) return false
    
    for(let i = 0; i < arr1.length; ++i){
      if(arr1[i] !== arr2[i]) return false
    }
    return true
}