import ArticleIcon from "@mui/icons-material/Article";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Tooltip from "@mui/material/Tooltip";
import React, { MouseEvent, ReactNode, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GREY_4 } from "../../configs/variables";
import ContractsSubMenu from "./ContractsSubMenu";
import InstancesSubMenu from "./InstancesSubMenu";
import ConfigSubMenu from "./ConfigSubMenu";

type SubMenu = 'contracts' | 'instances' | 'states' | 'accounts' | 'config';

export interface IT1Drawer {
  barWidth?: number;
  drawerWidth?: number;
}

const T1Drawer = React.memo((props: IT1Drawer) => {
  const {
    barWidth = 50,
    drawerWidth = 250,
  } = props;

  const navigate = useNavigate();
  const [menu, setMenu] = useState<SubMenu | undefined>(undefined);

  return (
    <ClickAwayListener onClickAway={() => setMenu(undefined)}>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <DrawerBar width={barWidth}>
          <MenuIconButton
            menu="contracts"
            Icon={ArticleIcon}
            setMenu={setMenu}
            tooltip="Contracts"
          />
          <MenuIconButton
            menu="instances"
            Icon={DeveloperBoardIcon}
            setMenu={setMenu}
            tooltip="Contract Instances"
          />
          <MenuIconButton
            menu="states"
            Icon={StorageIcon}
            setMenu={setMenu}
            tooltip="All States"
            onClick={() => {navigate('/state')}}
          />
          <MenuIconButton
            menu="accounts"
            Icon={RecentActorsIcon}
            setMenu={setMenu}
            tooltip="Accounts"
            onClick={() => {navigate('/accounts')}}
          />
          <MenuIconButton
            menu="config"
            Icon={SettingsIcon}
            setMenu={setMenu}
            tooltip="Chain Configuration"
          />
        </DrawerBar>
        <SubMenu width={drawerWidth} menu={menu} />
      </Box>
    </ClickAwayListener>
  );
});

export default T1Drawer;

interface ISubMenuProps {
  menu: SubMenu | undefined;
  width: number;
}

function SubMenu({ menu, width }: ISubMenuProps) {
  const contents = (() => {
    switch (menu) {
      case 'contracts': return <ContractsSubMenu />;
      case 'instances': return <InstancesSubMenu />;
      case 'config': return <ConfigSubMenu />;
      default: return null;
    }
  })();

  return (
    <Drawer width={width} open={!!contents}>
      {contents}
    </Drawer>
  )
}

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
        {children}
      </Paper>
    </Slide>
  )
}

interface IMenuIconButtonProps {
  menu: SubMenu;
  tooltip?: string;
  Icon: React.ElementType<{}>;
  setMenu(setter: (curr: SubMenu | undefined) => SubMenu | undefined): void;
  onClick?(e: MouseEvent): void;
}

function MenuIconButton({
  menu,
  tooltip,
  setMenu,
  Icon,
  onClick: _onClick,
}: IMenuIconButtonProps)
{
  const onClick = useCallback((e: MouseEvent) => {
    _onClick?.(e);
    if (!e.isDefaultPrevented()) {
      setMenu(curr => curr !== menu ? menu : undefined);
    }
  }, [menu, _onClick]);

  return (
    <Tooltip
      title={tooltip}
      placement="right"
    >
      <IconButton onClick={onClick}>
        <Icon />
      </IconButton>
    </Tooltip>
  )
}
