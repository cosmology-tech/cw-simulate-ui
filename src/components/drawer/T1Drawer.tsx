import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, ClickAwayListener, Divider, Grid, IconButton, ListItemButton, Paper, styled, SxProps, Theme } from "@mui/material";
import Slide from "@mui/material/Slide";
import TreeView from "@mui/lab/TreeView";
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "./Logo";
import ChainsMenuItem from "./ChainsMenuItem";
import SimulationMenuItem from "./SimulationMenuItem";
import { DEFAULT_CHAIN, GREY_4 } from "../../configs/variables";

type MenuDrawerAPI = {
  register(data: MenuDrawerRegisterOptions): void;
  unregister(nodeId: string): void;
  clearSelection(): void;
}

type MenuDrawerRegisterOptions = MenuDrawerData[string] & {
  nodeId: string;
}

type MenuDrawerData = {
  [nodeId: string]: {
    link?: boolean | string;
  }
}

export const MenuDrawerContext = React.createContext<MenuDrawerAPI>(null as any);

const DrawerHeader = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export interface IT1Drawer {
  barWidth?: number;
  drawerWidth?: number;
}

const T1Drawer = React.memo((props: IT1Drawer) => {
  const {
    barWidth = 50,
    drawerWidth = 250,
  } = props;
  
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <DrawerBar width={barWidth}>
          <IconButton onClick={() => setOpen(curr => !curr)}>
            <MenuIcon />
          </IconButton>
        </DrawerBar>
        <Drawer
          width={drawerWidth}
          open={open}
        >
          <HierarchyMenu
            sx={{
              marginTop: 2,
              '& .MuiTreeItem-content': {
                py: 1,
              },
            }}
          >
            <SimulationMenuItem/>
            <ChainsMenuItem/>
          </HierarchyMenu>
        </Drawer>
      </Box>
    </ClickAwayListener>
  );
});

export default T1Drawer;

interface IDrawerBar {
  children?: ReactNode;
  width: number;
}

const DrawerBar = React.forwardRef<HTMLDivElement | null, IDrawerBar>(({ children, width }, ref) => {
  return (
    <Paper
      ref={ref}
      sx={{
        position: 'relative',
        width,
        height: '100%',
        border: 0,
        borderRadius: 0,
        borderRight: `1px solid ${GREY_4}`,
        zIndex: 100,
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        height="100%"
        sx={{
          pt: 1,
          pb: 1,
        }}
      >
        {children}
      </Grid>
    </Paper>
  );
});

interface ICustomDrawer {
  children?: ReactNode;
  width: number;
  open: boolean;
}

function Drawer({ children, width, open }: ICustomDrawer) {
  return (
    <Slide
      direction="right"
      in={open}
    >
      <Paper
        component="nav"
        sx={{
          position: 'absolute',
          height: '100%',
          top: 0,
          left: '100%',
          width,
          boxSizing: 'border-box',
          border: 0,
          borderRadius: 0,
          borderRight: `1px solid ${GREY_4}`,
          zIndex: 99,
        }}
      >
        <DrawerHeader>
          <Logo LinkComponent={ListItemButton}/>
        </DrawerHeader>
        <Divider/>
        {children}
      </Paper>
    </Slide>
  )
}

interface IHierarchyMenuProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

function HierarchyMenu(props: IHierarchyMenuProps) {
  const {children, sx} = props;

  const navigate = useNavigate();
  const location = useLocation();

  const [expanded, setExpanded] = useState(['chains', `chains/${DEFAULT_CHAIN}`, `${DEFAULT_CHAIN}/codes`]);
  const [selected, setSelected] = useState('');
  const data = useRef<MenuDrawerData>({});

  const api = useMemo<MenuDrawerAPI>(() => ({
    register({nodeId, ...nodeData}) {
      if (nodeId in data)
        throw new Error(`Duplicate node ID ${nodeId}`);
      data.current[nodeId] = nodeData;

      // MUI quirk due to un/mount of subtrees
      const link = extractNodeLink(nodeId, nodeData);
      if (link && link === `${location.pathname}${location.hash}`)
        setSelected(nodeId);
      setExpanded(prev => [...prev, nodeId]);
    },
    unregister(nodeId) {
      delete data.current[nodeId];
      setExpanded(prev => prev.filter(curr => curr !== nodeId));
    },
    clearSelection() {
      setSelected('');
    }
  }), [location]);

  const handleFocusNode = useCallback((e: React.SyntheticEvent, nodeId: string) => {
    const nodeData = data.current[nodeId];
    // MUI quirk: onNodeFocus is called twice, not sure why, seems like a bug...
    if (!nodeData) return;

    const link = extractNodeLink(nodeId, nodeData);
    if (link && location.pathname !== link) {
      setSelected(nodeId);
      navigate(link);
    }
  }, [location]);

  useEffect(() => {
    for (const nodeId in data.current) {
      const link = extractNodeLink(nodeId, data.current[nodeId]);
      if (link && link === `${location.pathname}${location.hash}`)
        setSelected(nodeId);
    }
  }, [location]);

  return (
    <MenuDrawerContext.Provider value={api}>
      <TreeView
        defaultExpandIcon={<SubtreeIcon/>}
        defaultCollapseIcon={<SubtreeIcon expanded/>}
        sx={sx}
        onNodeFocus={handleFocusNode}
        onNodeToggle={(_, nodeIds) => {
          setExpanded(nodeIds);
        }}
        expanded={expanded}
        selected={selected}
      >
        {children}
      </TreeView>
    </MenuDrawerContext.Provider>
  )
}

interface ISubtreeIconProps {
  expanded?: boolean;
}

/** Subtree expand/collapse icon w/ built-in simple CSS animation */
function SubtreeIcon({expanded}: ISubtreeIconProps) {
  return (
    <ChevronRightIcon
      sx={{
        transition: 'transform .15s linear',
        transform: `rotate(${expanded ? '90deg' : '0'})`,
      }}
    />
  )
}

function extractNodeLink(nodeId: string, nodeData: MenuDrawerData[string]) {
  if (nodeData.link === undefined) return false;
  return nodeData.link === true ? `/${nodeId}` : nodeData.link;
}
