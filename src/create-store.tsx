import type {
  ComponentProps,
  ContextValue,
  Prettify,
  Selector,
  UseStoreOptions,
} from "./types";
import { createContext, RefObject, useRef } from "react";
import { useSelector } from "./use-selector";
import { useIsomorphicLayoutEffect } from "./utils/use-iso-layout-effect";

function createStore<Value extends object, Props extends object>(
  useHook: (props: Props) => Value,
) {
  const StoreContext = createContext<RefObject<ContextValue<Value>>>({
    current: {
      subscribers: [],
      value: { current: {} as Value },
      version: { current: -1 },
    },
  });

  function Store(props: Prettify<Props & ComponentProps>) {
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
  }

  function useStore<SelectedValue>(
    selector: Selector<Value, SelectedValue>,
    options: UseStoreOptions & { optional: true },
  ): SelectedValue | undefined;

  function useStore<SelectedValue>(
    selector: Selector<Value, SelectedValue>,
    options?: UseStoreOptions,
  ): SelectedValue;

  function useStore<SelectedValue>(
    selector: Selector<Value, SelectedValue>,
    options?: UseStoreOptions,
  ): SelectedValue | undefined {
    return useSelector(StoreContext, selector, options);
  }

  return {
    Store,
    useStore,
  };
}

export { createStore };
