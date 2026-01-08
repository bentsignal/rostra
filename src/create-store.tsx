import type { ComponentProps, Prettify } from "./types";
import { Context, createContext, JSX } from "react";

const createStore = <Value extends object, Props extends object>(
  hook: (props: Props) => Value,
): {
  Store: (props: Prettify<Props & ComponentProps>) => JSX.Element;
  useStore: () => Value;
} => {
  const StoreContext = createContext<{
    listeners: ((payload: readonly [number, Value]) => void)[];
    value: Value;
    version: { current: number };
  }>({
    listeners: [],
    value: {} as Value,
    version: { current: -1 },
  });
  const PublicContext = StoreContext as unknown as Context<Value>;
  const Store = (props: Prettify<Props & ComponentProps>) => {
    const { children, ...rest } = props;
    const hookValue = hook(rest as Props);
    return (
      <PublicContext.Provider value={hookValue}>
        {children}
      </PublicContext.Provider>
    );
  };
  return {
    Store,
    useStore: () => null as unknown as Value,
  };
};

export { createStore };
