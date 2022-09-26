import * as React from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import "../../index.css";

const Home = () => {
  const [wasmBuffers, setWasmBuffers] = React.useState<ArrayBuffer[]>([]);

  React.useEffect(() => {
    window.onbeforeunload = function(evt) {
      evt.preventDefault();
      evt.returnValue = '';
      return null;
    };
  }, []);

  return (
    <WelcomeScreen
      wasmBuffers={wasmBuffers}
      setWasmBuffers={setWasmBuffers}
    />
  );
};

export default Home;
