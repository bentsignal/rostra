import type { ContextValue, Payload, Selector, UseStoreOptions } from "./types";
import { Context, useCallback, useContext, useState } from "react";
import { useIsomorphicLayoutEffect } from "./use-iso-layout-effect";

function useContextSelector<Value extends object, SelectedValue>(
  context: Context<{ current: ContextValue<Value> }>,
  selector: Selector<Value, SelectedValue>,
  options: UseStoreOptions & { optional: true },
): SelectedValue | undefined;

function useContextSelector<Value extends object, SelectedValue>(
  context: Context<{ current: ContextValue<Value> }>,
  selector: Selector<Value, SelectedValue>,
  options?: UseStoreOptions & { optional?: false },
): SelectedValue;

function useContextSelector<Value extends object, SelectedValue>(
  context: Context<{ current: ContextValue<Value> }>,
  selector: Selector<Value, SelectedValue>,
  options?: UseStoreOptions,
): SelectedValue | undefined;

function useContextSelector<Value extends object, SelectedValue>(
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

  const dispatch = useCallback(
    (payload: Payload<Value>) => {
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
    },
    [isMissingProvider, selector, version],
  );

  useIsomorphicLayoutEffect(() => {
    if (isMissingProvider) {
      return;
    }
    subscribers.push(dispatch);
    return () => {
      subscribers.splice(subscribers.indexOf(dispatch), 1);
    };
  }, [dispatch, isMissingProvider, subscribers]);

  if (isMissingProvider) {
    if (options?.optional) {
      return undefined;
    }
    throw new Error("useStore must be used within a Store");
  }

  return state[1];
}

export { useContextSelector };
