import { Grid } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Accounts from "./components/chains/Accounts";
import T1AppBar from "./components/drawer/T1AppBar";
import VoidScreen from "./components/screens/VoidScreen";
import SimulationScreen from "./components/screens/SimulationScreen";
import WelcomeScreen from "./components/screens/WelcomeScreen";
import Simulation from "./components/simulation/Simulation";
import T1Container from "./components/grid/T1Container";
import "./index.css";

function App() {
  return (
    <Grid container direction="column" width="100vw" height="100vh" className="T1App-root">
      <T1AppBar/>
      <Grid item flex={1} sx={{display: 'relative'}}>
        <T1Container>
          <Grid container width="100%" height="100%">
            <Routes>
              <Route index element={<WelcomeScreen/>}/>
              <Route element={<SimulationScreen/>}>
                <Route path="accounts" element={<Accounts/>}/>
                <Route path="instances/:instanceAddress" element={<Simulation/>}/>
              </Route>
              <Route path="*" element={<VoidScreen/>}/>
            </Routes>
          </Grid>
        </T1Container>
      </Grid>
    </Grid>
  );
}

export default App;
