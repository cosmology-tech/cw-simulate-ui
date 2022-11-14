import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import T1Drawer from "../drawer/T1Drawer";

export interface ISimulationScreen {}

export default function SimulationScreen(props: ISimulationScreen) {
  return (
    <Grid
      item
      container
      direction="row"
      flex={1}
    >
      <T1Drawer
        barWidth={50}
        drawerWidth={250}
      />
      <Grid
        container
        component="main"
        direction="column"
        flex={1}
        sx={{
          p: 3,
          overflow: "hidden",
        }}
      >
        {<Outlet/>}
      </Grid>
    </Grid>
  )
}
