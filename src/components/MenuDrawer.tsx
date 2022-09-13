import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import HelpIcon from "@mui/icons-material/Help";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ORANGE_3, WHITE } from "../configs/variables";
import { Divider, Drawer, Link } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';

export const drawerWidth = 180;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({theme}) => ({
  zIndex: theme.zIndex.drawer - 1
}));

const DrawerHeader = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function MenuDrawer() {
  const navigate = useNavigate();
  const location = useLocation();

  const welcomeScreenLogo = (
    <IconButton sx={{borderRadius: 5}} onClick={() => navigate("/")}>
      <img src="/T1_White.png" height="25px" alt={"Terran One"}/>
      <div style={{color: WHITE, fontWeight: "bold", fontSize: 14, marginLeft: 10}}>Terran One</div>
    </IconButton>
  );

  const appBar = (
    <AppBar position="fixed" sx={{backgroundColor: ORANGE_3}}>
      <Toolbar sx={{justifyContent: "space-between"}}>
        <div>
          {location.pathname === '/' && welcomeScreenLogo}
        </div>
        <div>
          <IconButton sx={{ borderRadius: 5 }}>
            <Link href={"documentation"} underline={"none"}>
              <HelpIcon sx={{color: WHITE}} />
            </Link>
          </IconButton>
          <IconButton sx={{ borderRadius: 5 }}>
            <Link href={"https://github.com/Terran-One/cw-debug-ui"} underline={"none"}>
              <GitHubIcon sx={{color: WHITE}} />
            </Link>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>);

  const drawer = (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        open
      >
        <DrawerHeader>
          <ListItemButton sx={{borderRadius: 5}} onClick={() => navigate("/")}>
            <img src="/T1.png" height="25px" alt={"Terran One"}/>
            <div style={{color: ORANGE_3, fontWeight: "bold", fontSize: 14, marginLeft: 10}}>Terran One</div>
          </ListItemButton>
        </DrawerHeader>
        <Divider/>
        {/* TODO: Add Chain Status here to get instiantiate instructuctions */}
        <List>
          {["Simulation", "History", "Chains", "phoenix-1", "juno-1"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{display: "block"}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "initial",
                  px: 2.5,
                  "&.MuiButtonBase-root:hover": index === 2 && {
                    bgcolor: "transparent",
                    cursor: "default"
                  } || {}
                }}
              >
                <ListItemText primary={text} sx={{opacity: 1, marginLeft: index > 2 && 3 || undefined}}/>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>);

  return (
    <>
      <CssBaseline/>
      {appBar}
      {location.pathname !== '/' && drawer}
    </>
  );
}
