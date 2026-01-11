import { ReactNode, RefObject } from "react";

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type ComponentProps = {
  children?: ReactNode;
};

type Version = number;

type Payload<Value extends object> = readonly [Version, Value];

type Subscriber<Value extends object> = (payload: Payload<Value>) => void;

type ContextValue<Value extends object> = {
  subscribers: Subscriber<Value>[];
  value: RefObject<Value>;
  version: RefObject<Version>;
};

type Selector<Value, SelectedValue> = (value: Value) => SelectedValue;

type UseStoreOptions = {
  optional?: boolean;
};

export type {
  Prettify,
  ComponentProps,
  ContextValue,
  Selector,
  Version,
  Payload,
  UseStoreOptions,
};
