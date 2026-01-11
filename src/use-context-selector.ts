import type { ContextValue, Payload, Selector } from "./types";
import { Context, useCallback, useContext, useState } from "react";
import { useIsomorphicLayoutEffect } from "./use-iso-layout-effect";

const useContextSelector = <Value extends object, SelectedValue>(
  context: Context<{ current: ContextValue<Value> }>,
  selector: Selector<Value, SelectedValue>,
) => {
  const contextValue = useContext(context);

  const {
    value: { current: value },
    version: { current: version },
    subscribers,
  } = contextValue.current;
  const selected = selector(value);

  if (version === -1) {
    throw new Error("useStore must be used within a Store");
  }

  const [state, setState] = useState<readonly [Value, SelectedValue]>([
    value,
    selected,
  ]);

  const dispatch = useCallback(
    (payload: Payload<Value>) => {
      setState((prev) => {
        const newVersion = payload[0];
        if (newVersion <= version) {
          return prev;
        }
        const oldValue = prev[0];
        const newValue = payload[1];
        if (Object.is(oldValue, newValue)) {
          return prev;
        }
        const oldSelected = prev[1];
        const newSelected = selector(newValue);
        if (Object.is(oldSelected, newSelected)) {
          return prev;
        }
        return [newValue, newSelected] as const;
      });
    },
    [selector, version],
  );

  useIsomorphicLayoutEffect(() => {
    subscribers.push(dispatch);
    return () => {
      subscribers.splice(subscribers.indexOf(dispatch), 1);
    };
  }, [dispatch]);

  return state[1];
};

export { useContextSelector };
