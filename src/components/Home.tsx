import SnackbarNotification from "./SnackbarNotification";
import GridLayout from "./GridLayout";
import Box from "@mui/material/Box";
import * as React from "react";
import { IState } from "./ExecuteQuery";

const Home = () => {
  const [wasmBuffers, setWasmBuffers] = React.useState<ArrayBuffer[]>([]);
  const [response, setResponse] = React.useState<JSON | undefined>();
  const [allStates, setAllStates] = React.useState<IState[]>([]);
  const [currentState, setCurrentState] = React.useState(0);
  return (
    <Box component="main" sx={{flexGrow: 1, p: 3}}>
      <SnackbarNotification/>
      <GridLayout
        response={response}
        setResponse={setResponse}
        allStates={allStates}
        currentState={currentState}
        setCurrentState={setCurrentState}
        setWasmBuffers={setWasmBuffers}
        wasmBuffers={wasmBuffers}
        setAllStates={setAllStates}
      />
    </Box>
  )
}

export default Home;
