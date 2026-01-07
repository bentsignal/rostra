// import React from "react";
// import { expect, test } from "vitest";
// import "@testing-library/jest-dom/vitest";
// // import { renderHook } from "@testing-library/react";
// import { createRadio } from "./create-radio";

// test("useNewRadio returns Radio context and useChannel hook", () => {
//   const { Radio, useChannel } = createRadio<{ count: number }>({
//     name: "TestRadio",
//   });
//   expect(Radio).toBeDefined();
//   expect(useChannel).toBeDefined();
//   expect(Radio.displayName).toBe("TestRadio");
//   expect(Radio.Antenna).toBe(Radio.Provider);
// });

// test("useNewRadio creates Radio with correct initial state", () => {
//   const { Radio, useChannel } = createRadio<{ count: number }>({
//     name: "CounterRadio",
//   });

//   expect(Radio).toBeDefined();
//   expect(typeof useChannel).toBe("function");
// });1

// test("useNewRadio sets different display names correctly", () => {
//   const { Radio: RadioOne } = createRadio<{
//     data: string;
//   }>({ name: "RadioOne" });
//   const { Radio: RadioTwo } = createRadio<{
//     data: string;
//   }>({ name: "RadioTwo" });

//   expect(RadioOne.displayName).toBe("RadioOne");
//   expect(RadioTwo.displayName).toBe("RadioTwo");
// });

// test("useChannel returns default context value when used outside Provider", () => {
//   const { useChannel } = createRadio<{ count: number }>({
//     name: "TestRadio",
//   });

//   const { result } = renderHook(() => useChannel());

//   expect(result.current).toBeDefined();
//   expect(result.current.listeners).toEqual([]);
//   expect(result.current.value).toEqual({});
//   expect(result.current.version).toEqual({ current: 0 });
// });

// test("useChannel works with Radio.Antenna Provider", () => {
//   const { Radio, useChannel } = createRadio<{ count: number }>({
//     name: "TestRadio",
//   });

//   const testValue = {
//     listeners: [],
//     value: { count: 42 },
//     version: { current: 1 },
//   };

//   const wrapper = ({ children }: { children: React.ReactNode }) => (
//     <Radio.Antenna value={testValue}>{children}</Radio.Antenna>
//   );

//   const { result: channelResult } = renderHook(() => useChannel(), {
//     wrapper,
//   });

//   expect(channelResult.current.value).toEqual({ count: 42 });
//   expect(channelResult.current.version.current).toBe(1);
// });
