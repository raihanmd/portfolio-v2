import React, { Children } from "react";

type EachProps<T> = {
  of: T[];
  render: (item: T, index: number) => React.ReactNode;
};

export default function Each<T>({ of, render }: EachProps<T>) {
  return Children.toArray(of.map(render));
}
