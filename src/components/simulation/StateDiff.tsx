import React from "react";
import ReactJsonViewCompare from "react-json-view-compare";
import { Box } from "@mui/material";
import { GREY_6 } from "../../configs/variables";

interface IProps {
  beforeStateJSON: JSON | undefined | any;
  afterStateJSON: JSON | undefined | any;
}

export const StateDiff = ({beforeStateJSON, afterStateJSON}: IProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "scroll",
        padding: 2,
        border: `1px solid ${GREY_6}`,
        maxHeight: "200px",
      }}
    >
      <ReactJsonViewCompare
        oldData={beforeStateJSON}
        newData={afterStateJSON}
      />
    </Box>
  );
};
