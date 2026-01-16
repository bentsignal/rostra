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

This library is an attempt to find a good balance between the DX and performance of solutions like Zustand, while providing the reusability of React Context.

### Usage

Create a hook to store your state. I tend to name it `useInternalStore`, but you can name it whatever you'd like.

Pass that hook into `createStore`, and it will return two things for you:

1. `Store`: A component that wraps whatever piece of your app you want to have access to the store's state
2. `useStore`: A hook that allows you to select small pieces of that state

```tsx
import { useState } from "react";
import { createStore } from "rostra";

function useInternalStore() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(prev => prev + 1);
  return { count, increment };
};

const { Store, useStore } = createStore(useInternalStore);
```
<br />

> [!IMPORTANT]
`useInternalStore` should only be used as an argument for `createStore`. You should not use it anywhere else in your code. When you want to access the store's state, use its associated `useStore`.

<br />

You can then use these throughout your app as you'd like. In the example below, `<IncrementButton>` won't re-render when `count` changes.

```tsx
function Counter() {
  return (
    <Store>
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

If you try to use `useStore` outside the scope of its corresponding `Store` component, it will throw an error. This is typically a good thing, but sometimes you may want to optionally use a store's value if it exists in scope.

To do this, you can tell the hook that the store's presence is optional. This will type the returned value from `useStore` as `Value | undefined`, and `useStore` will not throw.

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
  const count = useStore(((store) => store.count), { optional: true });
  if (count === undefined) {
    return <p>Count not found</p>;
  }
  return <p>Count: {count}</p>;
};
```

You can also have props passed into your store:  

```tsx
import { useState } from "react";
import { createStore } from "rostra";

function useInternalStore({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount(prev => prev + 1);
  return { count, increment };
};

const { Store, useStore } = createStore(useInternalStore);

function Counter() {
  return (
    <Store initialCount={10}>
      <Value />
      <IncrementButton />
    </Store>
  );
};
```

---

> [!CAUTION]
All of the statements made regarding re-render behavior assume you have the React Compiler enabled. If you do not, you will still have to manually memoize state inside `useInternalStore`. In the example above, `increment` would need to be wrapped in `useCallback`.


