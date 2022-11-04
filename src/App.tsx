import { Grid, SxProps, Theme } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import State from "./components/chains/State";
import Config from "./components/chains/Config";
import Accounts from "./components/chains/Accounts";
import T1AppBar from "./components/drawer/T1AppBar";
import Home from "./components/home/Home";
import VoidScreen from "./components/home/VoidScreen";
import MainScreen from "./components/simulation/MainScreen";
import Simulation from "./components/simulation/Simulation";

function App() {
  return (
    <Grid container direction="column" width="100vw" height="100vh" className="T1App-root">
      <T1AppBar />
      <Routes>
        <Route index element={<Home/>}/>

        <Route element={<MainScreen/>}>
          {/*TODO: A CWSimulateApp only contain a single chain. Wrap everything under /simulation instead*/}
          {/* <Chains /> ensures the :chainId exists. Do not remove. */}
          <Route path="config" element={<Config/>}/>
          <Route path="state" element={<State/>}/>
          <Route path="accounts" element={<Accounts/>}/>
          <Route path="instances/:instanceAddress" element={<Simulation/>}/>
        </Route>

        <Route path="*" element={<VoidScreen/>}/>
      </Routes>
    </Grid>
  );
}

export default App;
