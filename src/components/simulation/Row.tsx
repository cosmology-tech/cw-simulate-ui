import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import styled from "@mui/material/styles/styled";
import type { SxProps } from "@mui/system/styleFunctionSx";
import { Theme } from "@mui/material/styles/createTheme";
import useTheme from "@mui/material/styles/useTheme";
import { ReactNode } from "react";
import { GridSizeProps } from "../../utils/typeUtils";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

interface IRowProps extends GridSizeProps {
  children?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export default function Row({ children, ...props }: IRowProps) {
  const theme = useTheme();

  return (
    <Grid
      item
      {...props}
      sx={{
        height: "100%",
      }}
    >
      <Grid
        container
        direction="row"
        component={StyledPaper}
        sx={{
          height: "100%",
          overflow: "auto",
          "> .T1Widget-root:not(:first-of-type)": {
            borderTop: `1px solid ${theme.palette.line}`,
          },
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
}
