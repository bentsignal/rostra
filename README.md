<p align="center">
  <img src="https://b9sa6juqtj.ufs.sh/f/WmevHvqCEmRaMr1nqHie41ygPEGcTkSVa8Y2Ux0JXOot3Lms" alt="Rostra Example" style="max-width: 700px; width: 100%;">
</p>

<h2 align="center">Rostra</h2>
<p align="center">Performant state management for React</p>

### Installation

```
ni rostra
```

```
pnpm i rostra
```

```
bun i rostra
```

```
npm i rostra
```

```
yarn add rostra
```

### Overview

This library is an attempt to find a good balance between the dx and performance of solutions like Zustand, while providing the reusability of React Context.

### Usage

Create a hook to store your state. I tend to name it `useInternalStore`, but you can name them whatever you'd like.

Pass that hook into `createStore`, and it will return two things for you:

1. `Store`: A component that wraps whatever piece of your app you want to have access to the store's state
2. `useStore`: A hook that allows you to select small pieces of that state

```tsx
import { useState } from "react";
import { createStore } from "rostra";

function useInternalStore() {
  const [count, setCount] = useState(0);
  const increment = () => setState(prev => prev + 1);
  return { count, increment };
};

const { Store, useStore } = createStore(useInternalStore);
```

> [!WARNING]
`useInternalStore` should only be used as an argument for `createStore`. You should not use `useInternalStore` anywhere else in your code. When you want to access the store's state, use `useStore`.

You can then use these throughout your app as you'd like. In the example below, `<IncrementButton>` won't re-render when `count` changes.

```tsx
function Counter() {
  return (
    <Store initialCount={0}>
      <Value />
      <IncrementButton />
    </Store>
  );
};

function IncrementButton() {
  const increment = useStore(store => store.increment);
  return <button onClick={increment}>Increment</button>;
};

function Value() {
  const count = useStore(store => store.count);
  return <p>Count: {count}</p>;
};
```

If you try to use `useStore` outside the scope of its corresponding `Store` component, it will throw an error. This is typically a good thing, but sometimes you may want to optionally use a stores value if it exists. 

To do this, you can tell the hook that the stores presence is optional. The will type the returned value from `useStore` as `Value | undefined`, and will not throw. 

```tsx
function Counter() {
  return (
    <>
      <Value />
      <Store initialCount={0}>
        <IncrementButton />
      </Store>
    </>
  );
};

function IncrementButton() {
  const increment = useStore(store => store.increment);
  return <button onClick={increment}>Increment</button>;
};

function Value() {
  const count = useStore(((store) => store.count), { optional: true});
  if (count === undefined) {
    return <p>Count not found</p>;
  }
  return <p>Count: {count}</p>;
};
```

> [!IMPORTANT]
All of the promises I made regarding re-render behavior assume you have the React Compiler enabled. If you do not, you will still have to manually memoize state inside `useInternalStore`. In the example above, `increment` would need to be wrapped in `useCallback`.


