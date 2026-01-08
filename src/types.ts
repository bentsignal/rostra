import { ReactNode } from "react";

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type ComponentProps = {
  children?: ReactNode;
};

export type { Prettify, ComponentProps };
