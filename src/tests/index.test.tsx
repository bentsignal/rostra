import { memo, useState } from "react";
import { afterEach, expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { createStore } from "./create-store";

afterEach(cleanup);

test("useStore returns the correct value", () => {
  const useCreateStore = () => ({ count: 0 });
  const { Store, useStore } = createStore(useCreateStore);

  expect(Store).toBeDefined();
  expect(useStore).toBeDefined();

  const { result } = renderHook(() => useStore((store) => store.count), {
    wrapper: Store,
  });
  expect(result.current).toBe(0);
});

test("useStore returns the correct value when the store is updated", () => {
  const useCreateStore = () => {
    const [count, setCount] = useState(0);
    const increment = () => setCount((prev) => prev + 1);
    return { count, increment };
  };
  const { Store, useStore } = createStore(useCreateStore);

  expect(Store).toBeDefined();
  expect(useStore).toBeDefined();

  const { result } = renderHook(() => useStore((store) => store.count), {
    wrapper: Store,
  });
  expect(result.current).toBe(0);

  const { result: storeResult } = renderHook(
    () => ({
      count: useStore((store) => store.count),
      increment: useStore((store) => store.increment),
    }),
    {
      wrapper: Store,
    },
  );

  expect(storeResult.current.count).toBe(0);

  act(() => storeResult.current.increment());

  expect(storeResult.current.count).toBe(1);
});

test("useStore throws outside Store when optional is false", () => {
  const useCreateStore = () => ({ count: 0 });
  const { useStore } = createStore(useCreateStore);

  expect(() => renderHook(() => useStore((store) => store.count))).toThrowError(
    "useStore must be used within a Store",
  );
});

test("useStore returns undefined outside Store when optional is true", () => {
  const useCreateStore = () => ({ count: 0 });
  const { useStore } = createStore(useCreateStore);

  const { result } = renderHook(() =>
    useStore((store) => store.count, { optional: true }),
  );

  expect(result.current).toBeUndefined();
});

test("useStore does not rerender when an unrelated slice changes", () => {
  const useCreateStore = () => {
    const [count, setCount] = useState(0);
    const [text, setText] = useState("a");
    return { count, setCount, text, setText };
  };

  const { Store, useStore } = createStore(useCreateStore);

  let renderCount = 0;

  const Consumer = memo(function Consumer() {
    renderCount++;
    const count = useStore((store) => store.count);
    const setText = useStore((store) => store.setText);
    return (
      <button type="button" onClick={() => setText((t) => `${t}!`)}>
        {count}
      </button>
    );
  });

  render(
    <Store>
      <Consumer />
    </Store>,
  );

  expect(renderCount).toBe(1);
  expect(screen.getByRole("button")).toHaveTextContent("0");

  act(() => {
    fireEvent.click(screen.getByRole("button"));
  });

  expect(renderCount).toBe(1);
  expect(screen.getByRole("button")).toHaveTextContent("0");
});

test("useStore rerenders when the selected slice changes", () => {
  const useCreateStore = () => {
    const [count, setCount] = useState(0);
    return { count, setCount };
  };

  const { Store, useStore } = createStore(useCreateStore);

  let renderCount = 0;

  const Consumer = memo(function Consumer() {
    renderCount++;
    const count = useStore((store) => store.count);
    const setCount = useStore((store) => store.setCount);
    return (
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        {count}
      </button>
    );
  });

  render(
    <Store>
      <Consumer />
    </Store>,
  );

  expect(renderCount).toBe(1);
  expect(screen.getByRole("button")).toHaveTextContent("0");

  act(() => {
    fireEvent.click(screen.getByRole("button"));
  });

  expect(renderCount).toBe(2);
  expect(screen.getByRole("button")).toHaveTextContent("1");
});
