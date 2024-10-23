import { Children, type ReactNode } from "react";

type EachProps<T> = {
  of: T[];
  render: (item: T, index: number) => ReactNode;
};

export default function Each<T>({ of, render }: EachProps<T>) {
  return Children.toArray(of.map(render));
}
