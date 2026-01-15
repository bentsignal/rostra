import type { ContextValue, Payload, Selector, UseStoreOptions } from "./types";
import { Context, useContext, useState } from "react";
import { useEventCallback } from "./utils/use-event-callback";
import { useIsomorphicLayoutEffect } from "./utils/use-iso-layout-effect";

function useSelector<Value extends object, SelectedValue>(
  context: Context<{ current: ContextValue<Value> }>,
  selector: Selector<Value, SelectedValue>,
  options: UseStoreOptions & { optional: true },
): SelectedValue | undefined;

function useSelector<Value extends object, SelectedValue>(
  context: Context<{ current: ContextValue<Value> }>,
  selector: Selector<Value, SelectedValue>,
  options?: UseStoreOptions,
): SelectedValue;

function useSelector<Value extends object, SelectedValue>(
  context: Context<{ current: ContextValue<Value> }>,
  selector: Selector<Value, SelectedValue>,
  options?: UseStoreOptions,
): SelectedValue | undefined {
  const contextValue = useContext(context);

  const {
    value: { current: value },
    version: { current: version },
    subscribers,
  } = contextValue.current;

  const isMissingProvider = version === -1;

  const selected = isMissingProvider ? undefined : selector(value);

  const [state, setState] = useState<
    readonly [Value, SelectedValue | undefined]
  >([value, selected]);

  const dispatch = (payload: Payload<Value>) => {
    setState((prev) => {
      if (isMissingProvider) {
        return prev;
      }
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
  };

  const stableDispatch = useEventCallback(dispatch);

  useIsomorphicLayoutEffect(() => {
    if (isMissingProvider) {
      return;
    }
    subscribers.push(stableDispatch);
    return () => {
      subscribers.splice(subscribers.indexOf(stableDispatch), 1);
    };
  }, [stableDispatch, isMissingProvider, subscribers]);

  if (isMissingProvider) {
    if (options?.optional) {
      return undefined;
    }
    throw new Error("useStore must be used within a Store");
  }

  return state[1];
}

export { useSelector };
