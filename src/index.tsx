import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./styles/styles.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MenuDrawer, { DRAWER_WIDTH } from "./components/MenuDrawer";
import Home from "./components/home/Home";
import Simulation from "./components/simulation/Simulation";
import Chains from "./components/chains/Chains";
import SnackbarNotification from "./components/SnackbarNotification";
import Config from "./components/chains/Config";
import State from "./components/chains/State";
import Accounts from "./components/chains/Accounts";
import Codes from "./components/chains/Codes";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import PageRefreshConfirmation from "./components/PageRefreshConfirmation";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <PageRefreshConfirmation />
        <SnackbarNotification />
        <Box sx={{ display: "flex", height: "100%" }}>
          <MenuDrawer />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
              display: "flex",
              flexDirection: "column",
              overflow: "scroll",
            }}
          >
            <Toolbar />
            <Routes>
              <Route
                index
                element={
                  <Home />
                }
              />

              <Route path={"/simulation"} element={<Simulation />}>
                <Route path={":instanceId"} element={<Simulation />} />
              </Route>

              {/* <Chains /> ensures the :chainId exists. Do not remove. */}
              <Route path="/chains" element={<Chains />}>
                <Route path=":chainId/config" element={<Config />} />
                <Route path=":chainId/state" element={<State />} />
                <Route path=":chainId/accounts" element={<Accounts />} />
                <Route path=":chainId/codes" element={<Codes />} />
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
