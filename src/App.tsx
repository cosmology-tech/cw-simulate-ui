import { Grid } from "@mui/material";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { lastChainIdState } from "./atoms/simulationPageAtoms";
import { useNotification } from "./atoms/snackbarNotificationState";
import Accounts from "./components/chains/Accounts";
import T1AppBar from "./components/drawer/T1AppBar";
import T1Container from "./components/grid/T1Container";
import LoadingScreen from "./components/screens/LoadingScreen";
import SimulationScreen from "./components/screens/SimulationScreen";
import VoidScreen from "./components/screens/VoidScreen";
import WelcomeScreen from "./components/screens/WelcomeScreen";
import Simulation from "./components/simulation/Simulation";
import { useSession } from "./hooks/useSession";
import useSimulation from "./hooks/useSimulation";
import "./index.css";

function App() {
  const bridge = useSimulation();
  const session = useSession();
  const setNotification = useNotification();
  const loc = useLocation();
  const navigate = useNavigate();
  const setLastChainId = useSetAtom(lastChainIdState);
  
  const refInitial = useRef(true);
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    // only attempt to restore an old session once
    if (session && refInitial.current) {
      const lastChainId = localStorage['lastChainId'];
      
      // only attempt to restore an old session if we have a lastChainId stored upon loadup
      if (!lastChainId) {
        navigate('/');
        refInitial.current = false;
        setLoading(false);
        return;
      }
      
      session.load(bridge, lastChainId)
        .then(() => {
          setNotification('Previous session restored');
          setLastChainId(lastChainId);
          loc.pathname === '/' && navigate('/accounts');
        })
        .catch(() => {
          setNotification('Failed to restore previous session', { severity: 'error' });
          loc.pathname !== '/' && navigate('/');
        })
        .finally(() => {
          refInitial.current = false;
          setLoading(false);
        })
    }
  }, [session]);
  
  if (isLoading) return <LoadingScreen />
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
