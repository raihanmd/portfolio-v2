import { Fragment, type ReactNode } from "react";

type EachProps<T> = {
  of: T[];
  render: (item: T, index: number) => ReactNode;
};

export default function Each<T>({ of, render }: EachProps<T>) {
  return of.map((item, index) => (
    <Fragment key={index}>{render(item, index)}</Fragment>
  ));
}
