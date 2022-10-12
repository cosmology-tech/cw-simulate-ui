import { Paper, Grid, Box, Typography, Divider } from "@mui/material";
import React from "react";
import { JSONTree } from "react-json-tree";

const theme = {
  scheme: "chalk",
  author: "chris kempson (http://chriskempson.com)",
  base00: "#FFFFFF",
  base01: "#202020",
  base02: "#303030",
  base03: "#505050",
  base04: "#b0b0b0",
  base05: "#d0d0d0",
  base06: "#e0e0e0",
  base07: "#f5f5f5",
  base08: "#fb9fb1",
  base09: "#eda987",
  base0A: "#ddb26f",
  base0B: "#acc267",
  base0C: "#12cfc0",
  base0D: "#6fc2ef",
  base0E: "#e1a3ee",
  base0F: "#deaf8f",
};
interface IProps {
  request: any;
  response: any;
}
export const RequestResponse = ({ request, response }: IProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        height: "30vh",
        overflow: "auto",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid rgb(0, 0, 0, 0.12)",
      }}
    >
      <Grid
        item
        container
        direction="column"
        xs={12}
        sx={{
          position: "relative",
          overflow: "auto",
          mb: 1,
        }}
      >
        <Box sx={{ position: "sticky", top: 0 }}>
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "sticky",
            }}
          >
            Request
          </Typography>
          <Divider orientation="horizontal" />
        </Box>
        <Box
          sx={{
            overflow: "auto",
            marginLeft: "1rem",
          }}
        >
          <JSONTree data={request} theme={theme} invertTheme={false} />
        </Box>
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          position: "relative",
        }}
      >
        <Box sx={{ position: "sticky", top: 0 }}>
          <Divider orientation="horizontal" />
          <Typography
            variant="caption"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Response
          </Typography>
          <Divider orientation="horizontal" />
        </Box>
        <Box
          sx={{
            overflow: "auto",
            marginLeft: "1rem",
          }}
        >
          <JSONTree data={response} theme={theme} invertTheme={false} />
        </Box>
      </Grid>
    </Paper>
  );
};
