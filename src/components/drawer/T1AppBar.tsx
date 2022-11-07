import HelpIcon from "@mui/icons-material/Help";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  IconButton,
  Link,
  styled,
  Toolbar
} from "@mui/material";
import React from "react";
import Logo from "./Logo";

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
  return (
    <AppBar position="static">
      <Toolbar sx={{justifyContent: "space-between"}}>
        <div>
          <Logo LinkComponent={IconButton} white/>
        </div>
        <div>
          <IconButton sx={{borderRadius: 5}}>
            <Link href={"documentation"} underline={"none"}>
              <HelpIcon sx={{color: '#fff'}}/>
            </Link>
          </IconButton>
          <IconButton sx={{borderRadius: 5}}>
            <Link
              href={"https://github.com/Terran-One/cw-debug-ui"}
              underline={"none"}
            >
              <GitHubIcon sx={{color: '#fff'}}/>
            </Link>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
});

export default T1AppBar;
