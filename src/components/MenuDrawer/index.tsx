import * as React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocation } from "react-router-dom";
import T1AppBar from "./T1AppBar";
import T1Drawer from "./T1Drawer";

export const DRAWER_WIDTH = 180;

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
