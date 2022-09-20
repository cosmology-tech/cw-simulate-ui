import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./styles/styles.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MenuDrawer, { drawerWidth } from "./components/MenuDrawer";
import Home from "./components/home/Home";
import Simulation from "./components/simulation/Simulation";
import Chains from "./components/chains/Chains";
import SnackbarNotification from "./components/SnackbarNotification";
import Chain from "./components/chains/Chain";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

const root = ReactDOM.createRoot(document.getElementById("root")!);

// Check if value exists in localStorage. If exists, redirect to /simulation, else redirect to /home
const isSimulationExist = localStorage.getItem("simulationState");

// TODO: Populate window.CWEnv with the data from simulationState/local storage
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <SnackbarNotification />
        <Box sx={{ display: "flex", height: "100%" }}>
          <MenuDrawer />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Toolbar />
            <Routes>
              <Route
                index
                element={
                  isSimulationExist ? (
                    <Navigate replace to="/simulation" />
                  ) : (
                    <Home />
                  )
                }
              />
              <Route path={"/simulation"} element={<Simulation />}>
                <Route path={":instanceId"} element={<Simulation />} />
              </Route>
              <Route path={"/chains"} element={<Chains />}>
                <Route path={":id"} element={<Chain />} />
              </Route>
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>There's nothing here!</p>
                  </main>
                }
              />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
