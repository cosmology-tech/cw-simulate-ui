import Paper from "@mui/material/Paper";
import Typography, { TypographyProps } from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import { TraceLog } from "@terran-one/cw-simulate";
import React, { PropsWithChildren } from "react";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import { IconButton, Tooltip } from "@mui/material";
const beautify = require("json-beautify");

export interface IInspectorTabProps {
  traceLog: TraceLog | undefined;
}

export const TabPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.08)",
  overflow: "auto",
  maxHeight: "100%",
}));

export const TabHeader = React.memo(({ children }: PropsWithChildren) => {
  return (
    <Typography variant="h6" fontWeight="bold" mb={1}>
      {children}
    </Typography>
  );
});

export const EmptyTab = styled(
  ({ children = "Nothing to see here.", ...props }: TypographyProps) => (
    <Typography variant="body2" {...props}>
      {children}
    </Typography>
  )
)(({ theme }) => ({
  textAlign: "center",
  fontStyle: "italic",
  color: theme.palette.grey[500],
}));

export const BeautifyJSON = ({
  payload,
  setPayload,
  isValid,
}: {
  payload: string;
  setPayload: (val: string) => void;
  isValid: boolean;
}) => {
  return (
    <Tooltip title="Beautify JSON">
      <IconButton
        aria-label="beautify"
        color="primary"
        onClick={() => {
          setPayload(beautify(JSON.parse(payload), null, 2, 100));
        }}
        disabled={!payload.length || !isValid}
        sx={{ ml: 1 }}
      >
        <BrushOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};
