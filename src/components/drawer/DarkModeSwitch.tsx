import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import { useAtom } from "jotai";
import { useCallback } from "react";
import uiState from "../../atoms/uiState";

export interface IDarkModeSwitchProps {
  iconColors?: string;
}

export default function DarkModeSwitch(props: IDarkModeSwitchProps) {
  const {
    iconColors = 'grey',
  } = props;
  
  const [{ dark: checked }, setUIState] = useAtom(uiState);
  
  const onChange = useCallback(() => {
    setUIState(state => ({
      ...state,
      dark: !state.dark,
    }))
  }, []);
  
  const setDarkMode = (set: boolean) => {
    setUIState(state => ({
      ...state,
      dark: set,
    }));
  };
  
  return (
    <Grid item container flex={1} alignItems="center">
      <IconButton onClick={() => setDarkMode(false)}>
        <LightModeIcon sx={{ color: iconColors }} />
      </IconButton>
      <Switch checked={checked} onChange={onChange} />
      <IconButton onClick={() => setDarkMode(true)}>
        <DarkModeIcon sx={{ color: iconColors }} />
      </IconButton>
    </Grid>
  )
}
