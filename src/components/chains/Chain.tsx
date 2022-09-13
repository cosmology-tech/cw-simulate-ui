import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Grid, IconButton, Typography } from "@mui/material";
import Config from "./Config";
import { useParams } from "react-router-dom";
import State from "./State";
import Accounts from "./Accounts";
import Codes from "./Codes";
import Instances from "./Instances";

export default function Chain() {
  const [value, setValue] = React.useState("config");
  const param = useParams();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
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
      <Grid container xs={11} md={11} lg={10} alignItems="center">
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
                <Tab label="Codes" value="codes" />
                <Tab label="Instances" value="instances" />
              </TabList>
            </Box>
          </TabContext>
        </Grid>
        <Grid
          xs={3}
          md={3}
          lg={2}
          sx={{ display: "flex", justifyContent: "end" }}
        >
          <IconButton aria-label="delete">
            <DeleteForeverIcon />
          </IconButton>
        </Grid>
        <Grid xs={12} lg={12} sm={12} sx={{ marginTop: 4, marginBottom: 2 }}>
          {value === "config" && <Config />}
          {value === "state" && <State />}
          {value === "accounts" && <Accounts />}
          {value === "codes" && <Codes />}
          {value === "instances" && <Instances />}
        </Grid>
      </Grid>
    </Box>
  );
}
