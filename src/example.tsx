import { useState } from "react";
import { createStore } from "./create-store";

export const { Store, useStore } = createStore(() => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((count) => count);
  const decrement = () => setCount((count) => count - 1);
  return {
    count,
    increment,
    decrement,
  };
});

export const ExampleStore = () => {
  return (
    <Store>
      <div>testing</div>
    </Store>
  );
};

/**
 * Example passing props to the store.
 */

type StoreProps = {
  initialCount: number;
  incrementBy: number;
};

export const { Store: StoreWithProps, useStore: useStoreWithProps } =
  createStore(({ initialCount, incrementBy }: StoreProps) => {
    const [count, setCount] = useState(initialCount);
    const increment = () => setCount((count) => count + incrementBy);
    const decrement = () => setCount((count) => count - 1);
    return {
      count,
      increment,
      decrement,
    };
  });

export const ExampleStoreWithProps = () => {
  return (
    <StoreWithProps initialCount={2} incrementBy={2}>
      <div>testing</div>
    </StoreWithProps>
  );
};

/**
 * You can also specify the type of the store.
 * If you do so, you must also specify the type of the props.
 */

type StoreType = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const {
  Store: StoreWithPropsAndType,
  useStore: useStoreWithPropsAndType,
} = createStore<StoreType, StoreProps>(
  ({ initialCount, incrementBy }: StoreProps) => {
    const [count, setCount] = useState(initialCount);
    const increment = () => setCount((count) => count + incrementBy);
    const decrement = () => setCount((count) => count - 1);
    return {
      count,
      increment,
      decrement,
    };
  },
);

export const ExampleStoreWithPropsAndType = () => {
  return (
    <StoreWithPropsAndType initialCount={2} incrementBy={2}>
      <div>testing</div>
    </StoreWithPropsAndType>
  );
};
