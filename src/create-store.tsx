import { JSX, ReactNode } from "react";

type ComponentProps = {
  children?: ReactNode;
};

function createStore<Value extends object>(): <Props extends object>(
  hook: (props: Props) => Value,
) => {
  Store: (props: Props & ComponentProps) => JSX.Element;
  useStore: () => Value;
};

function createStore<Props extends object, Value extends object>(
  hook: (props: Props) => Value,
): {
  Store: (props: Props & ComponentProps) => JSX.Element;
  useStore: () => Value;
};

function createStore(hook?: (props: object) => object) {
  if (hook === undefined) {
    return (innerHook: (props: object) => object) => ({
      Store: (props: object) => <div>testing</div>,
      useStore: () => null as unknown,
    });
  }
  return {
    Store: (props: object) => <div>testing</div>,
    useStore: () => null as unknown,
  };
}

export { createStore };
