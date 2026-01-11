import type { ComponentProps, ContextValue, Prettify, Selector } from "./types";
import { createContext, RefObject, useRef } from "react";
import { useContextSelector } from "./use-context-selector";
import { useIsomorphicLayoutEffect } from "./use-iso-layout-effect";

const createStore = <Value extends object, Props extends object>(
  useHook: (props: Props) => Value,
) => {
  const StoreContext = createContext<RefObject<ContextValue<Value>>>({
    current: {
      subscribers: [],
      value: { current: {} as Value },
      version: { current: -1 },
    },
  });

  const Store = (props: Prettify<Props & ComponentProps>) => {
    const { children, ...rest } = props;

    const hookValue = useHook(rest as Props);
    const valueRef = useRef(hookValue);
    const versionRef = useRef(0);

    const contextValue = useRef<ContextValue<Value>>({
      subscribers: [],
      value: valueRef,
      version: versionRef,
    });

    useIsomorphicLayoutEffect(() => {
      contextValue.current.value.current = hookValue;
      contextValue.current.version.current++;
      contextValue.current.subscribers.forEach((subscriber) => {
        subscriber([versionRef.current, valueRef.current]);
      });
    }, [hookValue]);

    return (
      <StoreContext.Provider value={contextValue}>
        {children}
      </StoreContext.Provider>
    );
  };

  const useStore = <SelectedValue extends unknown>(
    selector: Selector<Value, SelectedValue>,
  ) => useContextSelector(StoreContext, selector);

  return {
    Store,
    useStore,
  };
};

export { createStore };
