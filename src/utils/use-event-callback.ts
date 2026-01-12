"use client";

import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./use-iso-layout-effect";

/**
 * @internal
 * https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
 *
 * taken from https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-utilities/src/hooks/useEventCallback.ts
 *
 * Modified `useCallback` that can be used when dependencies change too frequently. Can occur when
 * e.g. user props are dependencies which could change on every render
 * e.g. volatile values (i.e. useState/useDispatch) are dependencies which could change frequently
 *
 * This should not be used often, but can be a useful re-render optimization since the callback is a ref and
 * will not be invalidated between re-renders
 *
 * @param fn - The callback function that will be used
 */
export const useEventCallback = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): ((...args: Args) => Return) => {
  const callbackRef = useRef<typeof fn>(() => {
    throw new Error("Cannot call an event handler while rendering");
  });

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = fn;
  }, [fn]);

  return useCallback(
    (...args: Args) => {
      const callback = callbackRef.current;
      return callback(...args);
    },
    [callbackRef],
  );
};
