import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import RemoveIcon from "@mui/icons-material/Remove";
import { styled, SxProps, useTheme } from "@mui/material/styles";
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
import { Alert, Collapse, Divider, Drawer, Input, Link, Snackbar } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { To, useLocation } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from "recoil";
import chainNamesTextFieldState from "../atoms/chainNamesTextFieldState";
import T1Link from "./T1Link";
import chainNamesSortedState from "../atoms/chainNamesSortedState";

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
  const location = useLocation();

  return (
    <>
      <CssBaseline/>
      <T1AppBar />
      {location.pathname !== '/' && <T1Drawer />}
    </>
  );
}

interface ILogoProps {
  LinkComponent: React.ComponentType<React.PropsWithChildren<{
    href: string;
    sx: SxProps<Theme>;
  }>>;
  white?: boolean;
}
const Logo = React.memo((props: ILogoProps) => {
  const {
    LinkComponent,
    white,
  } = props;
  
  return (
    <LinkComponent href="/" sx={{borderRadius: 5}}>
      <img src={white ? "/T1_White.png" : "/T1.png"} height={25} alt={"Terran One"}/>
      <div style={{color: white ? WHITE : ORANGE_3, fontWeight: "bold", fontSize: 14, marginLeft: 10}}>Terran One</div>
    </LinkComponent>
  )
});

interface IT1AppBarProps {}
const T1AppBar = React.memo((props: IT1AppBarProps) => {
  const location = useLocation();
  
  return (
    <AppBar position="fixed" sx={{backgroundColor: ORANGE_3}}>
      <Toolbar sx={{justifyContent: "space-between"}}>
        <div>
          {location.pathname === '/' && <Logo LinkComponent={IconButton} white />}
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
    </AppBar>
  )
});

interface IT1Drawer {}
const T1Drawer = (props: IT1Drawer) => {
  const chains = useRecoilValue(chainNamesSortedState);
  const setChains = useSetRecoilState(chainNamesTextFieldState);
  const [chainsCollapsed, setChainsCollapsed] = React.useState(false);
  const [showAddChain, setShowAddChain] = React.useState(false);
  const [showInvalidChainSnack, setShowInvalidChainSnack] = React.useState(false);
  
  const handleDownloadSim = React.useCallback<React.MouseEventHandler>(e => {
    // TODO
    console.log('not yet implemented');
  }, []);
  
  const addChain = React.useCallback((chainName: string) => {
    setShowAddChain(false);
    setChains(curr => [...curr, chainName]);
  }, []);
  
  return (
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
          <Logo LinkComponent={ListItemButton} />
        </DrawerHeader>
        <Divider/>
        <List>
          <MenuDrawerItem
            to="/simulation"
            buttons={
              <IconButton className="btn-dl-sim">
                <DownloadIcon
                  fontSize="inherit"
                  onClick={handleDownloadSim}
                />
              </IconButton>
            }
          >
            <ListItemText primary="Simulation" sx={{opacity: 1}} />
          </MenuDrawerItem>
          <MenuDrawerItem
            onClick={() => setChainsCollapsed(v => !v)}
            buttons={
              <>
                <IconButton className="btn-add-chain" disabled={showAddChain}>
                  <AddIcon
                    fontSize="inherit"
                    onClick={() => {setShowAddChain(true)}}
                  />
                </IconButton>
              </>
            }
          >
            <ListItemText primary="Chains" sx={{opacity: 1}} />
          </MenuDrawerItem>
          <Collapse orientation="vertical" in={!chainsCollapsed || showAddChain}>
            <List disablePadding>
              {showAddChain && <AddChainItem
                onSubmit={addChain}
                onAbort={() => {
                  setShowAddChain(false);
                  setShowInvalidChainSnack(true);
                  setChainsCollapsed(false);
                }}
              />}
              {chains.map((chain) => (
                <MenuDrawerItem key={chain} to={`/chains/${chain}`}>
                  <ListItemText primary={chain} sx={{opacity: 1, marginLeft: 3}} />
                </MenuDrawerItem>
              ))}
            </List>
          </Collapse>
        </List>
        <Snackbar open={showInvalidChainSnack} autoHideDuration={6000} onClose={() => setShowInvalidChainSnack(false)}>
          <Alert severity="error">
            Chain name is already in use!
          </Alert>
        </Snackbar>
      </Drawer>
    </Box>
  )
};


interface IMenuDrawerItemProps extends React.PropsWithChildren {
  sx?: SxProps<Theme>;
  to?: To;
  buttons?: React.ReactNode;
  hoverButtons?: boolean;
  onClick?(): void;
}
function MenuDrawerItem(props: IMenuDrawerItemProps) {
  const {
    children,
    to,
    buttons,
    hoverButtons = false,
    sx,
    onClick,
  } = props;
  
  const theme = useTheme();
  
  return (
    <ListItem
      disablePadding
      sx={[
        {
          position: "relative",
          display: "block",
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      onClick={onClick}
    >
      <T1Link to={to ?? ''} disabled={!to} sx={{textDecoration: "none"}}>
        <ListItemButton
          sx={{
            display: "flex",
            flexDirection: "row",
            minHeight: 48,
            justifyContent: "initial",
            alignItems: "center",
            px: 2.5,
            pr: buttons ? 1 : undefined,
          }}
        >
          <Box sx={{flex: 1}}>
            {children}
          </Box>
        </ListItemButton>
        {buttons &&
          <Box sx={{
            position: "absolute",
            right: theme.spacing(1),
            top: "50%",
            fontSize: "1.2rem",
            transform: "translateY(-50%)",
          }}>
            {buttons}
          </Box>
        }
      </T1Link>
    </ListItem>
  )
}

interface IAddChainItemProps {
  onSubmit(chainName: string): void;
  onAbort(): void;
}
function AddChainItem(props: IAddChainItemProps) {
  const {
    onSubmit,
    onAbort,
  } = props;
  
  const chains = useRecoilValue(chainNamesTextFieldState);
  const defaultChainName = getDefaultChainName(chains);
  const [chainName, setChainName] = React.useState(defaultChainName);
  const ref = React.useRef<HTMLInputElement>(null);
  
  const submit = React.useCallback(() => {
    if (chains.includes(chainName) || !chainName.trim()) {
      onAbort();
    }
    else {
      onSubmit(chainName);
    }
  }, [chains, chainName]);
  
  return (
    <MenuDrawerItem>
      <Input
        inputRef={ref}
        autoFocus
        defaultValue={defaultChainName}
        onBlur={submit}
        onKeyUp={() => {
          setChainName(ref.current?.value?.toLowerCase() ?? '')
        }}
        onKeyDown={e => {
          switch (e.key) {
            case 'Enter': submit(); break;
            case 'Escape': onAbort(); break;
          }
        }}
        sx={{
          marginLeft: 3,
        }}
      />
    </MenuDrawerItem>
  )
}

function getDefaultChainName(chains: string[]) {
  let i = 1;
  while (chains.includes(`untitled-${i}`)) ++i;
  return `untitled-${i}`;
}
