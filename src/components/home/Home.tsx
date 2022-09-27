import * as React from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import "../../index.css";

const Home = () => {
  const [wasmBuffers, setWasmBuffers] = React.useState<ArrayBuffer[]>([]);

  const handler = function(event: any) {
    event.preventDefault();
    event.returnValue = '';
    return null;
  };

  window.addEventListener('beforeunload', handler);

  return (
    <WelcomeScreen
      wasmBuffers={wasmBuffers}
      setWasmBuffers={setWasmBuffers}
    />
  );
};

export default Home;
