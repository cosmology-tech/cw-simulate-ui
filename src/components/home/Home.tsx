import SnackbarNotification from "../SnackbarNotification";
import Box from "@mui/material/Box";
import * as React from "react";
import { IState } from "../ExecuteQuery";
import { WelcomeScreen } from "./WelcomeScreen";
import "../../index.css";

const Home = () => {
  const [wasmBuffers, setWasmBuffers] = React.useState<ArrayBuffer[]>([]);
  const [response, setResponse] = React.useState<JSON | undefined>();
  const [allStates, setAllStates] = React.useState<IState[]>([]);
  const [currentState, setCurrentState] = React.useState(0);
  return (
    <Box component="main" sx={{flexGrow: 1, p: 3}}>
      <SnackbarNotification/>
      <WelcomeScreen
        wasmBuffers={wasmBuffers}
        setWasmBuffers={setWasmBuffers}
      />
    </Box>
  );
};

export default Home;
