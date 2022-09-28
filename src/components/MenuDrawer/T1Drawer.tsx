import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Divider, Drawer, ListItemButton, styled } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "./Logo";
import ChainsItem from "./ChainsMenuItem";
import SimulationMenuItem from "./SimulationMenuItem";

type MenuDrawerAPI = {
  register(data: MenuDrawerRegisterOptions): void;
  unregister(nodeId: string): void;
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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export interface IT1Drawer {
  width: number;
}

const T1Drawer = React.memo((props: IT1Drawer) => {
  const {
    width: drawerWidth,
  } = props;

  const navigate = useNavigate();
  const location = useLocation();

  const data = useRef<MenuDrawerData>({});
  const api = useMemo<MenuDrawerAPI>(() => ({
    register({nodeId, ...nodeData}) {
      if (nodeId in data)
        throw new Error(`Duplicate node ID ${nodeId}`);
      data.current[nodeId] = nodeData;
    },
    unregister(nodeId) {
      delete data.current[nodeId];
    },
  }), []);

  const handleFocusNode = useCallback((e: React.SyntheticEvent, nodeId: string) => {
    const nodeData = data.current[nodeId];
    if (!nodeData)
      throw new Error(`No data for node ID ${nodeId}`);

    const link = extractNodeLink(nodeId, nodeData);
    if (link && location.pathname !== link)
      navigate(link);
  }, [location]);

  return (
    <Box component="nav">
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        variant="permanent"
        open
      >
        <DrawerHeader>
          <Logo LinkComponent={ListItemButton} />
        </DrawerHeader>
        <Divider />
        <MenuDrawerContext.Provider value={api}>
          <TreeView
            defaultExpandIcon={<SubtreeIcon />}
            defaultCollapseIcon={<SubtreeIcon expanded />}
            sx={{
              marginTop: 2,
              '& .MuiTreeItem-content': {
                py: 1,
              },
            }}
            onNodeFocus={handleFocusNode}
            selected={location.pathname.substring(1)}
          >
            <SimulationMenuItem />
            <ChainsItem />
          </TreeView>
        </MenuDrawerContext.Provider>
      </Drawer>
    </Box>
  );
});

export default T1Drawer;

interface ISubtreeIconProps {
  expanded?: boolean;
}

/** Subtree expand/collapse icon w/ built-in simple CSS animation */
function SubtreeIcon({ expanded }: ISubtreeIconProps) {
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
