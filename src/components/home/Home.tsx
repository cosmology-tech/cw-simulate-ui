import * as React from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import "../../index.css";

const Home = () => {
  const [wasmBuffers, setWasmBuffers] = React.useState<ArrayBuffer[]>([]);
  return (
    <WelcomeScreen
      wasmBuffers={wasmBuffers}
      setWasmBuffers={setWasmBuffers}
    />
  );
};

export default Home;
