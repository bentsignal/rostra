import * as Counter from "../components/counter";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Counter.Store>
        <Counter.Wrapper>
          <Counter.Container>
            <Counter.Value1 />
            <Counter.IncrementButton1 />
            <Counter.DecrementButton1 />
          </Counter.Container>
          <Counter.Container>
            <Counter.Value2 />
            <Counter.IncrementButton2 />
            <Counter.DecrementButton2 />
          </Counter.Container>
        </Counter.Wrapper>
      </Counter.Store>
    </div>
  );
}
