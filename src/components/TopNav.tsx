

import { hot } from 'react-hot-loader/root';
import * as React from "react";

export interface TopNavProps { compiler: string; framework: string; }

export const TopNav = hot((props: TopNavProps) => {
  return <div>Hello compiler: {props.compiler}
      and framework: {props.framework}</div>;
});
