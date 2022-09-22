import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Grid, IconButton, Typography } from "@mui/material";
import Config from "./Config";
import { useNavigate, useParams } from "react-router-dom";
import State from "./State";
import Accounts from "./Accounts";
import CodesAndInstances from "./CodesAndInstances";
import { useRecoilState } from "recoil";
import simulationState from "../../atoms/simulationState";
import { snackbarNotificationState } from "../../atoms/snackbarNotificationState";

export default function Chain() {
  const [value, setValue] = React.useState("config");
  const [simulation, setSimulation] = useRecoilState(simulationState);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationState
  );
  const param = useParams();
  const navigate = useNavigate();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleOnDeleteChain = () => {
    let newSimulation = { ...simulation };
    const prevChains = newSimulation.simulation.chains;
    const newChains = prevChains.filter(
      (chain: any) => chain.chainId !== param.id
    );
    newSimulation = {
      ...newSimulation,
      simulation: {
        ...newSimulation.simulation,
        chains: newChains,
      },
    };
    setSimulation(newSimulation);
    setSnackbarNotification({
      ...snackbarNotification,
      open: true,
      message: "Chain deleted successfully",
      severity: "success",
    });
    navigate("/chains");
  };

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        marginTop: 4,
        marginBottom: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid container item xs={11} md={11} lg={10} alignItems="center">
        <Grid item xs={3} md={3} lg={4}>
          <Typography variant="h5">{param.id}</Typography>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                sx={{
                  "& .MuiTabs-scroller": {
                    overflow: "scroll !important",
                  },
                }}
              >
                <Tab label="Config" value="config" />
                <Tab label="State" value="state" />
                <Tab label="Accounts" value="accounts" />
                <Tab label="Codes And Instances" value="codesAndInstances" />
              </TabList>
            </Box>
          </TabContext>
        </Grid>
        <Grid
          item
          xs={3}
          md={3}
          lg={2}
          sx={{ display: "flex", justifyContent: "end" }}
        >
          <IconButton aria-label="delete" onClick={handleOnDeleteChain}>
            <DeleteForeverIcon />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={12}
          lg={12}
          sm={12}
          sx={{ marginTop: 4, marginBottom: 2 }}
        >
          {value === "config" && <Config />}
          {value === "state" && <State />}
          {value === "accounts" && <Accounts />}
          {value === "codesAndInstances" && <CodesAndInstances />}
        </Grid>
      </Grid>
    </Box>
  );
}
