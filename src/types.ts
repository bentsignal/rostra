import type { Context, Provider } from "react";
import { RefObject } from "react";

type RadioInfo<Value> = {
  listeners: ((payload: readonly [number, Value]) => void)[];
  value: Value;
  version: RefObject<number>;
};

type Broadcast<Value> = Provider<RadioInfo<Value>>;

type Radio<Value> = Context<RadioInfo<Value>> & {
  Broadcast: Broadcast<Value>;
};

type Selector<Value, SelectedValue> = (value: Value) => SelectedValue;

export type { RadioInfo, Radio, Selector };
