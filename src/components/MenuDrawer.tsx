import * as React from "react";
import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useRecoilState, useSetRecoilState } from "recoil";
import { fileUploadedState } from "../atoms/fileUploadedState";
import { instantiatedState } from "../atoms/instantiatedState";
import { payloadState } from "../atoms/payloadState";
import { IState } from "./ExecuteQuery";
import { ORANGE_3 } from "../configs/variables";
import { Drawer, Link, Tooltip } from "@mui/material";

const drawerWidth = 240;

const Main = styled("main", {shouldForwardProp: (prop) => prop !== "open"})<{
  open?: boolean;
}>(({theme, open}) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useRecoilState(fileUploadedState);
  const [wasmBuffers, setWasmBuffers] = useState<ArrayBuffer[]>([]);
  const [payload, setPayload] = useRecoilState(payloadState);
  const [allStates, setAllStates] = useState<IState[]>([]);
  const setIsInstantiated = useSetRecoilState(instantiatedState);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onResetClickHandler = () => {
    setIsFileUploaded(false);
    setWasmBuffers([]);
    setPayload("");
    setAllStates([]);
    setIsInstantiated(false);
  };

  return (
    <Box sx={{display: "flex"}}>
      <CssBaseline/>
      <AppBar position="fixed" open={open} sx={{backgroundColor: ORANGE_3}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && {display: "none"}),
            }}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            CosmWasm Simulator
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon/>
            ) : (
              <ChevronLeftIcon/>
            )}
          </IconButton>
        </DrawerHeader>
        <Divider/>
        {/* TODO: Add Chain Status here to get instiantiate instructuctions */}
        <List>
          {["Contracts", "Reset"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{display: "block"}}>
              <Tooltip title={text} placement="right">
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={index === 1 ? onResetClickHandler : undefined}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {index === 0 ? <TextSnippetIcon/> : <RestartAltIcon/>}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{opacity: open ? 1 : 0}}/>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        {/* ) : (
          open && (
            <Typography component="div" sx={{textAlign: 'center'}}>No contract uploaded
              yet!</Typography>
          ) */}
        )
        <List sx={{position: "absolute", bottom: 0}}>
          <ListItem key="Documentation">
            <Link href={"documentation"} underline={"none"}>
              <ListItemText
                primary="Documentation"
                sx={{opacity: open ? 1 : 0}}
              />
            </Link>
          </ListItem>
          <ListItem key="Source Code">
            <Link
              href={"https://github.com/Terran-One/cw-debug-ui"}
              underline={"none"}
            >
              <ListItemText
                primary="Source Code"
                sx={{opacity: open ? 1 : 0}}
              />
            </Link>
          </ListItem>
        </List>
      </Drawer>
      <DrawerHeader/>
    </Box>
  );
}
