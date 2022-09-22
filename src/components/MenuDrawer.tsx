import * as React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GitHubIcon from "@mui/icons-material/GitHub";
import HelpIcon from "@mui/icons-material/Help";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import { Divider, Drawer, Link, Menu, MenuItem, Popover, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import { styled, SxProps, Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import simulationState from "../atoms/simulationState";
import { snackbarNotificationState } from "../atoms/snackbarNotificationState";
import { ORANGE_3, WHITE } from "../configs/variables";
import filteredChainsFromSimulationState from "../selectors/filteredChainsFromSimulationState";
import filteredConfigsByChainId from "../selectors/filteredConfigsByChainId";
import { downloadJSON } from "../utils/fileUtils";
import { ChainConfig, creatChainForSimulation } from "../utils/setupSimulation";

export const drawerWidth = 180;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 1,
}));

const DrawerHeader = styled("div")(({ theme }) => ({
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
      <CssBaseline />
      <T1AppBar />
      {location.pathname !== "/" && <T1Drawer />}
    </>
  );
}

interface ILogoProps {
  LinkComponent: React.ComponentType<
    React.PropsWithChildren<{
      href: string;
      sx: SxProps<Theme>;
    }>
  >;
  white?: boolean;
}

const Logo = React.memo((props: ILogoProps) => {
  const { LinkComponent, white } = props;

  return (
    <LinkComponent href="/" sx={{ borderRadius: 5 }}>
      <img
        src={white ? "/T1_White.png" : "/T1.png"}
        height={25}
        alt={"Terran One"}
      />
      <div
        style={{
          color: white ? WHITE : ORANGE_3,
          fontWeight: "bold",
          fontSize: 14,
          marginLeft: 10,
        }}
      >
        Terran One
      </div>
    </LinkComponent>
  );
});

interface IT1AppBarProps {}

const T1AppBar = React.memo((props: IT1AppBarProps) => {
  const location = useLocation();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: ORANGE_3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <div>
          {location.pathname === "/" && (
            <Logo LinkComponent={IconButton} white />
          )}
        </div>
        <div>
          <IconButton sx={{ borderRadius: 5 }}>
            <Link href={"documentation"} underline={"none"}>
              <HelpIcon sx={{ color: WHITE }} />
            </Link>
          </IconButton>
          <IconButton sx={{ borderRadius: 5 }}>
            <Link
              href={"https://github.com/Terran-One/cw-debug-ui"}
              underline={"none"}
            >
              <GitHubIcon sx={{ color: WHITE }} />
            </Link>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
});

interface IT1Drawer {}

const T1Drawer = (props: IT1Drawer) => {
  const param = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const chains = useRecoilValue(filteredChainsFromSimulationState);
  const chainConfig = useRecoilValue(
    filteredConfigsByChainId(param.id as string)
  );
  const chainNames: string[] = chains?.map(
    (chain: { chainId: string }) => chain.chainId
  ).sort((lhs, rhs) => lhs.localeCompare(rhs));
  const [showAddChain, setShowAddChain] = React.useState(false);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(snackbarNotificationState);
  const [simulation, setSimulation] = useRecoilState(simulationState);

  const handleDownloadSim = React.useCallback<React.MouseEventHandler>(
    (e) => {
      e.preventDefault();
      downloadJSON(JSON.stringify(simulation, null, 2), "simulation.json");
    },
    [simulation]
  );

  const handleAddChain = React.useCallback(() => {
    // TODO
    console.log('TODO: add chain')
  }, [])

  const addChain = React.useCallback(
    (chainName: string) => {
      setShowAddChain(false);
      if (chainNames?.includes(chainName)) {
        setSnackbarNotification({
          ...snackbarNotification,
          open: true,
          message: "A chain with such a name already exists",
          severity: "error",
        });
        return;
      }

      setSimulation({
        ...simulation,
        simulation: {
          ...simulation.simulation,
          chains: [
            ...simulation.simulation.chains,
            {
              chainId: chainName,
              bech32Prefix: "terra",
              accounts: [
                {
                  id: "alice",
                  address: "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6",
                  balance: 100000000,
                },
              ],
              codes: [],
              states: [],
            },
          ],
        },
      });

      creatChainForSimulation(window.CWEnv, {
        chainId: chainName,
        bech32Prefix: "terra",
      } as ChainConfig);
    },
    [simulation, chainConfig, snackbarNotification]
  );

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
          <T1TreeItem nodeId="simulation" label="Simulation" />
          <T1TreeItem
            nodeId="chains"
            label="Chains"
            options={[
              <MenuItem onClick={handleAddChain}>Add Chain</MenuItem>
            ]}
          >
            {chainNames.map(chain => (
              <T1TreeItem nodeId={`chains/${chain}`} label={chain} />
            ))}
          </T1TreeItem>
        </TreeView>
      </Drawer>
    </Box>
  );
};

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

interface IT1TreeItemProps {
  children?: React.ReactNode;
  nodeId: string;
  label: string;
  options?: React.ReactNode;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}
function T1TreeItem(props: IT1TreeItemProps) {
  const {
    label,
    options,
    sx,
    ...rest
  } = props;

  const [showOptions, setShowOptions] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const rootRef = React.useRef<Element>(null);
  const optsBtnRef = React.useRef<HTMLButtonElement>(null);

  const handleClickOptions = React.useCallback<React.MouseEventHandler>(e => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions(true);
  }, []);

  return (
    <TreeItem
      ref={rootRef}
      label={
        <Box
          sx={{
            position: 'relative',
            py: 0.5,
          }}
          className="T1TreeItem-label"
        >
          <Typography variant="body1">{label}</Typography>
          {options && (
            <Box
              className="T1TreeItem-optionsButton"
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                opacity: 0,
                pr: 1,
                transition: 'opacity .2s ease-out',
                transform: 'translateY(-50%)',
              }}
              onClick={e => { e.stopPropagation() }}
            >
              <IconButton ref={optsBtnRef} onClick={handleClickOptions}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                open={showOptions}
                onClose={() => setShowOptions(false)}
                anchorEl={optsBtnRef.current}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {options}
              </Menu>
            </Box>
          )}
        </Box>
      }
      sx={[
        {
          '& > .MuiTreeItem-content:hover .T1TreeItem-optionsButton': {
            opacity: 1,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      {...rest}
    />
  )
}

function getDefaultChainName(chains: string[]) {
  let i = 1;
  while (chains?.includes(`untitled-${i}`)) ++i;
  return `untitled-${i}`;
}
