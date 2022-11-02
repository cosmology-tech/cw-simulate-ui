import React from "react";
import { JSONTree } from "react-json-tree";
import { Typography } from "@mui/material";
import { GREY_3, GREY_6 } from "../../configs/variables";
import T1Container from "../grid/T1Container";
import ReactDiffViewer from "@terran-one/react-diff-viewer";
import {
  ExecuteTraceLog,
  ReplyTraceLog,
} from "@terran-one/cw-simulate/dist/modules/wasm";

interface IProps {
  beforeState?: string;
  afterState?: string;
  response?: JSON | undefined | any;
  isVisible?: boolean;
  placeholder: string;
  stepTrace?: ExecuteTraceLog | ReplyTraceLog | {};
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

export const OutputCard = ({
  beforeState,
  afterState,
  response,
  placeholder,
  isVisible,
  stepTrace,
}: IProps) => {
  return (
    <T1Container
      sx={{
        border: `1px solid ${GREY_6}`,
        textAlign: "left",
        "> .T1Container-content": {
          pl: 1,
          pr: 1,
        },
      }}
    >
      {stepTrace ? (
        <JSONTree data={stepTrace} theme={theme} invertTheme={false} />
      ) : response !== undefined ? (
        <JSONTree data={response} theme={theme} invertTheme={false} />
      ) : isVisible ? (
        <ReactDiffViewer
          oldValue={beforeState}
          newValue={afterState}
          splitView={false}
        />
      ) : (
        <Typography variant={"body2"} color={GREY_3}>
          {placeholder}
        </Typography>
      )}
    </T1Container>
  );
};
