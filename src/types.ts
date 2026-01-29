import type { ComponentType, ReactNode, RefObject } from "react";

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type ComponentProps = {
  children?: ReactNode;
};

type Version = number;

type Payload<Value extends object> = readonly [Version, Value];

type Subscriber<Value extends object> = (payload: Payload<Value>) => void;

type ContextValue<Value extends object> = {
  subscribers: Subscriber<Value>[];
  value: RefObject<Value>;
  version: RefObject<Version>;
};

type Selector<Value, SelectedValue> = (value: Value) => SelectedValue;

type UseStoreOptions = {
  optional?: boolean;
};

type UseStore<Value extends object> = {
  /**
   * Returns the value returned by the `selector` function. Will throw an error when
   * used outside the store (unless `optional: true` is provided, see example
   * below).
   *
   * @example
   * const count = useStore((store) => store.count);
   * console.log(count); // value of store.count, throws an error if used outside its `<Store>` component
   *
   * @example
   * const count = useStore((store) => store.count, { optional: true });
   * console.log(count); // value of store.count or undefined if used outside the store
   *
   * @link see more at https://github.com/bentsignal/rostra
   */
  <SelectedValue>(
    selector: Selector<Value, SelectedValue>,
    options: UseStoreOptions & { optional: true },
  ): SelectedValue | undefined;
  /**
   * Returns the value returned by the `selector` function. Will throw an error when
   * used outside the store (unless `optional: true` is provided, see example
   * below).
   *
   * @example
   * const count = useStore(store => store.count);
   * console.log(count); // value of store.count, throws an error if used outside its `<Store>` component
   *
   * @example
   * const count = useStore(((store) => store.count), { optional: true });
   * console.log(count); // value of store.count or undefined if used outside its `<Store>` component
   *
   * @link see more at https://github.com/bentsignal/rostra
   */
  <SelectedValue>(
    selector: Selector<Value, SelectedValue>,
    options?: UseStoreOptions,
  ): SelectedValue;
};

type StoreApi<Props extends object, Value extends object> = {} & ComponentType<
  Prettify<Props & ComponentProps>
> & {
    Store: ComponentType<Prettify<Props & ComponentProps>>;
    useStore: UseStore<Value>;
  };

export type {
  Prettify,
  ComponentProps,
  ContextValue,
  Selector,
  Version,
  Payload,
  UseStoreOptions,
  UseStore,
  StoreApi,
};
