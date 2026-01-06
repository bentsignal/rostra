import { RefObject } from "react";
import type { Context, Provider } from "react";

type Antenna<Value> = Provider<RadioObject<Value>>;

type Radio<Value> = Context<RadioObject<Value>> & {
  Antenna: Antenna<Value>;
};

type RadioObject<Value> = {
  listeners: ((payload: readonly [number, Value]) => void)[];
  value: Value;
  version: RefObject<number>;
};

export type { RadioObject, Radio };
