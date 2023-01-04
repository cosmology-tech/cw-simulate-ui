import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import SegmentIcon from "@mui/icons-material/Segment";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography, { TypographyProps } from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import { TraceLog } from "@terran-one/cw-simulate";
import beautify from "json-beautify-fix";
import React, { PropsWithChildren } from "react";
import { SxProps } from "@mui/material";

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
  onChange,
  disabled,
  sx,
}: {
  onChange: any;
  disabled: boolean;
  sx: SxProps;
}) => {
  return (
    <IconButton
      aria-label="beautify"
      color="primary"
      onClick={() => {
        onChange((payload: string) =>
          beautify(JSON.parse(payload), null, 2, 10)
        );
      }}
      disabled={disabled}
      sx={{ ml: 1 }}
    >
      <SegmentIcon sx={sx} />
      <Typography variant="body2" sx={{ ml: 1, ...sx }}>
        Tidy
      </Typography>
    </IconButton>
  );
};
