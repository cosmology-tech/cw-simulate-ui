import { Theme } from "@emotion/react";
import { SxProps, Grid, Paper, styled } from "@mui/material";
import { ReactNode } from "react";
import { GREY_6 } from "../../configs/variables";
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
            borderTop: `1px solid ${GREY_6}`,
          },
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
}
