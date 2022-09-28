import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Grid, Typography } from "@mui/material";
import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Accounts from "./Accounts";
import Codes from "./Codes";
import Config from "./Config";
import State from "./State";
import { useRecoilValue } from "recoil";
import filteredChainsFromSimulationState from "../../selectors/filteredChainsFromSimulationState";

export default function Chain() {
  const location = useLocation();
  const openTab = location.hash.split("#")[1];
  const currentActive = openTab && openTab.length > 0 ? openTab : "";
  const [value, setValue] = React.useState("config");
  const params = useParams();
  const chainId = params.id!;
  const chains = useRecoilValue(filteredChainsFromSimulationState);

  const navigate = useNavigate();
  const handleChange = (_: any, newValue: string) => {
    navigate(`#${newValue}`);
    setValue(newValue);
  };

  React.useEffect(() => {
    if (currentActive.length > 0) {
      setValue(currentActive);
    }
  }, [currentActive]);

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
      {chainId in chains ? (
        <Grid container item xs={11} md={11} lg={10} alignItems="center">
          <Grid item xs={3} md={3} lg={4}>
            <Typography variant="h5">{chainId}</Typography>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <TabContext value={value}>
              <Box>
                <TabList
                  onChange={handleChange}
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
                </TabList>
              </Box>
            </TabContext>
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
            {value === "accounts" && <Accounts chainId={chainId} />}
            {value === "codes" && <Codes chainId={chainId} />}
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          Chain not found.
        </Typography>
      )}
    </Box>
  );
}
