import { useEffect, useLayoutEffect } from "react";

// from https://github.com/reduxjs/react-redux/blob/master/src/utils/useIsomorphicLayoutEffect.ts

// The MIT License (MIT)

// Copyright (c) 2015-present Dan Abramov

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
// subscription callback always has the selector from the latest render commit
// available, otherwise a store update may happen between render and the effect,
// which may cause missed updates; we also must ensure the store subscription
// is created synchronously, otherwise a store update may occur before the
// subscription is created and an inconsistent state may be observed

// Matches logic in React's `shared/ExecutionEnvironment` file
const canUseDOM = () =>
  !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

const isDOM = /* @__PURE__ */ canUseDOM();

// Under React Native, we know that we always want to use useLayoutEffect

/**
 * Checks if the code is running in a React Native environment.
 *
 * @returns Whether the code is running in a React Native environment.
 *
 * @see {@link https://github.com/facebook/react-native/issues/1331 Reference}
 */
const isRunningInReactNative = () =>
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

const isReactNative = /* @__PURE__ */ isRunningInReactNative();

const getUseIsomorphicLayoutEffect = () =>
  isDOM || isReactNative ? useLayoutEffect : useEffect;

export const useIsomorphicLayoutEffect =
  /* @__PURE__ */ getUseIsomorphicLayoutEffect();
