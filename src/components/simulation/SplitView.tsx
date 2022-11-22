import { Grid } from "@mui/material";
import { ReactNode } from "react";

interface ISplitViewProps {
  children?: ReactNode;
  className?: string;
}

export default function SplitView({ children, ...props }: ISplitViewProps) {
  return (
    <Grid
      container
      direction="column"
      spacing={1}
      sx={{
        height: "100%",
        width: "100%",
      }}
      {...props}
    >
      {children}
    </Grid>
  );
}
