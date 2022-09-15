import * as React from "react";
import { styled, SxProps } from "@mui/material/styles";
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
import { Collapse, Divider, Drawer, Link } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { To, useLocation } from 'react-router-dom';
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
  // const chains = useRecoilValue(chainNamesTextFieldState);
  const chains = ['terra-1', 'cosmos-1', 'secret-1'].sort();
  const [chainsCollapsed, setChainsCollapsed] = React.useState(false);
  
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
          <MenuDrawerItem to="/simulation">
            <ListItemText primary="Simulation" sx={{opacity: 1}} />
          </MenuDrawerItem>
          <MenuDrawerItem onClick={() => setChainsCollapsed(v => !v)}>
            <ListItemText primary="Chains" sx={{opacity: 1}} />
          </MenuDrawerItem>
          <Collapse orientation="vertical" in={!chainsCollapsed}>
            {chains.map((chain) => (
              <MenuDrawerItem to={`/chains/${chain}`} key={chain}>
                <ListItemText primary={chain} sx={{opacity: 1, marginLeft: 3}} />
              </MenuDrawerItem>
            ))}
          </Collapse>
        </List>
      </Drawer>
    </Box>
  )
};


interface IMenuDrawerItemProps extends React.PropsWithChildren {
  sx?: SxProps<Theme>;
  to?: To;
  onClick?(): void;
}
function MenuDrawerItem(props: IMenuDrawerItemProps) {
  const {
    children,
    to,
    sx,
    onClick,
  } = props;
  
  return (
    <ListItem
      disablePadding
      sx={[{display: "block"}, ...(Array.isArray(sx) ? sx : [sx])]}
      onClick={onClick}
    >
      <T1Link to={to ?? ''} disabled={!to} sx={{textDecoration: "none"}}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: "initial",
            px: 2.5,
          }}
        >
          {children}
        </ListItemButton>
      </T1Link>
    </ListItem>
  )
}
