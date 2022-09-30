import React from "react";
import { JSONTree } from "react-json-tree";
import { Box, Typography } from "@mui/material";
import { GREY_3, GREY_6 } from "../../configs/variables";

interface IProps {
  response: JSON | undefined | any;
  placeholder: string;
}

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

export const OutputCard = ({ response, placeholder }: IProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
        overflow: "scroll",
        padding: 2,
        border: `1px solid ${GREY_6}`,
        height: "100%",
        textAlign: "left",
      }}
    >
      {response !== undefined ? (
        <JSONTree data={response} theme={theme} invertTheme={false} />
      ) : (
        <Typography variant={"body2"} sx={{ color: `${GREY_3}` }}>
          {placeholder}
        </Typography>
      )}
    </Box>
  );
};
