import type { Radio, RadioInfo } from "./types";
import { createContext, useContext } from "react";

/**
/**
 * Creates a new broadcast context for sharing state.
 * 
 * @param name - The name of the broadcast.
 * @returns An object containing:
 *   - Broadcast: A React Provider component. The prop `value` must be an object matching the shape of <Data>
 *   - useChannel: A hook that lets you listen to and select just a piece of the broadcast value using a selector function.
 *
 * @example
 * 
 * const { Broadcast, useChannel } = createBroadcast<{ count: number }>({
 *   name: "MyBroadcast",
 * });
 * 
 * const Emitter = ({children}: {children: React.ReactNode}) => {
 *   const [count, setCount] = useState(0);
 *   return (
 *     <Broadcast value={{ count }}>
 *       {children}
 *     </Broadcast>
 *   );
 * };
 * 
 * // child of Emitter
 * const Receiver = () => {
 *   const count = useChannel((c) => c.count);
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *     </div>
 *   );
 * };
 * 
 */
const createBroadcast = <Data extends object>({ name }: { name: string }) => {
  const Radio = createContext<RadioInfo<Data>>({
    listeners: [],
    value: {} as Data,
    version: { current: -1 },
  }) as Radio<Data>;

  Radio.displayName = name;
  Radio.Broadcast = Radio.Provider;

  const useChannel = () => useContext(Radio);

  return {
    Broadcast: Radio.Provider,
    useChannel,
  };
};

export { createBroadcast };
