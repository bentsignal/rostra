"use client";

import { useState } from "react";
import { createStore } from "../../src/create-store";

export const { Store, useStore } = createStore(
  ({ initialCount = 10 }: { initialCount?: number }) => {
    const [count1, setCount1] = useState(initialCount);
    const increment1 = () => setCount1((prev) => prev + 1);
    const decrement1 = () => setCount1((prev) => prev - 1);

    const [count2, setCount2] = useState(initialCount);
    const increment2 = () => setCount2((prev) => prev + 1);
    const decrement2 = () => setCount2((prev) => prev - 1);

    return {
      count1,
      count2,
      increment1,
      decrement1,
      increment2,
      decrement2,
    };
  },
);

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center gap-4">{children}</div>
  );
};

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {children}
    </div>
  );
};

export const Value1 = () => {
  const count1 = useStore((store) => store.count1);
  return <p>Count1: {count1}</p>;
};

export const Value2 = () => {
  const count2 = useStore((store) => store.count2);
  return <p>Count2: {count2}</p>;
};

export const IncrementButton1 = () => {
  const increment1 = useStore((store) => store.increment1);
  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-40 h-10 cursor-pointer"
      onClick={increment1}
    >
      Increment
    </button>
  );
};

export const IncrementButton2 = () => {
  const increment2 = useStore((store) => store.increment2);
  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-40 h-10 cursor-pointer"
      onClick={increment2}
    >
      Increment
    </button>
  );
};

export const DecrementButton2 = () => {
  const decrement2 = useStore((store) => store.decrement2);
  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-40 h-10 cursor-pointer"
      onClick={decrement2}
    >
      Decrement
    </button>
  );
};

export const DecrementButton1 = () => {
  const decrement1 = useStore((store) => store.decrement1);
  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-40 h-10 cursor-pointer"
      onClick={decrement1}
    >
      Decrement
    </button>
  );
};
