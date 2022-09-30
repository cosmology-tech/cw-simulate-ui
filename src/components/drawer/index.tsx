import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocation } from "react-router-dom";
import T1AppBar from "./T1AppBar";
import T1Drawer from "./T1Drawer";

export const DRAWER_WIDTH = 250;

export default function MenuDrawer() {
  const location = useLocation();

  return (
    <>
      <CssBaseline />
      <T1AppBar />
      {location.pathname !== "/" && <T1Drawer width={DRAWER_WIDTH} />}
    </>
  );
}
