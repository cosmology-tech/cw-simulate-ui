import { CssBaseline, ThemeProvider } from "@mui/material";
import { useAtomValue } from "jotai";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { darkModeState } from "./atoms/uiState";
import SnackbarNotification from "./components/notification/SnackbarNotification";
import { light as lightTheme, dark as darkTheme } from "./configs/theme";
import { CWSimulationProvider } from "./hooks/useSimulation";
import "./styles/styles.scss";

const root = ReactDOM.createRoot(document.getElementById("root")!);

function Root() {
  const isDark = useAtomValue(darkModeState);
  const theme = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarNotification/>
      <CWSimulationProvider persist="cw-simulate">
        <App/>
      </CWSimulationProvider>
    </ThemeProvider>
  )
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
