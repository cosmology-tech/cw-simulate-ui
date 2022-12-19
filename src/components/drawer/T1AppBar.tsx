import HelpIcon from "@mui/icons-material/Help";
import GitHubIcon from "@mui/icons-material/GitHub";
import SaveIcon from "@mui/icons-material/Save";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import styled from "@mui/material/styles/styled";
import { useAtomValue } from "jotai";
import React, { useCallback } from "react";
import { lastChainIdState } from "../../atoms/simulationPageAtoms";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { useSession } from "../../hooks/useSession";
import useSimulation from "../../hooks/useSimulation";
import Logo from "./Logo";
import DarkModeSwitch from "./DarkModeSwitch";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({theme}) => ({
  zIndex: theme.zIndex.drawer - 1,
}));

interface IT1AppBarProps {
}

const T1AppBar = React.memo((props: IT1AppBarProps) => {
  const lastChainId = useAtomValue(lastChainIdState);
  const sim = useSimulation();
  const session = useSession();
  const setNotification = useNotification();
  
  const saveSession = useCallback(() => {
    setNotification('Saving session to IndexedDB, this might take a while...', { severity: 'info' });
    setTimeout(async () => {
      try {
        session?.save(sim);
        setNotification('Session saved to IndexedDB.', { severity: 'success' });
      } catch (err: any) {
        console.error('Failed to save session:', err);
        setNotification(`Failed to save session to IndexedDB: ${err.message}`);
      }
    }, 500);
  }, [sim, session]);
  
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <div>
          <Logo LinkComponent={IconButton} white/>
        </div>
        <div>
          <Grid container alignItems="center">
            <DarkModeSwitch iconColors="white" />
            {lastChainId && (
              <IconButton onClick={saveSession} disabled={!session || !lastChainId}>
                <SaveIcon sx={{color: '#fff'}} />
              </IconButton>
            )}
            <IconButton>
              <HelpIcon sx={{color: '#fff'}}/>
            </IconButton>
            <Link href="https://github.com/Terran-One/cw-simulate-ui" sx={{display: 'block'}}>
              <IconButton>
                <GitHubIcon sx={{color: '#fff'}}/>
              </IconButton>
            </Link>
          </Grid>
        </div>
      </Toolbar>
    </AppBar>
  );
});

export default T1AppBar;
