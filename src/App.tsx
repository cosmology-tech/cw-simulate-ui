import { Box, Grid, SxProps, Theme } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import State from "./components/chains/State";
import Config from "./components/chains/Config";
import Accounts from "./components/chains/Accounts";
import MenuDrawer from "./components/drawer";
import Home from "./components/home/Home";
import VoidScreen from "./components/home/VoidScreen";
import Simulation from "./components/simulation/Simulation";

function App() {
  const rootSx: SxProps<Theme> = {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    pt: '70px',
  };

  return (
    <Box sx={rootSx} className="T1App-root">
      <MenuDrawer/>
      <Grid
        container
        component="main"
        direction="column"
        flex={1}
        sx={{
          p: 3,
          overflow: "hidden",
        }}
      >
        <Routes>
          <Route index element={<Home/>}/>

          {/*TODO: A CWSimulateApp only contain a single chain. Wrap everything under /simulation instead*/}
          {/* <Chains /> ensures the :chainId exists. Do not remove. */}
          <Route path="config" element={<Config/>}/>
          <Route path="state" element={<State/>}/>
          <Route path="accounts" element={<Accounts/>}/>
          <Route path="instances/:instanceAddress" element={<Simulation/>}/>

          <Route path="*" element={<VoidScreen/>}/>
        </Routes>
      </Grid>
    </Box>
  );
}

export default App;
