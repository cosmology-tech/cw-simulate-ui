import Paper from "@mui/material/Paper";
import Typography, { TypographyProps } from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import { TraceLog } from "@terran-one/cw-simulate";
import React, { PropsWithChildren } from "react";

export interface IInspectorTabProps {
  traceLog: TraceLog | undefined;
}

export const TabPaper = styled(Paper)(({theme}) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.08)',
  overflow: 'auto',
  maxHeight: 250,
}));

export const TabHeader = React.memo(({ children }: PropsWithChildren) => {
  return (
    <Typography variant="h6" fontWeight="bold" mb={1}>
      {children}
    </Typography>
  )
});

export const EmptyTab = styled(({ children = 'Nothing to see here.', ...props }: TypographyProps) => (
  <Typography variant="body2" {...props}>{children}</Typography>
))(({ theme }) => ({
  textAlign: 'center',
  fontStyle: 'italic',
  color: theme.palette.grey[500],
}));
