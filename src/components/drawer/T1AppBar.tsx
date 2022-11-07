import HelpIcon from "@mui/icons-material/Help";
import GitHubIcon from "@mui/icons-material/GitHub";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import styled from "@mui/material/styles/styled";
import React from "react";
import Logo from "./Logo";
import DarkModeSwitch from "./DarkModeSwitch";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <div>
          <Logo LinkComponent={IconButton} white/>
        </div>
        <div>
          <Grid container alignItems="center">
            <DarkModeSwitch iconColors="white" />
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
