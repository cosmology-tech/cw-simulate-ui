import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Divider, Drawer, ListItemButton, styled } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "./Logo";
import ChainsItem from "./ChainsMenuItem";
import SimulationMenuItem from "./SimulationMenuItem";

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
  
  const handleFocusNode = React.useCallback((e: React.SyntheticEvent, value: string) => {
    if (location.pathname === `/${value}`) return;
    navigate(`/${value}`);
  }, [location]);

  // NOTE: TreeView `nodeId`s are used to navigate - prefixed root slash is always prepended.
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
