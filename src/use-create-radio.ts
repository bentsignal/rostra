import type { Radio, RadioObject } from "./types";
import { createContext, useContext } from "react";

const useNewRadio = <Data extends object>({ name }: { name: string }) => {
  const Radio = createContext<RadioObject<Data>>({
    listeners: [],
    value: {} as Data,
    version: { current: 0 },
  }) as Radio<Data>;
  const useChannel = () => useContext(Radio);
  Radio.displayName = name;
  Radio.Antenna = Radio.Provider;
  return {
    Radio,
    useChannel,
  };
};

export { useNewRadio };
