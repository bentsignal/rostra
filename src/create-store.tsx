import type {
  ComponentProps,
  ContextValue,
  Prettify,
  Selector,
  StoreApi,
  UseStoreOptions,
} from "./types";
import { createContext, RefObject, useRef } from "react";
import { useSelector } from "./use-selector";
import { useIsomorphicLayoutEffect } from "./utils/use-iso-layout-effect";

/**
 * Creates a store component and a hook to select slices of the store's state.
 *
 * @param useInternalStore - A hook that stores state just like any other react hook. The object
 * you return from it will become the store's state. (see example below)
 *
 * The hook can receive props, which will become props on the returned `Store` component.
 *
 * This hook should **ONLY** be used as an argument to `createStore` and **NOT** used directly.
 *
 * @returns An object containing:
 *   - `Store` - A component that wraps whatever piece of your app you want to be able
 *     to access the store's state. Accepts any props you provide to `useInternalStore`.
 *
 *   - `useStore` - A hook to get small pieces of the store's state. Only causes a re-render
 *     in the component using `useStore` if the selected slice of state actually changes.
 *
 * @example
 *  function useInternalStore({ initialCount }: { initialCount: number }) {
 *    const [count, setCount] = useState(initialCount);
 *    const increment = () => setCount((prev) => prev + 1);
 *
 *    return { count, increment };
 *  };
 *
 *  const { Store, useStore } = createStore(useInternalStore);
 *
 *  function Counter() {
 *    return (
 *      <Store initialCount={0}>
 *        <Value />
 *        <IncrementButton />
 *      </Store>
 *    );
 *  };
 *
 * function IncrementButton() {
 *    const increment = useStore(store => store.increment);
 *    return <button onClick={increment}>Increment</button>;
 * };
 *
 * function Value() {
 *    const count = useStore(store => store.count);
 *    return <p>Count: {count}</p>;
 * };
 *
 * @link see more at https://github.com/bentsignal/rostra
 *
 */
function createStore<Value extends object, Props extends object>(
  useInternalStore: (props: Props) => Value,
): StoreApi<Value, Props> {
  const StoreContext = createContext<RefObject<ContextValue<Value>>>({
    current: {
      subscribers: [],
      value: { current: {} as Value },
      version: { current: -1 },
    },
  });

  function Store(props: Prettify<Props & ComponentProps>) {
    const { children, ...rest } = props;

    const storeValue = useInternalStore(rest as Props);
    const valueRef = useRef(storeValue);
    const versionRef = useRef(0);

    const contextValue = useRef<ContextValue<Value>>({
      subscribers: [],
      value: valueRef,
      version: versionRef,
    });

    useIsomorphicLayoutEffect(() => {
      contextValue.current.value.current = storeValue;
      contextValue.current.version.current++;
      contextValue.current.subscribers.forEach((subscriber) => {
        subscriber([versionRef.current, valueRef.current]);
      });
    }, [storeValue]);

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
