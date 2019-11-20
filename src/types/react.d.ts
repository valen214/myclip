
// import React from "react";

export function forwardRef<T, P = {}>(
  Component: React.RefForwardingComponent<T, P>
): React.ComponentType<P & React.ClassAttributes<T>>