import * as React from "react";
import { CSSObject, styled, Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
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
import { useRecoilState } from "recoil";
import consoleLogsAtom from "../atoms/consoleLogsAtom";
import { executeQueryTabAtom } from "../atoms/executeQueryTabAtom";
import { fileUploadedAtom } from "../atoms/fileUploadedAtom";
import { instantiatedAtom } from "../atoms/instantiatedAtom";
import { payloadAtom } from "../atoms/payloadAtom";
import { snackbarNotificationAtom } from "../atoms/snackbarNotificationAtom";
import { IState } from "./ExecuteQuery";
import GridLayout from "./GridLayout";
import SnackbarNotification from "./SnackbarNotification";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MenuDrawer() {
  const theme = useTheme();
  global.window.Buffer = global.window.Buffer || require("buffer").Buffer;
  const [open, setOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(true);
  const [isFileUploaded, setIsFileUploaded] = useRecoilState(fileUploadedAtom);
  const [wasmBuffer, setWasmBuffer] = React.useState<ArrayBuffer | null>(null);
  const [payload, setPayload] = useRecoilState(payloadAtom);
  const [response, setResponse] = React.useState<JSON | undefined>();
  const [allStates, setAllStates] = React.useState<IState[]>([]);
  const [currentState, setCurrentState] = React.useState(0);
  const [executeQueryTab, setExecuteQueryTab] =
    useRecoilState(executeQueryTabAtom);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationAtom
  );
  const [isInstantiated, setIsInstantiated] = useRecoilState(instantiatedAtom);
  const [consoleLogs, setConsoleLogs] = useRecoilState(consoleLogsAtom);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onResetClickHandler = () => {
    setIsFileUploaded(false);
    setWasmBuffer(null);
    setPayload("");
    setAllStates([]);
    setIsInstantiated(false);
    setConsoleLogs([]);
  };

  return (
    <Box sx={{display: "flex"}}>
      <CssBaseline/>
      <AppBar position="fixed" open={open}>
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
            CosmWasm Debugger
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
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
        {isFileUploaded ? (
          <List>
            {["Contracts", "Reset"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{display: "block"}}>
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
              </ListItem>
            ))}
          </List>
        ) : (
          open && (
            <Typography component="div" sx={{textAlign: 'center'}}>No contract uploaded
              yet!</Typography>
          )
        )}
      </Drawer>
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <SnackbarNotification/>
        <DrawerHeader/>
        <GridLayout
          response={response}
          setResponse={setResponse}
          allStates={allStates}
          currentState={currentState}
          setCurrentState={setCurrentState}
          setWasmBuffer={setWasmBuffer}
          setAllStates={setAllStates}
        />
      </Box>
    </Box>
  );
}
