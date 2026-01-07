import { useState } from "react";
import { createStore } from "./create-store";

const { Store, useStore } = createStore<{
  count: number;
  increment: () => void;
  decrement: () => void;
}>()(({
  initialCount,
  incrementBy,
}: {
  initialCount: number;
  incrementBy: number;
}) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((count) => count + 1);
  const decrement = () => setCount((count) => count - 1);
  return {
    count,
    increment,
    decrement,
  };
});

const MyComponent = () => {
  return (
    <Store initialCount={2} incrementBy={2}>
      <div>testing</div>
    </Store>
  );
};

export { Store, useStore };
