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
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import chainNamesTextFieldState from "../atoms/chainNamesTextFieldState";
import T1Link from "./T1Link";

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
  const chains = useRecoilValue(chainNamesTextFieldState);

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
          <IconButton sx={{borderRadius: 5}}>
            <Link href={"documentation"} underline={"none"}>
              <HelpIcon sx={{color: WHITE}}/>
            </Link>
          </IconButton>
          <IconButton sx={{borderRadius: 5}}>
            <Link href={"https://github.com/Terran-One/cw-debug-ui"} underline={"none"}>
              <GitHubIcon sx={{color: WHITE}}/>
            </Link>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>);

  const drawer = (
    <Box component="nav" sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}>
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
            <div style={{color: ORANGE_3, fontWeight: "bold", fontSize: 14, marginLeft: 10}}>Terran
              One
            </div>
          </ListItemButton>
        </DrawerHeader>
        <Divider/>
        <List>
          {["Simulation", "History", "Chains"].map((text, index) => (
            <T1Link to={`${text.toLowerCase()}`} sx={{textDecoration: "none"}}>
              <ListItem key={text} disablePadding sx={{display: "block"}}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: "initial",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={text} sx={{opacity: 1}}/>
                </ListItemButton>
              </ListItem>
            </T1Link>
          ))}
          {chains.map((chain) => (
            <T1Link to={`/chains/${chain}`} sx={{textDecoration: "none"}}>
              <ListItem key={chain} disablePadding sx={{display: "block"}}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: "initial",
                    px: 2.5,
                  }}
                >
                  <ListItemText primary={chain} sx={{opacity: 1, marginLeft: 3}}/>
                </ListItemButton>
              </ListItem>
            </T1Link>
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
