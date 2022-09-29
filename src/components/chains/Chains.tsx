import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import React from "react";
import { ScreenSearchDesktopOutlined } from "@mui/icons-material";
import filteredChainsFromSimulationState from "../../selectors/filteredChainsFromSimulationState";
import { Outlet, useParams } from "react-router-dom";

const Chains = () => {
  const params = useParams();
  const chainId = params.chainId!;
  const chains = useRecoilValue(filteredChainsFromSimulationState);

  if (chainId in chains) {
    return <Outlet />
  }

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
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          placeItems: "center",
          padding: "10px",
        }}
        container
        item
        xs={11}
        md={11}
        lg={10}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "grid",
            marginTop: 4,
            marginBottom: 4,
            width: "60%",
            borderRadius: "5px",
            height: "50vh",
            alignItems: "center",
          }}
        >
          <Stack sx={{ textAlign: "center", alignItems: "center" }}>
            <ScreenSearchDesktopOutlined sx={{ fontSize: "100px" }} />
            <Typography variant="h6">
              No chain selected.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chains;
