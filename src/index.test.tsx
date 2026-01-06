import React from "react";
import { expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";
import { renderHook } from "@testing-library/react";
import { createRadio } from "./create-radio";

test("useNewRadio returns Radio context and useChannel hook", () => {
  const { result } = renderHook(() =>
    createRadio<{ count: number }>({ name: "TestRadio" }),
  );

  expect(result.current.Radio).toBeDefined();
  expect(result.current.useChannel).toBeDefined();
  expect(result.current.Radio.displayName).toBe("TestRadio");
  expect(result.current.Radio.Antenna).toBe(result.current.Radio.Provider);
});

test("useNewRadio creates Radio with correct initial state", () => {
  const { result } = renderHook(() =>
    createRadio<{ count: number }>({ name: "CounterRadio" }),
  );

  const { Radio, useChannel } = result.current;

  expect(Radio).toBeDefined();
  expect(typeof useChannel).toBe("function");
});

test("useNewRadio sets different display names correctly", () => {
  const { result: result1 } = renderHook(() =>
    createRadio<{ data: string }>({ name: "RadioOne" }),
  );
  const { result: result2 } = renderHook(() =>
    createRadio<{ data: string }>({ name: "RadioTwo" }),
  );

  expect(result1.current.Radio.displayName).toBe("RadioOne");
  expect(result2.current.Radio.displayName).toBe("RadioTwo");
});

test("useChannel returns default context value when used outside Provider", () => {
  const { result } = renderHook(() =>
    createRadio<{ count: number }>({ name: "TestRadio" }),
  );

  const { useChannel } = result.current;

  const { result: channelResult } = renderHook(() => useChannel());

  expect(channelResult.current).toBeDefined();
  expect(channelResult.current.listeners).toEqual([]);
  expect(channelResult.current.value).toEqual({});
  expect(channelResult.current.version).toEqual({ current: 0 });
});

test("useChannel works with Radio.Antenna Provider", () => {
  const { result } = renderHook(() =>
    createRadio<{ count: number }>({ name: "TestRadio" }),
  );

  const { Radio, useChannel } = result.current;
  const testValue = {
    listeners: [],
    value: { count: 42 },
    version: { current: 1 },
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Radio.Antenna value={testValue}>{children}</Radio.Antenna>
  );

  const { result: channelResult } = renderHook(() => useChannel(), {
    wrapper,
  });

  expect(channelResult.current.value).toEqual({ count: 42 });
  expect(channelResult.current.version.current).toBe(1);
});
