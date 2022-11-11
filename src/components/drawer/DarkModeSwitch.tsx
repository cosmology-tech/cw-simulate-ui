import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import { useAtom } from "jotai";
import { darkModeState } from "../../atoms/uiState";

export interface IDarkModeSwitchProps {
  iconColors?: string;
}

export default function DarkModeSwitch(props: IDarkModeSwitchProps) {
  const {
    iconColors = 'grey',
  } = props;

  const [checked, setDarkMode] = useAtom(darkModeState);

  return (
    <Grid item container flex={1} alignItems="center">
      <IconButton onClick={() => setDarkMode(false)}>
        <LightModeIcon sx={{ color: iconColors }} />
      </IconButton>
      <Switch checked={checked} onChange={() => setDarkMode(state => !state)} />
      <IconButton onClick={() => setDarkMode(true)}>
        <DarkModeIcon sx={{ color: iconColors }} />
      </IconButton>
    </Grid>
  )
}
