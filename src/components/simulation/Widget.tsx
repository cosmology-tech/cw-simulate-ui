import { Theme } from "@emotion/react";
import { SxProps, Grid } from "@mui/material";
import { ReactNode } from "react";

interface IWidgetProps {
  children?: ReactNode;
  /** An optional size between 1-12. At 12, size is 100%. Lower values are multiples of 100%/12. Default is 12. */
  size?: number;
  className?: string;
  sx?: SxProps<Theme>;
}

export default function Widget({
  children,
  size = 12,
  className,
  sx,
  ...props
}: IWidgetProps) {
  return (
    <Grid
      item
      sx={[
        {
          p: 2,
          height: `${(100 * size) / 12}%`,
          overflow: "auto",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      className={`T1Widget-root ${className}`}
      {...props}
    >
      {children}
    </Grid>
  );
}
